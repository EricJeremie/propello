// generate-proposal — server-side proxy to the Google Gemini API (free tier).
// Holds GEMINI_API_KEY as a Supabase secret so the browser never needs it.
// Get a free key at https://aistudio.google.com/app/apikey, then set it:
//   Dashboard > Edge Functions > Manage secrets  (or `supabase secrets set GEMINI_API_KEY=...`).
//
// Requires a signed-in user: the caller must send
// `Authorization: Bearer <supabase-session-access-token>`.
//
// The browser still sends an Anthropic-Messages-shaped request body (model,
// system, messages, output_config.format.schema, etc.) — this function
// translates that into a Gemini generateContent request and translates the
// response back into the `{ content: [{ type: 'text', text }] }` shape the
// front end expects.

const SUPABASE_URL = 'https://xiykfvyjavkkmfqujcql.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CoqmS7OUcHBQ55Ho22xgyg_RYYtUoLk';
const GEMINI_MODEL = 'gemini-2.5-flash';

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'content-type': 'application/json' },
  });
}

// Gemini's responseSchema only supports a subset of JSON Schema (no
// "additionalProperties"). Strip unsupported keys recursively.
function toGeminiSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  if (schema && typeof schema === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(schema as Record<string, unknown>)) {
      if (k === 'additionalProperties') continue;
      out[k] = toGeminiSchema(v);
    }
    return out;
  }
  return schema;
}

// Anthropic-style `content` blocks -> Gemini `parts`.
function toGeminiParts(content: unknown): unknown[] {
  if (typeof content === 'string') return [{ text: content }];
  if (!Array.isArray(content)) return [];
  const parts: unknown[] = [];
  for (const block of content as Array<Record<string, unknown>>) {
    if (block.type === 'text') {
      parts.push({ text: block.text });
    } else if (block.type === 'document') {
      const source = block.source as Record<string, unknown> | undefined;
      if (source && source.type === 'base64') {
        parts.push({ inline_data: { mime_type: source.media_type, data: source.data } });
      }
    }
  }
  return parts;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: { message: 'Method not allowed' } }, 405);

  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) {
    return json({ error: { message: 'Server is missing GEMINI_API_KEY. Set it as a Supabase secret.' } }, 501);
  }

  // --- Require a signed-in user ---
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    return json({ error: { message: 'You must be signed in to generate a proposal.' } }, 401);
  }
  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON_KEY, authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) {
      return json({ error: { message: 'Your session is invalid or expired. Please sign in again.' } }, 401);
    }
    const user = await userRes.json();
    if (!user || !user.id) {
      return json({ error: { message: 'Your session is invalid or expired. Please sign in again.' } }, 401);
    }
  } catch {
    return json({ error: { message: 'Could not verify your session. Please try again.' } }, 502);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: { message: 'Invalid JSON body' } }, 400);
  }

  // --- Translate the Anthropic-shaped request body into a Gemini request ---
  const messages = (body.messages as Array<Record<string, unknown>>) || [];
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: toGeminiParts(m.content),
  }));

  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: body.max_tokens ?? 16000,
  };
  const outputConfig = body.output_config as Record<string, unknown> | undefined;
  const format = outputConfig?.format as Record<string, unknown> | undefined;
  if (format?.schema) {
    generationConfig.responseMimeType = 'application/json';
    generationConfig.responseSchema = toGeminiSchema(format.schema);
  }

  const geminiBody: Record<string, unknown> = { contents, generationConfig };
  if (body.system) {
    geminiBody.systemInstruction = { parts: [{ text: body.system }] };
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(geminiBody),
      },
    );
    const data = await upstream.json();

    if (!upstream.ok) {
      const msg = data?.error?.message || `Gemini error (HTTP ${upstream.status})`;
      return json({ error: { message: msg } }, upstream.status);
    }

    const candidate = data?.candidates?.[0];
    const text = (candidate?.content?.parts || [])
      .map((p: Record<string, unknown>) => p.text || '')
      .join('');

    if (!text) {
      const reason = candidate?.finishReason ? ` (finish reason: ${candidate.finishReason})` : '';
      return json({ error: { message: `Gemini returned no content${reason}.` } }, 502);
    }

    return json({ content: [{ type: 'text', text }] });
  } catch (e) {
    return json({ error: { message: 'Upstream request failed: ' + (e as Error).message } }, 502);
  }
});
