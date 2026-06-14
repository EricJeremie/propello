/* ============================================================
   PocketDevs Proposal Generator — backend proxy
   Holds the Anthropic API key server-side (env: ANTHROPIC_API_KEY)
   so it is never exposed in the browser. Requires a valid Supabase
   session: the caller must send `Authorization: Bearer <token>`.
   Deployed as a Vercel Serverless Function at /api/generate.
   ============================================================ */
'use strict';

const SUPABASE_URL = 'https://xiykfvyjavkkmfqujcql.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CoqmS7OUcHBQ55Ho22xgyg_RYYtUoLk';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

function send(res, status, payload) {
  res.status(status);
  res.setHeader('content-type', 'application/json');
  res.send(typeof payload === 'string' ? payload : JSON.stringify(payload));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return send(res, 405, { error: { message: 'Method not allowed.' } });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return send(res, 500, {
      error: {
        message:
          'Server is missing ANTHROPIC_API_KEY. Add it in Vercel → Project Settings → Environment Variables, then redeploy.',
      },
    });
  }

  // --- Require a valid Supabase session ---
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    return send(res, 401, { error: { message: 'You must be signed in to generate a proposal.' } });
  }
  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON_KEY, authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) {
      return send(res, 401, { error: { message: 'Your session is invalid or expired. Please sign in again.' } });
    }
  } catch (err) {
    return send(res, 502, { error: { message: 'Could not verify your session. Please try again.' } });
  }

  // --- Body (Vercel parses JSON bodies into req.body) ---
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return send(res, 400, { error: { message: 'Invalid request body.' } });
  }

  // --- Proxy to Anthropic ---
  try {
    const anthRes = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
    });
    const text = await anthRes.text();
    return send(res, anthRes.status, text);
  } catch (err) {
    return send(res, 502, {
      error: { message: 'Upstream error contacting Anthropic: ' + (err && err.message ? err.message : 'unknown') },
    });
  }
};
