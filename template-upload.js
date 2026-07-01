/* ============================================================
   Propello — company template upload
   A small shared modal used by both the dashboard and the generator
   toolkit. Accepts a PDF or Word (.docx) proposal, extracts text from
   .docx (mammoth), uploads to Supabase, and records a template row.
   Usage: openTemplateUpload({ onSaved(row) }).
   ============================================================ */
'use strict';

import { saveUserTemplate } from './supabase.js?v=30';

const MAX_BYTES = 12 * 1024 * 1024;
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* mammoth's browser build is a UMD bundle — load it via a <script> tag and
   read it off window (dynamic import() would not give a usable export). */
let mammothPromise = null;
function loadMammoth() {
  if (window.mammoth) return Promise.resolve(window.mammoth);
  if (mammothPromise) return mammothPromise;
  mammothPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js';
    s.onload = () => resolve(window.mammoth);
    s.onerror = () => reject(new Error('Could not load the Word reader. Try a PDF instead.'));
    document.head.appendChild(s);
  });
  return mammothPromise;
}

async function extractDocxText(file) {
  const mammoth = await loadMammoth();
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return ((result && result.value) || '').trim();
}

function fileKind(file) {
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  const isDocx = /\.docx$/i.test(file.name)
    || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return isPdf ? 'pdf' : (isDocx ? 'docx' : null);
}

export function openTemplateUpload({ onSaved } = {}) {
  // Only one modal at a time.
  if (document.getElementById('tmplUploadModal')) return;

  const overlay = document.createElement('div');
  overlay.id = 'tmplUploadModal';
  overlay.className = 'tmpl-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Upload a proposal template');
  overlay.innerHTML = `
    <div class="tmpl-modal__backdrop"></div>
    <div class="tmpl-modal__card card">
      <button type="button" class="tmpl-modal__close" aria-label="Close">&times;</button>
      <h2 class="tmpl-modal__title">Bring your company's template</h2>
      <p class="tmpl-modal__sub">Upload an existing proposal and Propello will follow its structure and tone when you generate. Your original stays private to your account.</p>

      <div class="field">
        <label class="label" for="tmplName">Template name</label>
        <input id="tmplName" class="input" type="text" placeholder="e.g. Acme standard proposal" />
      </div>

      <label class="dropzone tmpl-drop" for="tmplFile">
        <input id="tmplFile" type="file" accept="application/pdf,.pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden />
        <span class="dropzone__text"><strong>Drop a file</strong> or browse</span>
        <span class="dropzone__file" id="tmplFileName">PDF or Word (.docx), up to 12 MB</span>
      </label>

      <p class="tmpl-modal__status status" id="tmplStatus" hidden></p>

      <div class="tmpl-modal__actions">
        <button type="button" class="btn btn--ghost tmpl-cancel">Cancel</button>
        <button type="button" class="btn btn--primary tmpl-save" disabled>Save template</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = (sel) => overlay.querySelector(sel);
  const nameInput = $('#tmplName');
  const fileInput = $('#tmplFile');
  const fileNameEl = $('#tmplFileName');
  const dropzone = $('.tmpl-drop');
  const statusEl = $('#tmplStatus');
  const saveBtn = $('.tmpl-save');
  let pendingFile = null;

  function setStatus(msg, kind) {
    if (!msg) { statusEl.hidden = true; statusEl.textContent = ''; return; }
    statusEl.textContent = msg;
    statusEl.className = `tmpl-modal__status status status--${kind === 'ok' ? 'ok' : 'error'}`;
    statusEl.hidden = false;
  }

  function close() {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  document.addEventListener('keydown', onKey);

  function pickFile(file) {
    if (!file) return;
    const kind = fileKind(file);
    if (!kind) { setStatus('Please choose a PDF or Word (.docx) file.', 'error'); return; }
    if (file.size > MAX_BYTES) { setStatus('That file is over 12 MB. Please use a smaller file.', 'error'); return; }
    pendingFile = file;
    fileNameEl.textContent = file.name;
    dropzone.classList.add('is-filled');
    if (!nameInput.value.trim()) nameInput.value = file.name.replace(/\.(pdf|docx)$/i, '');
    setStatus('', '');
    saveBtn.disabled = false;
  }

  fileInput.addEventListener('change', (e) => pickFile(e.target.files[0]));
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('is-drag'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-drag'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-drag');
    pickFile(e.dataTransfer.files[0]);
  });

  $('.tmpl-modal__backdrop').addEventListener('click', close);
  $('.tmpl-modal__close').addEventListener('click', close);
  $('.tmpl-cancel').addEventListener('click', close);

  saveBtn.addEventListener('click', async () => {
    if (!pendingFile) { setStatus('Choose a file first.', 'error'); return; }
    const name = nameInput.value.trim() || pendingFile.name.replace(/\.(pdf|docx)$/i, '');
    saveBtn.disabled = true;
    const original = saveBtn.textContent;
    try {
      let extractedText = null;
      if (fileKind(pendingFile) === 'docx') {
        saveBtn.textContent = 'Reading document…';
        extractedText = await extractDocxText(pendingFile);
      }
      saveBtn.textContent = 'Uploading…';
      const { data, error } = await saveUserTemplate({
        name,
        file: pendingFile,
        mimeType: pendingFile.type,
        extractedText,
      });
      if (error) { setStatus(error.message || 'Upload failed.', 'error'); saveBtn.disabled = false; saveBtn.textContent = original; return; }
      setStatus('Template saved.', 'ok');
      if (typeof onSaved === 'function') { try { onSaved(data); } catch { /* host handles */ } }
      setTimeout(close, 500);
    } catch (err) {
      setStatus(err.message || 'Something went wrong. Please try again.', 'error');
      saveBtn.disabled = false;
      saveBtn.textContent = original;
    }
  });

  setTimeout(() => { try { nameInput.focus(); } catch { /* ignore */ } }, 40);
}
