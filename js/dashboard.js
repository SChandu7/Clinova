// ============================================================
//  Clinova – dashboard.js  (full backend auth version)
//  Login/Register call backend API. Token stored in session.
// ============================================================

const API = 'https://api.chandus7.in/api/clinova';
let currentUser = null;
let selectedFiles = [];
let currentStep = 1;

function showAdminDashboard() {
  document.getElementById('auth-view').style.display      = 'none';
  document.getElementById('dashboard-view').style.display = 'block';

  document.getElementById('dash-avatar').textContent = 'AD';
  document.getElementById('dash-name').textContent   = 'Admin';
  document.getElementById('dash-email').textContent  = 'admin@clinova.org';
  document.getElementById('dash-welcome-name').textContent = 'Admin';

  // ── ADD THIS — hide user-only buttons in overview ──
  document.querySelectorAll('[onclick*="showSection(\'submit\'"]').forEach(el => el.style.display = 'none');
  document.querySelectorAll('[onclick*="submit"]').forEach(el => {
    if (el.textContent.includes('Submit')) el.style.display = 'none';
  });

  // ── ADD THIS — change welcome message ──
  const welcome = document.querySelector('.dash-welcome p');
  if (welcome) welcome.textContent = 'All manuscript submissions are listed below. Review and take action.';

  document.querySelector('.dashboard-menu').innerHTML = `
    <li><button class="active" onclick="showSection('overview')" data-section="overview">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      Overview
    </button></li>
    <li><button onclick="showSection('submissions')" data-section="submissions">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12h6M9 16h6M9 8h3M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>
      All Submissions
    </button></li>
    <li style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border);">
      <button onclick="handleLogout()" style="color:var(--danger);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </button>
    </li>`;

  loadAdminSubmissions();
}

async function loadAdminSubmissions() {
  try {
    const res  = await fetch(`${API}/submissions/all/`);
    const json = await res.json();
    if (json.success) renderAdminSubmissions(json.data);
  } catch(_) {}
}

function renderAdminSubmissions(subs) {
  const list = document.getElementById('full-submission-list');
  const ov   = document.getElementById('overview-submission-list');
  if (!list) return;

  // Stats
  setText('stat-total-sub', subs.length);
  setText('stat-pending',   subs.filter(s => ['pending','screening','review','revision'].includes(s.status)).length);
  setText('stat-approved',  subs.filter(s => ['approved','published'].includes(s.status)).length);
  setText('stat-rejected',  subs.filter(s => s.status === 'rejected').length);

  // Overview recent
  if (ov) ov.innerHTML = subs.slice(0,3).map(s => buildAdminSubCard(s)).join('');

  // Full list
  list.innerHTML = subs.length
    ? subs.map(s => buildAdminSubCard(s)).join('')
    : '<div class="empty-state"><h3>No submissions yet</h3></div>';
}

