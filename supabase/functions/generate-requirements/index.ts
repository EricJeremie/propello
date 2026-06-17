// generate-requirements — drafts a detailed, IEEE-830-style System Requirements
// Document from a client intake questionnaire. Calls the same GEMINI_API_KEY
// secret as generate-proposal. Requires a signed-in PocketDevs user so the key
// is never exposed to clients.

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

function formatAnswers(answers: Record<string, unknown>): string {
  const lines: string[] = [];
  const label = (key: string) => key.replace(/([A-Z])/g, ' $1').trim()
    .replace(/^./, (c) => c.toUpperCase());
  for (const [k, v] of Object.entries(answers)) {
    if (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    const val = Array.isArray(v) ? (v as string[]).join(', ') : String(v);
    lines.push(`${label(k)}: ${val}`);
  }
  return lines.join('\n');
}

const SYSTEM_PROMPT = `You are a senior business analyst and systems architect at PocketDevs, a software development agency in the Philippines. You write System Requirements Documents (SRDs) that match the rigor and structure of an IEEE 830-style Software Requirements Specification — the kind a serious engineering team could build directly from, and a client could sign off on without confusion.

You will be given the raw answers a prospective client gave in an intake questionnaire. Your job is to transform those answers into a complete, internally consistent, professionally written SRD. You must reason about what the client actually described — their project type, the features they listed, the roles/users they mentioned, the integrations they named, their scale, and their constraints — and reflect ALL of it accurately in the document. Never contradict an answer the client gave. Never invent a feature, integration, or constraint the client did not ask for and that isn't a reasonable, clearly-labeled recommendation.

Hard rules:
- Be exhaustive but never vague. Every bullet must be specific and concrete — name actual screens, actual data fields, actual roles, actual third-party services the client mentioned (e.g. "GCash", "PayMongo", "QuickBooks", "Lazada/Shopee") rather than generic placeholders.
- Functional requirements must be written as testable "The system shall…" statements, one discrete behavior per requirement (no compound "and" statements bundling two behaviors).
- Group functional requirements into 6–10 logical modules (e.g. "Account & Authentication", "Catalog Management", "Order & Checkout", "Admin & Reporting", "Notifications", "Roles & Permissions" — pick module names that fit THIS project, do not reuse this list blindly). Each module needs 3–7 requirements.
- Tag every functional and non-functional requirement with a priority of exactly "Must", "Should", or "Could" (MoSCoW), based on how essential it is to the client's stated goals. Most core CRUD/auth/checkout flows are "Must"; nice-to-haves are "Should" or "Could".
- Non-functional requirements must cover at least these categories distinctly: Performance, Security, Scalability, Usability, Reliability & Availability, and Compatibility. Add Maintainability or Localization if relevant. Each category needs 2–4 specific, measurable requirements (real numbers: response times in seconds, uptime percentages, concurrent user counts — extrapolate sensible figures from the client's stated scale when they didn't give numbers).
- User classes must be derived from the roles/users the client actually described (e.g. if they said "Super Admin, Store Manager, Cashier, Customer", use exactly those, do not relabel them). If they described an app with no accounts, still include "Guest / Visitor" and any implicit operator-side class (e.g. "Internal Staff").
- Technical recommendations and the operating environment must be practical for a Philippine SME and aligned with PocketDevs' stack: React/Next.js or plain HTML/CSS/JS for web front-ends, React Native for cross-platform mobile (or native Swift/Kotlin only if the client explicitly asked for native), Node.js/Deno for back-ends, Supabase/PostgreSQL for data, Vercel/Supabase/AWS for hosting. Only deviate if the client's answers explicitly require something else.
- Fold the client's timeline and budget context into "Assumptions and Dependencies" as plain, honest statements (e.g. "The proposed timeline of 3 months assumes timely client feedback during UAT" or "The stated budget range is tight for the full scope described; a phased rollout is assumed"). If the budget genuinely looks too low for the scope described, say so plainly and honestly — do not sugar-coat it.
- Use "[TBD]" only when information is truly missing and cannot be reasonably inferred — never leave a field empty.
- Write in clear, plain, professional English. No marketing fluff, no filler sentences.
- Double-check internal consistency before responding: every user class mentioned in section 2 must appear somewhere in the functional requirements; every integration the client named must appear in Software Interfaces and/or the relevant functional module; the project type (website/web app/mobile app/custom software) must be reflected consistently across product perspective, operating environment, and interfaces. Make no mistakes.`;

const SRD_SCHEMA = {
  type: 'object',
  properties: {
    projectName: { type: 'string' },

    // 1. Introduction
    purpose: { type: 'string', description: 'Purpose of this SRD document itself, tailored to the project (1–2 short paragraphs).' },
    scope: { type: 'string', description: 'What the system being specified covers and its boundaries (1–2 short paragraphs).' },
    definitions: {
      type: 'array',
      description: 'Project-specific terms and acronyms a reader needs to understand this document, e.g. SRD, Admin, SKU, API, plus any domain terms from the client answers.',
      items: {
        type: 'object',
        properties: { term: { type: 'string' }, definition: { type: 'string' } },
      },
    },

    // 2. Overall Description
    productPerspective: { type: 'string', description: 'How this product fits the client\'s business context — standalone, replacing an existing system, integrating with existing tools, etc.' },
    productFunctions: { type: 'array', items: { type: 'string' }, description: '6–10 bullet summary of what the system does at a high level.' },
    userClasses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          technicalSkill: { type: 'string', description: 'e.g. "None — general public", "Basic computer literacy", "Trained staff".' },
        },
      },
    },
    operatingEnvironment: {
      type: 'array',
      description: 'Label/value pairs, e.g. {label:"Client devices", value:"..."}, {label:"Server", value:"..."}, {label:"Database", value:"..."}, {label:"Connectivity", value:"..."}.',
      items: {
        type: 'object',
        properties: { label: { type: 'string' }, value: { type: 'string' } },
      },
    },
    designConstraints: { type: 'array', items: { type: 'string' }, description: '3–6 constraints (budget, timeline-driven tech choices, platform limits, branding, regulatory).' },
    assumptionsAndDependencies: { type: 'array', items: { type: 'string' }, description: '3–6 items, including timeline/budget context folded in narratively.' },

    // 3. Functional Requirements
    functionalRequirements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          module: { type: 'string' },
          requirements: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                priority: { type: 'string', enum: ['Must', 'Should', 'Could'] },
              },
            },
          },
        },
      },
    },

    // 4. External Interface Requirements
    userInterfaces: { type: 'array', items: { type: 'string' }, description: '2–4 bullets describing the UI approach/screens.' },
    hardwareInterfaces: { type: 'string', description: 'One or two sentences; say "No special hardware interfaces are required." if none apply.' },
    softwareInterfaces: {
      type: 'array',
      description: 'External services/APIs this system talks to, e.g. {name:"Payment gateway (PayMongo)", description:"..."}.',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, description: { type: 'string' } },
      },
    },
    communicationInterfaces: { type: 'array', items: { type: 'string' }, description: '1–3 bullets, e.g. HTTPS/REST, webhooks, push notifications.' },

    // 5. Non-Functional Requirements
    nonFunctionalRequirements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          requirements: { type: 'array', items: { type: 'string' } },
        },
      },
    },

    // 6. Other Requirements
    dataRequirements: { type: 'array', items: { type: 'string' }, description: '2–4 bullets on data retention, backups, ownership.' },
    legalAndCompliance: { type: 'array', items: { type: 'string' }, description: '2–4 bullets, e.g. Data Privacy Act of 2012 (RA 10173), payment compliance, content ownership.' },
    acceptanceCriteria: { type: 'array', items: { type: 'string' }, description: '3–5 bullets describing what "done" looks like for client sign-off.' },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: { message: 'Method not allowed' } }, 405);

  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) {
    return json({ error: { message: 'Server is missing GEMINI_API_KEY.' } }, 501);
  }

  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    return json({ error: { message: 'You must be signed in to generate an SRD.' } }, 401);
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
  try { body = await req.json(); }
  catch { return json({ error: { message: 'Invalid JSON body' } }, 400); }

  const answers = body.answers as Record<string, unknown>;
  if (!answers || typeof answers !== 'object') {
    return json({ error: { message: 'Missing answers object in request body.' } }, 400);
  }

  const prompt = `Generate a complete, detailed System Requirements Document for this client project intake. Use every relevant answer below — do not ignore any of it, and do not contradict it:\n\n${formatAnswers(answers)}\n\nBe thorough and specific, matching the depth of a professional IEEE-830-style SRS: at least 6 functional requirement modules with 3–7 testable requirements each (each tagged Must/Should/Could), at least 6 non-functional requirement categories (Performance, Security, Scalability, Usability, Reliability & Availability, Compatibility) with 2–4 measurable requirements each, and user classes that match the roles described in the answers. Make no mistakes — every section must stay internally consistent with the client's actual answers.`;

  const geminiBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: {
      maxOutputTokens: 24000,
      responseMimeType: 'application/json',
      responseSchema: toGeminiSchema(SRD_SCHEMA),
    },
  };

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(geminiBody) },
    );
    const data = await upstream.json();
    if (!upstream.ok) {
      return json({ error: { message: data?.error?.message || `Gemini error (HTTP ${upstream.status})` } }, upstream.status);
    }
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map((p: Record<string, unknown>) => p.text || '').join('');
    if (!text) {
      const reason = data?.candidates?.[0]?.finishReason;
      return json({ error: { message: `Gemini returned no content${reason ? ` (${reason})` : ''}.` } }, 502);
    }
    let srd: unknown;
    try { srd = JSON.parse(text); }
    catch { return json({ error: { message: 'SRD response was not valid JSON.' } }, 502); }
    return json({ srd });
  } catch (e) {
    return json({ error: { message: 'Upstream request failed: ' + (e as Error).message } }, 502);
  }
});
