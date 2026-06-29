/* ============================================================
   Propello auth page logic
   Drives the standalone login / sign-up page. Reuses the same
   Supabase helpers as the app so accounts stay consistent.
   On success (or if already signed in) it forwards into the app.
   ============================================================ */
'use strict';

import { getSession, signIn, signUp } from './supabase.js?v=28';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

/* Only allow same-origin relative redirects — never an absolute/remote URL. */
function safeNext(value) {
  if (!value) return null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('/')) return null;
  return value;
}
const NEXT = safeNext(params.get('next')) || 'index.html';

const form = $('authForm');
const nameField = $('nameField');
const nameInput = $('authName');
const emailInput = $('authEmail');
const passwordInput = $('authPassword');
const submitBtn = $('authSubmit');
const statusEl = $('authStatus');
const heading = $('authHeading');
const subhead = $('authSubhead');
const tabLogin = $('tabLogin');
const tabSignup = $('tabSignup');
const foot = $('authFoot');
const switchBtn = $('switchMode');

let mode = params.get('mode') === 'signup' ? 'signup' : 'login';

/* If a valid session already exists, skip the form and go straight in. */
(async () => {
  try {
    const session = await getSession();
    if (session) location.replace(NEXT);
  } catch { /* offline — stay on the page */ }
})();

function setStatus(message, kind) {
  if (!message) {
    statusEl.hidden = true;
    statusEl.textContent = '';
    return;
  }
  statusEl.textContent = message;
  statusEl.className = `auth-status auth-status--${kind === 'ok' ? 'ok' : 'error'}`;
  statusEl.hidden = false;
}

function applyMode(next) {
  mode = next === 'signup' ? 'signup' : 'login';
  const isSignUp = mode === 'signup';

  heading.textContent = isSignUp ? 'Create your Propello account' : 'Sign in to Propello';
  subhead.textContent = isSignUp
    ? 'Start drafting client-ready proposals in minutes.'
    : 'Use your email and password to access the app.';

  submitBtn.textContent = isSignUp ? 'Create account' : 'Login';

  tabLogin.setAttribute('aria-selected', String(!isSignUp));
  tabSignup.setAttribute('aria-selected', String(isSignUp));

  nameField.hidden = !isSignUp;
  nameInput.required = isSignUp;
  passwordInput.autocomplete = isSignUp ? 'new-password' : 'current-password';

  foot.innerHTML = isSignUp
    ? 'Already have an account? <button type="button" id="switchMode" data-target="login">Sign in</button>'
    : 'New to Propello? <button type="button" id="switchMode" data-target="signup">Create an account</button>';
  $('switchMode').addEventListener('click', (e) => applyMode(e.currentTarget.dataset.target));

  setStatus('', '');
}

tabLogin.addEventListener('click', () => applyMode('login'));
tabSignup.addEventListener('click', () => applyMode('signup'));
switchBtn.addEventListener('click', (e) => applyMode(e.currentTarget.dataset.target));

/* Show / hide password */
$('togglePassword').addEventListener('click', () => {
  const showing = passwordInput.type === 'text';
  passwordInput.type = showing ? 'password' : 'text';
  const btn = $('togglePassword');
  btn.setAttribute('aria-pressed', String(!showing));
  btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const isSignUp = mode === 'signup';
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  setStatus('', '');

  if (!email || !password) {
    setStatus('Please enter your email and password.', 'error');
    return;
  }
  if (isSignUp && !name) {
    setStatus('Please enter your full name.', 'error');
    return;
  }
  if (password.length < 6) {
    setStatus('Password must be at least 6 characters.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = isSignUp ? 'Creating account…' : 'Signing in…';

  try {
    const { data, error } = isSignUp
      ? await signUp(email, password, name)
      : await signIn(email, password);

    if (error) {
      setStatus(error.message || String(error), 'error');
      return;
    }

    // Sign-up with email confirmation returns no session yet.
    const signedIn = !isSignUp || (data && data.session);
    if (!signedIn) {
      setStatus('Almost there — check your email to confirm your account, then sign in.', 'ok');
      applyMode('login');
      emailInput.value = email;
      return;
    }

    setStatus('Success! Taking you to the app…', 'ok');
    location.replace(NEXT);
  } catch {
    setStatus('Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = mode === 'signup' ? 'Create account' : 'Login';
  }
});

// Initialise from the URL (?mode=signup) on load.
applyMode(mode);