function buildAdminSubCard(s) {
  const statusMap = {
    pending:   'status-pending',
    screening: 'status-review',
    review:    'status-review',
    revision:  'status-pending',
    approved:  'status-approved',
    published: 'status-published',
    rejected:  'status-rejected',
  };
  return `
  <div class="submission-item">
    <div class="submission-head">
      <div>
        <p class="submission-title">${s.title}</p>
        <div class="submission-meta">
          <span><strong>ID:</strong> ${s.submission_id}</span>
          <span><strong>Author:</strong> ${s.author_name || '—'}</span>
          <span><strong>Type:</strong> ${s.article_type}</span>
          <span><strong>Date:</strong> ${s.submitted_at?.slice(0,10) || '—'}</span>
        </div>
      </div>
      <span class="status ${statusMap[s.status] || 'status-pending'}">${s.status}</span>
    </div>
    <div style="display:flex;gap:8px;margin-top:10px;padding-top:10px;border-top:1px dashed var(--border);flex-wrap:wrap;">
      <select onchange="updateSubmissionStatus('${s.submission_id}', this.value)" 
        style="padding:6px 12px;border-radius:6px;border:1px solid var(--border-dark);font-size:.82rem;background:var(--bg);">
        <option value="pending"   ${s.status==='pending'   ?'selected':''}>Awaiting Review</option>
        <option value="screening" ${s.status==='screening' ?'selected':''}>Editorial Screening</option>
        <option value="review"    ${s.status==='review'    ?'selected':''}>Under Peer Review</option>
        <option value="revision"  ${s.status==='revision'  ?'selected':''}>Revision Requested</option>
        <option value="approved"  ${s.status==='approved'  ?'selected':''}>Accepted</option>
        <option value="published" ${s.status==='published' ?'selected':''}>Published</option>
        <option value="rejected"  ${s.status==='rejected'  ?'selected':''}>Rejected</option>
      </select>
      <button class="btn btn-secondary btn-small" onclick="updateSubmissionStatus('${s.submission_id}', 'approved')">✓ Accept</button>
      <button class="btn btn-ghost btn-small" style="color:var(--danger);border-color:var(--danger);" onclick="updateSubmissionStatus('${s.submission_id}', 'rejected')">✗ Reject</button>
    </div>
  </div>`;
}

async function updateSubmissionStatus(subId, status) {
  try {
    await fetch(`${API}/submissions/${subId}/status/`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    });
    showToast('Updated!', `Submission ${subId} marked as ${status}.`, 'success');
    loadAdminSubmissions();
  } catch(_) {
    showToast('Error', 'Could not reach server.', 'error');
  }
}
window.updateSubmissionStatus = updateSubmissionStatus;


/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  if (session) {
    currentUser = session;
    showDashboard();
  }
  populateProfileForm();
});

/* ---- Tab switch ---- */
function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('login-form-wrap').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('register-form-wrap').style.display = tab === 'register' ? 'block' : 'none';
}
window.switchTab = switchTab;



/* ---- Login — calls backend API ---- */
async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn      = document.getElementById('login-btn');

  // ── Admin ──
  if (email === 'admin@clinova.org' && password === 'admin@1234') {
    sessionStorage.setItem('clinova_admin', 'true');
    showAdminDashboard();
    return;
  }

  // ── Demo ──
  if (email === 'demo@clinova.org' && password === 'demo1234') {
    saveSession({ email, firstName: 'Demo', lastName: 'Author', institution: 'Clinova Research', token: 'demo-token' });
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Signing in…';

  try {
    const res  = await fetch(`${API}/auth/login/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const json = await res.json();

    if (json.success) {
      saveSession({
        email,
        firstName:   json.data.first_name,
        lastName:    json.data.last_name,
        institution: json.data.account?.institution || '',
        token:       json.data.token,
      });
    } else {
      showAlert('login-alert', json.message || 'Login failed.', 'danger');
    }
  } catch (err) {
    showAlert('login-alert', 'Cannot reach server. Check your connection.', 'danger');
  }

  btn.disabled = false;
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign In';
}
window.handleLogin = handleLogin;

/* ---- Register — calls backend API ---- */
async function handleRegister(e) {
  e.preventDefault();
  const firstName   = document.getElementById('reg-firstname').value.trim();
  const lastName    = document.getElementById('reg-lastname').value.trim();
  const email       = document.getElementById('reg-email').value.trim();
  const institution = document.getElementById('reg-institution').value.trim();
  const password    = document.getElementById('reg-password').value;
  const confirm     = document.getElementById('reg-confirm').value;
  const btn         = document.getElementById('reg-btn');

  if (password !== confirm) { showAlert('register-alert', 'Passwords do not match.', 'danger'); return; }
  if (password.length < 8)  { showAlert('register-alert', 'Password must be at least 8 characters.', 'danger'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creating account…';

  try {
    const res  = await fetch(`${API}/auth/register/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, first_name: firstName, last_name: lastName, institution, password }),
    });
    const json = await res.json();

    if (json.success) {
      saveSession({
        email,
        firstName,
        lastName,
        institution,
        token: json.data.token,
      });
      showToast('Account created!', `Welcome, ${firstName}!`, 'success');
    } else {
      showAlert('register-alert', json.message || 'Registration failed.', 'danger');
    }
  } catch (err) {
    showAlert('register-alert', 'Cannot reach server. Check your connection.', 'danger');
  }

  btn.disabled = false;
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> Create Account';
}
window.handleRegister = handleRegister;

