/* ============================================================
   Propello app gate
   Runs before the app boots. Requires a signed-in session to use
   the webapp directly. Stays resilient by design:
     - ?share=<token> guests are let through (no account needed)
     - if Supabase is unavailable (offline/CDN blocked) we let the
       user through rather than trap them behind a broken check
   ============================================================ */
'use strict';

import { isAuthAvailable, getSession } from './supabase.js?v=28';

const reveal = () => document.documentElement.classList.remove('auth-gating');

(async () => {
  try {
    const params = new URLSearchParams(location.search);

    // Guests opening a shared document don't need an account.
    if (params.get('share')) { reveal(); return; }

    // If accounts are offline, don't block the app (matches the app's
    // "Supabase failure must never break the app" philosophy).
    const available = await isAuthAvailable();
    if (!available) { reveal(); return; }

    const session = await getSession();
    if (session) { reveal(); return; }

    // Auth is available but there's no session — send to login, and come
    // back to this exact page (incl. query string) after signing in.
    const here = (location.pathname.split('/').pop() || 'index.html') + location.search;
    location.replace('auth.html?next=' + encodeURIComponent(here));
  } catch {
    // Never trap the user behind a broken check.
    reveal();
  }
})();