function saveSession(data) {
  localStorage.setItem('clinova_session', JSON.stringify(data));
  currentUser = data;
  showDashboard();
  showToast('Welcome!', `Signed in as ${data.firstName}.`, 'success');
}

/* ---- Logout ---- */
async function handleLogout() {
  const session = getSession();
  if (session?.token && session.token !== 'demo-token') {
    try {
      await fetch(`${API}/auth/logout/`, {
        method:  'POST',
        headers: { 'Authorization': `Token ${session.token}` },
      });
    } catch (_) {}
  }
  localStorage.removeItem('clinova_session');
  currentUser = null;
  document.getElementById('auth-view').style.display      = 'flex';
  document.getElementById('dashboard-view').style.display = 'none';
  showToast('Signed out', 'You have been signed out.', 'success');
}
window.handleLogout = handleLogout;

/* ---- Show dashboard ---- */
function showDashboard() {
  document.getElementById('auth-view').style.display      = 'none';
  document.getElementById('dashboard-view').style.display = 'block';
  if (!currentUser) return;

  const initials = ((currentUser.firstName||'?')[0] + (currentUser.lastName||'?')[0]).toUpperCase();
  setText('dash-avatar',       initials);
  setText('dash-name',         `${currentUser.firstName} ${currentUser.lastName}`);
  setText('dash-email',        currentUser.email);
  setText('dash-welcome-name', currentUser.firstName);

  loadSubmissions();
  populateProfileForm();
  updateAuthHeader();
}

/* ---- Section nav ---- */
function showSection(name) {
  document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dashboard-menu button').forEach(b => b.classList.remove('active'));
  const section = document.getElementById('section-' + name);
  const btn     = document.querySelector(`[data-section="${name}"]`);
  if (section) section.classList.add('active');
  if (btn)     btn.classList.add('active');
  if (name === 'submissions') loadSubmissions();
  if (window.innerWidth <= 900) window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.showSection = showSection;

/* ---- Local helpers ---- */
function getLocalSubmissions() { try { return JSON.parse(localStorage.getItem('clinova_submissions')) || []; } catch { return []; } }
function saveLocalSubmissions(s) { localStorage.setItem('clinova_submissions', JSON.stringify(s)); }

/* ---- Load submissions — uses token ---- */
async function loadSubmissions() {
  // Show local immediately
  let subs = getLocalSubmissions().filter(s => s.email === currentUser?.email);
  renderOverviewSubmissions(subs);
  renderFullSubmissions(subs);
  updateStats(subs);

  // Sync from backend using token
  const session = getSession();
  if (!session?.token || session.token === 'demo-token') return;

  try {
    const res  = await fetch(`${API}/submissions/my/`, {
      headers: { 'Authorization': `Token ${session.token}` },
    });
    const json = await res.json();

    if (json.success && Array.isArray(json.data) && json.data.length) {
      const merged = json.data.map(s => ({
        id:         s.submission_id,
        email:      currentUser.email,
        title:      s.title,
        type:       s.article_type,
        category:   s.category,
        status:     s.status,
        date:       s.submitted_at?.slice(0, 10),
        files:      s.files?.map(f => f.original_name) || [],
        reviewNote: s.review_note || '',
      }));
      renderOverviewSubmissions(merged);
      renderFullSubmissions(merged);
      updateStats(merged);
    }
  } catch (_) {}
}

/* ---- Render helpers ---- */
function renderOverviewSubmissions(subs) {
  const list = document.getElementById('overview-submission-list');
  if (!list) return;
  const recent = [...subs].slice(-3).reverse();
  if (!recent.length) {
    list.innerHTML = `<div class="empty-state" style="padding:36px 0;">
      <div class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 12h6M9 16h6M9 8h3M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg></div>
      <h3>No submissions yet</h3>
      <p>Submit your first manuscript to get started.</p>
      <button class="btn btn-secondary" style="margin-top:14px;" onclick="showSection('submit')">Submit Article</button>
    </div>`;
    return;
  }
  list.innerHTML = recent.map(s => buildSubmissionCard(s)).join('');
}

function renderFullSubmissions(subs) {
  const list = document.getElementById('full-submission-list');
  if (!list) return;
  if (!subs.length) {
    list.innerHTML = `<div class="empty-state" style="padding:48px 0;">
      <div class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 12h6M9 16h6M9 8h3M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg></div>
      <h3>No submissions yet</h3>
      <p>Your submitted manuscripts will appear here.</p>
      <button class="btn btn-secondary" style="margin-top:14px;" onclick="showSection('submit')">Submit Now</button>
    </div>`;
    return;
  }
  list.innerHTML = [...subs].reverse().map(s => buildSubmissionCard(s, true)).join('');
}

function buildSubmissionCard(s, showTimeline = false) {
  const statusMap = {
    pending:   { cls: 'status-pending',  label: 'Submitted — Awaiting Review' },
    screening: { cls: 'status-review',   label: 'Editorial Screening' },
    review:    { cls: 'status-review',   label: 'Under Peer Review' },
    revision:  { cls: 'status-pending',  label: 'Revision Requested' },
    approved:  { cls: 'status-approved', label: 'Accepted for Publication' },
    rejected:  { cls: 'status-rejected', label: 'Not Accepted' },
    published: { cls: 'status-published',label: 'Published' },
  };
  const st    = statusMap[s.status] || statusMap.pending;
  const files = Array.isArray(s.files) ? s.files : [];

  let timelineHtml = '';
  if (showTimeline) {
    const stages = [
      { label: 'Submitted',   done: true },
      { label: 'Screening',   done: ['screening','review','revision','approved','published','rejected'].includes(s.status) },
      { label: 'Peer Review', done: ['approved','published','rejected'].includes(s.status), current: s.status === 'review' },
      { label: 'Decision',    done: ['approved','published','rejected'].includes(s.status) },
      { label: 'Published',   done: s.status === 'published' },
    ];
    timelineHtml = `<div style="margin-top:16px;padding-top:14px;border-top:1px dashed var(--border);">
      <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:12px;">Review Progress</div>
      <div style="display:flex;gap:0;flex-wrap:wrap;">
        ${stages.map((st2, i) => `
          <div style="flex:1;min-width:80px;text-align:center;position:relative;padding-top:24px;">
            <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:20px;height:20px;border-radius:50%;border:2px solid ${st2.done?'var(--success)':st2.current?'var(--primary)':'var(--border-dark)'};background:${st2.done?'var(--success)':st2.current?'var(--primary)':'var(--bg)'};display:grid;place-items:center;">
              ${st2.done?'<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
            </div>
            ${i < stages.length-1?`<div style="position:absolute;top:9px;left:calc(50% + 10px);right:0;height:2px;background:${st2.done?'var(--success)':'var(--border)'};"></div>`:''}
            <span style="font-size:.72rem;color:var(--text-muted);display:block;">${st2.label}</span>
          </div>`).join('')}
      </div>
    </div>`;
  }

  return `
  <div class="submission-item">
    <div class="submission-head">
      <div>
        <p class="submission-title">${s.title}</p>
        <div class="submission-meta">
          <span><strong>ID:</strong> ${s.id || s.submission_id || '—'}</span>
          <span><strong>Type:</strong> ${s.type || s.article_type || '—'}</span>
          <span><strong>Submitted:</strong> ${s.date || '—'}</span>
        </div>
      </div>
      <span class="status ${st.cls}">${st.label}</span>
    </div>
    ${files.length ? `<div class="submission-files">
      ${files.map(f => `<span style="display:inline-flex;align-items:center;gap:5px;font-size:.82rem;padding:4px 10px;background:var(--bg-alt);border:1px solid var(--border);border-radius:999px;color:var(--text-secondary);">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>${f}
      </span>`).join('')}
    </div>` : ''}
    ${s.reviewNote ? `<div class="submission-review"><strong>Editor's Note:</strong> ${s.reviewNote}</div>` : ''}
    ${timelineHtml}
  </div>`;
}

function updateStats(subs) {
  setText('stat-total-sub', subs.length);
  setText('stat-pending',   subs.filter(s => ['pending','screening','review','revision'].includes(s.status)).length);
  setText('stat-approved',  subs.filter(s => ['approved','published'].includes(s.status)).length);
  setText('stat-rejected',  subs.filter(s => s.status === 'rejected').length);
  const pending = subs.filter(s => ['pending','review','revision'].includes(s.status)).length;
  const badge = document.getElementById('pending-badge');
  if (badge) { badge.style.display = pending > 0 ? 'inline-flex' : 'none'; badge.textContent = pending; }
}

/* ---- Submit form steps ---- */
function goToStep(n) {
  if (n > 1) {
    const title    = document.getElementById('sub-title')?.value.trim();
    const type     = document.getElementById('sub-type')?.value;
    const category = document.getElementById('sub-category')?.value;
    const authors  = document.getElementById('sub-authors')?.value.trim();
    const abstract = document.getElementById('sub-abstract')?.value.trim();
    const keywords = document.getElementById('sub-keywords')?.value.trim();
    if (!title || !type || !category || !authors || !abstract || !keywords) {
      showToast('Missing fields', 'Please fill all required fields.', 'error');
      goToStepUI(1); return;
    }
  }
  if (n > 2 && selectedFiles.length === 0) {
    showToast('No files', 'Please upload at least one file.', 'error'); return;
  }
  if (n > 3) {
    const allOk = ['decl-original','decl-ethics','decl-consent','decl-copyright','decl-ai']
      .every(id => document.getElementById(id)?.checked);
    if (!allOk) { showToast('Declaration required', 'Please check all declaration boxes.', 'error'); return; }
    populateReviewDetails();
  }
  goToStepUI(n);
}
window.goToStep = goToStep;

function goToStepUI(n) {
  currentStep = n;
  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById('submit-step' + i);
    const step  = document.getElementById('step' + i);
    if (panel) panel.style.display = (i === n) ? 'block' : 'none';
    if (step) {
      step.classList.toggle('active', i === n);
      step.classList.toggle('done',   i < n);
    }
  }
}

function populateReviewDetails() {
  const el = document.getElementById('submission-review-details');
  if (!el) return;
  const rows = [
    ['Title',       document.getElementById('sub-title')?.value],
    ['Type',        document.getElementById('sub-type')?.value],
    ['Discipline',  document.getElementById('sub-category')?.value],
    ['Authors',     document.getElementById('sub-authors')?.value],
    ['Institution', document.getElementById('sub-institution')?.value],
    ['Keywords',    document.getElementById('sub-keywords')?.value],
    ['Files',       selectedFiles.map(f => f.name).join(', ') || '—'],
  ];
  el.innerHTML = rows.map(([label, val]) => `
    <div style="display:flex;gap:12px;font-size:.9rem;border-bottom:1px solid var(--border);padding-bottom:10px;">
      <strong style="min-width:100px;color:var(--text-muted);font-size:.82rem;text-transform:uppercase;letter-spacing:.06em;">${label}</strong>
      <span>${val || '—'}</span>
    </div>`).join('');
}

/* ---- Final submit — POST with token ---- */
async function submitManuscript() {
  const btn = document.getElementById('final-submit-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Submitting…'; }

  const localEntry = {
    id:          'CRJ-' + Date.now().toString().slice(-6),
    email:       currentUser?.email,
    title:       document.getElementById('sub-title')?.value.trim(),
    type:        document.getElementById('sub-type')?.value,
    category:    document.getElementById('sub-category')?.value,
    authors:     document.getElementById('sub-authors')?.value.trim(),
    institution: document.getElementById('sub-institution')?.value.trim(),
    abstract:    document.getElementById('sub-abstract')?.value.trim(),
    keywords:    document.getElementById('sub-keywords')?.value.trim(),
    files:       selectedFiles.map(f => f.name),
    status:      'pending',
    date:        new Date().toLocaleDateString('en-IN'),
    reviewNote:  '',
  };

  showUploadProgress(async () => {
    // Save locally first
    const subs = getLocalSubmissions();
    subs.push(localEntry);
    saveLocalSubmissions(subs);

    // POST to backend with token
    const session = getSession();
    try {
      const formData = new FormData();
      formData.append('title',          localEntry.title);
      formData.append('article_type',   localEntry.type);
      formData.append('category',       localEntry.category);
      formData.append('authors',        localEntry.authors);
      formData.append('institution',    localEntry.institution || '');
      formData.append('abstract',       localEntry.abstract);
      formData.append('keywords',       localEntry.keywords || '');
      formData.append('conflicts',      document.getElementById('sub-conflicts')?.value || 'None declared');
      formData.append('decl_original',  document.getElementById('decl-original')?.checked  ? 'true' : 'false');
      formData.append('decl_ethics',    document.getElementById('decl-ethics')?.checked    ? 'true' : 'false');
      formData.append('decl_consent',   document.getElementById('decl-consent')?.checked   ? 'true' : 'false');
      formData.append('decl_copyright', document.getElementById('decl-copyright')?.checked ? 'true' : 'false');
      formData.append('decl_ai',        document.getElementById('decl-ai')?.checked        ? 'true' : 'false');
      selectedFiles.forEach(f => formData.append('files', f));

      await fetch(`${API}/submissions/`, {
        method:  'POST',
        headers: { 'Authorization': `Token ${session?.token}` },
        body:    formData,
      });
    } catch (_) {}

    // Reset
    selectedFiles = [];
    document.getElementById('selected-files-list').innerHTML = '';
    document.querySelectorAll('#section-submit input[type="text"], #section-submit textarea, #section-submit select').forEach(el => el.value = '');
    document.querySelectorAll('#section-submit input[type="checkbox"]').forEach(el => el.checked = false);
    goToStepUI(1);
    if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit Manuscript'; }

    showToast('Submitted!', `"${localEntry.title.slice(0,50)}…" received.`, 'success');
    showSection('submissions');
    loadSubmissions();
  });
}
window.submitManuscript = submitManuscript;

function showUploadProgress(callback) {
  const bar  = document.getElementById('upload-progress');
  const fill = document.getElementById('progress-fill');
  const pct  = document.getElementById('progress-pct');
  if (bar) bar.style.display = 'block';
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 20 + 8, 98);
    if (fill) fill.style.width = p + '%';
    if (pct)  pct.textContent  = Math.round(p) + '%';
    if (p >= 98) {
      clearInterval(iv);
      if (fill) fill.style.width = '100%';
      if (pct)  pct.textContent  = '100%';
      if (bar)  setTimeout(() => bar.style.display = 'none', 400);
      setTimeout(callback, 500);
    }
  }, 100);
}

/* ---- File handling ---- */
function handleFileSelect(input) {
  [...(input.files || [])].forEach(f => {
    if (!selectedFiles.find(x => x.name === f.name)) selectedFiles.push(f);
  });
  renderSelectedFiles();
  input.value = '';
}
window.handleFileSelect = handleFileSelect;

function renderSelectedFiles() {
  const list = document.getElementById('selected-files-list');
  if (!list) return;
  list.innerHTML = selectedFiles.map((f, i) => `
    <div class="multi-file-item">
      <span class="mf-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
      <span class="mf-name">${f.name}</span>
      <span class="mf-size">${formatBytes(f.size)}</span>
      <span class="mf-remove" onclick="removeFile(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg></span>
    </div>`).join('');
}
function removeFile(i) { selectedFiles.splice(i, 1); renderSelectedFiles(); }
window.removeFile = removeFile;
function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(1) + ' MB';
}

const dropZone = document.getElementById('file-drop-zone');
if (dropZone) {
  dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('is-dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('is-dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault(); dropZone.classList.remove('is-dragover');
    [...e.dataTransfer.files].forEach(f => { if (!selectedFiles.find(x => x.name === f.name)) selectedFiles.push(f); });
    renderSelectedFiles();
  });
}

/* ---- Profile ---- */
function populateProfileForm() {
  const s = getSession();
  if (!s) return;
  setValue('prof-firstname',   s.firstName   || '');
  setValue('prof-lastname',    s.lastName    || '');
  setValue('prof-email',       s.email       || '');
  setValue('prof-institution', s.institution || '');
  setValue('prof-orcid',       s.orcid       || '');
  setValue('prof-interests',   s.interests   || '');
}

async function saveProfile(e) {
  e.preventDefault();
  const s = getSession();
  if (!s) return;

  const updated = {
    ...s,
    firstName:   document.getElementById('prof-firstname')?.value.trim()   || s.firstName,
    lastName:    document.getElementById('prof-lastname')?.value.trim()    || s.lastName,
    institution: document.getElementById('prof-institution')?.value.trim() || s.institution,
    orcid:       document.getElementById('prof-orcid')?.value.trim(),
    interests:   document.getElementById('prof-interests')?.value.trim(),
  };

  // Update backend
  if (s.token && s.token !== 'demo-token') {
    try {
      await fetch(`${API}/auth/profile/`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${s.token}` },
        body:    JSON.stringify({
          first_name:  updated.firstName,
          last_name:   updated.lastName,
          institution: updated.institution,
          orcid:       updated.orcid,
          interests:   updated.interests,
        }),
      });
    } catch (_) {}
  }

  localStorage.setItem('clinova_session', JSON.stringify(updated));
  currentUser = updated;
  setText('dash-name',   `${updated.firstName} ${updated.lastName}`);
  setText('dash-avatar', (updated.firstName[0] + updated.lastName[0]).toUpperCase());
  showToast('Saved', 'Profile updated.', 'success');
}
window.saveProfile = saveProfile;

/* ---- Password strength ---- */
function checkPasswordStrength(val) {
  const fill  = document.getElementById('pw-fill');
  const label = document.getElementById('pw-label');
  if (!fill || !label) return;
  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { w:'0%',   c:'transparent',   t:'Enter a password' },
    { w:'25%',  c:'var(--danger)',  t:'Weak' },
    { w:'50%',  c:'var(--warning)', t:'Fair' },
    { w:'75%',  c:'var(--gold)',    t:'Good' },
    { w:'100%', c:'var(--success)', t:'Strong ✓' },
  ];
  const l = levels[Math.min(score, 4)];
  fill.style.width = l.w; fill.style.background = l.c;
  label.textContent = l.t; label.style.color = l.c === 'transparent' ? 'var(--text-muted)' : l.c;
}
window.checkPasswordStrength = checkPasswordStrength;

/* ---- Alert helper ---- */
function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}"><span>${msg}</span></div>`;
  setTimeout(() => el.innerHTML = '', 5000);
}

/* ---- Utils ---- */
function setText(id, val)  { const el = document.getElementById(id); if (el) el.textContent = val || ''; }
function setValue(id, val) { const el = document.getElementById(id); if (el) el.value       = val || ''; }
