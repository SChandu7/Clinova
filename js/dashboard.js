// ============================================================
//  Clinova – dashboard.js  (full backend auth version)
//  Login/Register call backend API. Token stored in session.
// ============================================================

const API = 'https://api.chandus7.in/api/clinova';
let currentUser = null;
let selectedFiles = [];
let currentStep     = 1;
let subCurrentStep  = 1;
let authorRows      = [];
let reviewerRows    = [];
let keywords        = [];
const SUB_TOTAL_STEPS = 7;
const subFiles = {
  cover_letter:  [],
  manuscript:    [],
  figure:        [],
  supplementary: [],
  guideline:     [],
  copyright:     [],
  disclosure:    [],
  other:         [],
};

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
    console.log('Admin subs:', json); // debug line
    if (json.success && json.data) {
      renderAdminSubmissions(Array.isArray(json.data) ? json.data : []);
    }
  } catch(e) {
    console.error('loadAdminSubmissions error:', e);
  }
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
    pending:   { cls:'status-pending',  label:'Awaiting Review' },
    screening: { cls:'status-review',   label:'Editorial Screening' },
    review:    { cls:'status-review',   label:'Under Peer Review' },
    revision:  { cls:'status-pending',  label:'Revision Requested' },
    approved:  { cls:'status-approved', label:'Accepted' },
    published: { cls:'status-published',label:'Published' },
    rejected:  { cls:'status-rejected', label:'Rejected' },
  };
  const st    = statusMap[s.status] || statusMap.pending;
  const files = s.files || [];

  // Group files by category
  const filesByCategory = {};
  files.forEach(f => {
    const cat = f.file_category || 'other';
    if (!filesByCategory[cat]) filesByCategory[cat] = [];
    filesByCategory[cat].push(f);
  });

  const fileHtml = Object.entries(filesByCategory).map(([cat, flist]) =>
    `<div style="margin-bottom:6px;">
      <span style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);">${cat.replace('_',' ')}:</span>
      ${flist.map(f => `<a href="${f.file_url||'#'}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;font-size:.78rem;padding:2px 8px;background:var(--bg-alt);border:1px solid var(--border);border-radius:999px;color:var(--primary);margin-left:5px;margin-bottom:3px;">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>${f.original_name}</a>`).join('')}
    </div>`
  ).join('');

  const reviewers = Array.isArray(s.suggested_reviewers) ? s.suggested_reviewers.filter(r => r.name) : [];

  return `
  <div class="submission-item" id="admin-card-${s.submission_id}">
    <!-- Header -->
    <div class="submission-head">
      <div style="flex:1;min-width:0;">
        <p class="submission-title">${s.title}</p>
        <div class="submission-meta">
          <span><strong>ID:</strong> ${s.submission_id}</span>
          <span><strong>Author:</strong> ${s.author_name || '—'}</span>
          <span><strong>Type:</strong> ${s.article_type}</span>
          <span><strong>Subspecialty:</strong> ${s.subspecialty || '—'}</span>
          <span><strong>Submitted:</strong> ${s.submitted_at?.slice(0,10) || '—'}</span>
        </div>
      </div>
      <span class="status ${st.cls}">${st.label}</span>
    </div>

    <!-- Expandable details -->
    <div id="details-${s.submission_id}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:.84rem;margin-bottom:12px;">
        <div><strong style="color:var(--text-muted);font-size:.75rem;text-transform:uppercase;">Abstract</strong><p style="margin:4px 0;color:var(--text-secondary);line-height:1.5;font-size:.84rem;">${(s.abstract||'').slice(0,300)}${(s.abstract||'').length>300?'…':''}</p></div>
        <div>
          <div style="margin-bottom:6px;"><strong style="color:var(--text-muted);font-size:.75rem;text-transform:uppercase;">Keywords</strong><p style="margin:3px 0;font-size:.84rem;">${s.keywords||'—'}</p></div>
          <div style="margin-bottom:6px;"><strong style="color:var(--text-muted);font-size:.75rem;text-transform:uppercase;">Conflict of Interest</strong><p style="margin:3px 0;font-size:.84rem;">${s.conflict_of_interest||'—'}</p></div>
          <div style="margin-bottom:6px;"><strong style="color:var(--text-muted);font-size:.75rem;text-transform:uppercase;">AI Used</strong><p style="margin:3px 0;font-size:.84rem;">${s.ai_used||'—'}</p></div>
          <div><strong style="color:var(--text-muted);font-size:.75rem;text-transform:uppercase;">Figures / Tables</strong><p style="margin:3px 0;font-size:.84rem;">${s.num_figures||0} figures · ${s.num_tables||0} tables</p></div>
        </div>
      </div>

      ${files.length ? `<div style="margin-bottom:10px;"><strong style="color:var(--text-muted);font-size:.75rem;text-transform:uppercase;display:block;margin-bottom:6px;">Uploaded Files</strong>${fileHtml}</div>` : ''}

      ${reviewers.length ? `<div style="margin-bottom:10px;">
        <strong style="color:var(--text-muted);font-size:.75rem;text-transform:uppercase;display:block;margin-bottom:6px;">Suggested Reviewers</strong>
        ${reviewers.map((r,i) => `<div style="font-size:.83rem;padding:5px 0;border-bottom:1px dashed var(--border);">${i+1}. <strong>${r.name||'—'}</strong> — ${r.institution||'—'} — ${r.email||'—'} <em style="color:var(--text-muted);">(${r.expertise||''})</em></div>`).join('')}
      </div>` : ''}
    </div>

    <!-- Action bar -->
    <div style="display:flex;gap:8px;margin-top:12px;padding-top:10px;border-top:1px dashed var(--border);flex-wrap:wrap;align-items:center;">
      <button onclick="toggleAdminDetails('${s.submission_id}')" class="btn btn-ghost btn-small">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Details
      </button>
      <select onchange="updateSubmissionStatus('${s.submission_id}', this.value)"
        style="padding:6px 12px;border-radius:6px;border:1px solid var(--border-dark);font-size:.82rem;background:var(--bg);font-family:var(--font-sans);">
        <option value="pending"   ${s.status==='pending'   ?'selected':''}>Awaiting Review</option>
        <option value="screening" ${s.status==='screening' ?'selected':''}>Editorial Screening</option>
        <option value="review"    ${s.status==='review'    ?'selected':''}>Under Peer Review</option>
        <option value="revision"  ${s.status==='revision'  ?'selected':''}>Revision Requested</option>
        <option value="approved"  ${s.status==='approved'  ?'selected':''}>Accepted</option>
        <option value="published" ${s.status==='published' ?'selected':''}>Published</option>
        <option value="rejected"  ${s.status==='rejected'  ?'selected':''}>Rejected</option>
      </select>
      <button class="btn btn-secondary btn-small" onclick="updateSubmissionStatus('${s.submission_id}','approved')">✓ Accept</button>
      <button class="btn btn-ghost btn-small" style="color:var(--danger);border-color:var(--danger);" onclick="updateSubmissionStatus('${s.submission_id}','rejected')">✗ Reject</button>
    </div>

    ${s.review_note ? `<div class="submission-review" style="margin-top:8px;"><strong>Editor's Note:</strong> ${s.review_note}</div>` : ''}
  </div>`;
}

function toggleAdminDetails(subId) {
  const el = document.getElementById('details-' + subId);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}
window.toggleAdminDetails = toggleAdminDetails;



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
      { label: 'Peer Review', done: ['approved','published','rejected'].includes(s.status), current: s.status==='review' },
      { label: 'Decision',    done: ['approved','published','rejected'].includes(s.status) },
      { label: 'Published',   done: s.status==='published' },
    ];
    timelineHtml = `<div style="margin-top:16px;padding-top:14px;border-top:1px dashed var(--border);">
      <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:12px;">Review Progress</div>
      <div style="display:flex;gap:0;flex-wrap:wrap;">
        ${stages.map((st2, i) => `
          <div style="flex:1;min-width:80px;text-align:center;position:relative;padding-top:24px;">
            <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:20px;height:20px;border-radius:50%;border:2px solid ${st2.done?'var(--success)':st2.current?'var(--primary)':'var(--border-dark)'};background:${st2.done?'var(--success)':st2.current?'var(--primary)':'var(--bg)'};display:grid;place-items:center;">
              ${st2.done?'<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
            </div>
            ${i<stages.length-1?`<div style="position:absolute;top:9px;left:calc(50% + 10px);right:0;height:2px;background:${st2.done?'var(--success)':'var(--border)'};"></div>`:''}
            <span style="font-size:.72rem;color:var(--text-muted);display:block;">${st2.label}</span>
          </div>`).join('')}
      </div>
    </div>`;
  }

  // Resubmit button for rejected
  const resubmitBtn = s.status === 'rejected' ? `
    <div style="margin-top:12px;padding:12px 14px;background:var(--danger-bg);border:1px solid var(--danger);border-radius:var(--radius);">
      <p style="margin:0 0 8px;font-size:.86rem;color:var(--danger);font-weight:600;">This manuscript was not accepted.</p>
      ${s.reviewNote ? `<p style="margin:0 0 8px;font-size:.84rem;color:var(--text-secondary);">Editor's note: ${s.reviewNote}</p>` : ''}
      <button class="btn btn-secondary btn-small" onclick="resubmitManuscript('${s.id||s.submission_id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>
        Resubmit with Edits
      </button>
    </div>` : '';

  return `
  <div class="submission-item">
    <div class="submission-head">
      <div>
        <p class="submission-title">${s.title}</p>
        <div class="submission-meta">
          <span><strong>ID:</strong> ${s.id||s.submission_id||'—'}</span>
          <span><strong>Type:</strong> ${s.type||s.article_type||'—'}</span>
          <span><strong>Subspecialty:</strong> ${s.subspecialty||'—'}</span>
          <span><strong>Submitted:</strong> ${s.date||s.submitted_at?.slice(0,10)||'—'}</span>
        </div>
      </div>
      <span class="status ${st.cls}">${st.label}</span>
    </div>
    ${files.length ? `<div class="submission-files">
      ${files.map(f => `<span style="display:inline-flex;align-items:center;gap:5px;font-size:.78rem;padding:3px 9px;background:var(--bg-alt);border:1px solid var(--border);border-radius:999px;color:var(--text-secondary);">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        ${typeof f === 'string' ? f : f.original_name}
      </span>`).join('')}
    </div>` : ''}
    ${s.reviewNote && s.status !== 'rejected' ? `<div class="submission-review"><strong>Editor's Note:</strong> ${s.reviewNote}</div>` : ''}
    ${resubmitBtn}
    ${timelineHtml}
  </div>`;
}

// ── Resubmit with pre-filled data ─────────────────────────────
function resubmitManuscript(subId) {
  // Find submission in local data or backend data
  const subs = getLocalSubmissions();
  const sub  = subs.find(s => (s.id === subId || s.submission_id === subId));

  showSection('submit');

  // Show disclaimer first then pre-fill after agree
  window._resubmitData = sub;
  showToast('Resubmit', 'Complete the disclaimer then your previous details will be pre-filled.', 'success');
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

  // ── ADD THIS ──
  if (sessionStorage.getItem('clinova_admin')) {
    loadAdminSubmissions();  // always reload for admin
  } else {
    if (name === 'submissions') loadSubmissions();
  }

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


function updateStats(subs) {
  setText('stat-total-sub', subs.length);
  setText('stat-pending',   subs.filter(s => ['pending','screening','review','revision'].includes(s.status)).length);
  setText('stat-approved',  subs.filter(s => ['approved','published'].includes(s.status)).length);
  setText('stat-rejected',  subs.filter(s => s.status === 'rejected').length);
  const pending = subs.filter(s => ['pending','review','revision'].includes(s.status)).length;
  const badge = document.getElementById('pending-badge');
  if (badge) { badge.style.display = pending > 0 ? 'inline-flex' : 'none'; badge.textContent = pending; }
}



// ── Disclaimer ────────────────────────────────────────────────
function agreeDisclaimer() {
  document.getElementById('sub-disclaimer-screen').style.display = 'none';
  document.getElementById('sub-wizard-screen').style.display     = 'block';
  initAuthorTable();
  addReviewerRow(); // start with one reviewer row
}

// ── Step navigation ───────────────────────────────────────────
function subNext() {
  if (!validateSubStep(subCurrentStep)) return;
  if (subCurrentStep === SUB_TOTAL_STEPS) {
    // Show final review
    buildFinalReview();
    goToSubStep(8);
  } else {
    goToSubStep(subCurrentStep + 1);
  }
}

function subPrev() {
  if (subCurrentStep <= 1) return;
  if (subCurrentStep === 8) {
    goToSubStep(SUB_TOTAL_STEPS);
  } else {
    goToSubStep(subCurrentStep - 1);
  }
}

function goToSubStep(n) {
  // Hide all panels
  document.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
  // Show target panel
  const panel = document.getElementById('sub-panel-' + n);
  if (panel) panel.classList.add('active');

  // Update sidebar (only for steps 1-7)
  for (let i = 1; i <= SUB_TOTAL_STEPS; i++) {
    const item = document.getElementById('sub-sidebar-' + i);
    if (!item) continue;
    item.className = 'sub-step-item ' + (
      i === n   ? 'active'   :
      i < n     ? 'done'     :
                  'inactive'
    );
  }

  subCurrentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Validation per step ────────────────────────────────────────
function validateSubStep(step) {
  if (step === 1) {
    const type = document.getElementById('s1-article-type')?.value;
    const spec = document.getElementById('s1-subspecialty')?.value;
    if (!type) { showToast('Required', 'Please select an Article Type.', 'error'); return false; }
    if (!spec) { showToast('Required', 'Please select a Subspeciality.', 'error'); return false; }
  }
  if (step === 2) {
    const title = document.getElementById('s2-title')?.value.trim();
    const abs   = document.getElementById('s2-abstract')?.value.trim();
    if (!title) { showToast('Required', 'Please enter the Article Title.', 'error'); return false; }
    if (!abs)   { showToast('Required', 'Please enter the Abstract.', 'error'); return false; }
  }
  if (step === 3) {
    const rows = document.querySelectorAll('#author-table-body tr');
    if (!rows.length) { showToast('Required', 'Please add at least one author.', 'error'); return false; }
  }
  if (step === 4) {
    const mFiles = subFiles.manuscript;
    if (!mFiles.length) { showToast('Required', 'Please upload the Main Manuscript file.', 'error'); return false; }
  }
  return true;
}

// ── Author table ──────────────────────────────────────────────
function initAuthorTable() {
  // Pre-fill with logged-in user
  const session = getSession();
  if (!session) return;
  const nameParts = (session.firstName + ' ' + session.lastName).split(' ');
  authorRows = [{
    firstName: nameParts[0] || '',
    lastName:  nameParts.slice(1).join(' ') || '',
    email:     session.email || '',
    sequence:  'Unselected',
    corresponding: true,
    editorial: false,
  }];
  renderAuthorTable();
}

function addAuthorRow() {
  authorRows.push({ firstName:'', lastName:'', email:'', sequence:'Unselected', corresponding:false, editorial:false });
  renderAuthorTable();
}

function removeAuthorRow(idx) {
  if (authorRows.length <= 1) { showToast('Error', 'At least one author is required.', 'error'); return; }
  authorRows.splice(idx, 1);
  renderAuthorTable();
}

function renderAuthorTable() {
  const tbody = document.getElementById('author-table-body');
  if (!tbody) return;
  tbody.innerHTML = authorRows.map((a, i) => `
    <tr>
      <td style="text-align:center;font-weight:600;">${i+1}</td>
      <td><input type="text" value="${escHtml(a.firstName)}" onchange="updateAuthor(${i},'firstName',this.value)" placeholder="First Name"/></td>
      <td><input type="text" value="${escHtml(a.lastName)}"  onchange="updateAuthor(${i},'lastName',this.value)"  placeholder="Last Name"/></td>
      <td><input type="email" value="${escHtml(a.email)}"    onchange="updateAuthor(${i},'email',this.value)"     placeholder="Email"/></td>
      <td>
        <select onchange="updateAuthor(${i},'sequence',this.value)">
          ${['Unselected','First Author','Second Author','Third Author','Fourth Author','Fifth Author','Sixth Author','Other']
            .map(s => `<option${s===a.sequence?' selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td style="text-align:center;"><input type="radio" name="corresponding-author" ${a.corresponding?'checked':''} onchange="setCorresponding(${i})"/></td>
      <td style="text-align:center;"><input type="checkbox" ${a.editorial?'checked':''} onchange="updateAuthor(${i},'editorial',this.checked)"/></td>
      <td style="text-align:center;">
        <button onclick="removeAuthorRow(${i})" style="color:var(--danger);padding:4px 8px;border-radius:4px;font-size:.8rem;" title="Remove">✕</button>
      </td>
    </tr>`).join('');
  updateCitePreview();
}

function updateAuthor(idx, field, val) {
  authorRows[idx][field] = val;
  updateCitePreview();
}

function setCorresponding(idx) {
  authorRows.forEach((a, i) => a.corresponding = (i === idx));
  renderAuthorTable();
}

function updateCitePreview() {
  const el = document.getElementById('cite-preview-text');
  if (!el) return;
  const title = document.getElementById('s2-title')?.value.trim() || '…';
  const shown = authorRows.slice(0, 6);
  const authStr = shown.map(a => {
    const sn = a.lastName || '?';
    const initials = (a.firstName || '').split(' ').map(w => w[0] || '').join('').toUpperCase();
    return `<span class="cite-author">${sn} ${initials}</span>`;
  }).join(', ') + (authorRows.length > 6 ? ' <em>et al.</em>' : '');
  el.innerHTML = `${authStr}. <span class="cite-title">${escHtml(title)}</span>`;
}

// ── Reviewer table ─────────────────────────────────────────────
function addReviewerRow() {
  if (reviewerRows.length >= 3) { showToast('Limit', 'You may suggest up to 3 reviewers.', 'error'); return; }
  reviewerRows.push({ name:'', institution:'', email:'', expertise:'' });
  renderReviewerTable();
}

function removeReviewerRow(idx) {
  reviewerRows.splice(idx, 1);
  renderReviewerTable();
}

function renderReviewerTable() {
  const tbody = document.getElementById('reviewer-table-body');
  if (!tbody) return;
  if (!reviewerRows.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:18px;color:var(--text-muted);font-size:.86rem;">No reviewers added. You may skip this step.</td></tr>`;
    return;
  }
  tbody.innerHTML = reviewerRows.map((r, i) => `
    <tr>
      <td style="text-align:center;font-weight:600;">${i+1}</td>
      <td><input type="text" value="${escHtml(r.name)}"        onchange="reviewerRows[${i}].name=this.value"        placeholder="Full Name"/></td>
      <td><input type="text" value="${escHtml(r.institution)}" onchange="reviewerRows[${i}].institution=this.value" placeholder="Institution"/></td>
      <td><input type="email" value="${escHtml(r.email)}"      onchange="reviewerRows[${i}].email=this.value"       placeholder="Email"/></td>
      <td><input type="text" value="${escHtml(r.expertise)}"   onchange="reviewerRows[${i}].expertise=this.value"   placeholder="Area of expertise"/></td>
      <td style="text-align:center;"><button onclick="removeReviewerRow(${i})" style="color:var(--danger);">✕</button></td>
    </tr>`).join('');
}

// ── File upload handling ──────────────────────────────────────
function triggerFileInput(inputId) {
  document.getElementById(inputId)?.click();
}

function handleFUZ(input, listId, category) {
  const newFiles = [...(input.files || [])];
  newFiles.forEach(f => {
    if (!subFiles[category].find(x => x.name === f.name)) {
      subFiles[category].push(f);
    }
  });
  renderFUZ(listId, category);
  input.value = '';
}

function renderFUZ(listId, category) {
  const el = document.getElementById(listId);
  if (!el) return;
  const files = subFiles[category] || [];
  if (!files.length) { el.innerHTML = ''; return; }
  el.innerHTML = files.map((f, i) => `
    <div class="fuz-file-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <span class="fuz-fn">${escHtml(f.name)}</span>
      <span class="fuz-sz">${formatFileSize(f.size)}</span>
      <button onclick="removeFUZFile('${category}',${i},'${listId}')" title="Remove">✕</button>
    </div>`).join('');
}

function removeFUZFile(category, idx, listId) {
  subFiles[category].splice(idx, 1);
  renderFUZ(listId, category);
}

function formatFileSize(b) {
  if (b < 1024)       return b + ' B';
  if (b < 1048576)    return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(1) + ' MB';
}

// ── Keyword handling ──────────────────────────────────────────
function handleKeywordInput(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, '');
    if (!val) return;
    if (keywords.length >= 5) { showToast('Limit', 'Maximum 5 keywords allowed.', 'error'); return; }
    if (!keywords.includes(val)) {
      keywords.push(val);
      renderKeywordTags();
    }
    e.target.value = '';
  } else if (e.key === 'Backspace' && !e.target.value && keywords.length) {
    keywords.pop();
    renderKeywordTags();
  }
}

function removeKeyword(idx) {
  keywords.splice(idx, 1);
  renderKeywordTags();
}

function renderKeywordTags() {
  const container = document.getElementById('kw-tags-container');
  const input = document.getElementById('kw-input');
  if (!container || !input) return;
  // Remove old tags
  container.querySelectorAll('.keyword-tag').forEach(t => t.remove());
  // Insert tags before input
  keywords.forEach((kw, i) => {
    const tag = document.createElement('span');
    tag.className = 'keyword-tag';
    tag.innerHTML = `${escHtml(kw)} <button onclick="removeKeyword(${i})" type="button">×</button>`;
    container.insertBefore(tag, input);
  });
  const counter = document.getElementById('s2-kw-count');
  if (counter) counter.textContent = keywords.length;
}

// ── Character / word counters ─────────────────────────────────
function updateCounter(inputId, charId, wordId, max) {
  const val = document.getElementById(inputId)?.value || '';
  const chars = val.length;
  const words = val.trim() ? val.trim().split(/\s+/).length : 0;
  const charEl = document.getElementById(charId);
  const wordEl = document.getElementById(wordId);
  if (charEl) charEl.textContent = chars;
  if (wordEl) wordEl.textContent = words;
  if (charEl) charEl.style.color = chars > max ? 'var(--danger)' : '';
}

function updateCounterInput(inputId, charId, wordId, max) {
  updateCounter(inputId, charId, wordId, max);
}

function updateAbstractCounter() {
  const val = document.getElementById('s2-abstract')?.value || '';
  const charEl = document.getElementById('s2-abs-chars');
  const wordEl = document.getElementById('s2-abs-words');
  if (charEl) charEl.textContent = val.length;
  if (wordEl) wordEl.textContent = val.trim() ? val.trim().split(/\s+/).length : 0;
}

// ── Radio inline styling ──────────────────────────────────────
function toggleCOI(input) {
  document.querySelectorAll('.radio-inline label').forEach(l => l.classList.remove('selected'));
  input.closest('label').classList.add('selected');
  const wrap = document.getElementById('coi-details-wrap');
  if (wrap) wrap.style.display = input.value === 'yes' ? 'block' : 'none';
}

function styleRadioInline(input) {
  const group = input.closest('.radio-inline');
  if (!group) return;
  group.querySelectorAll('label').forEach(l => l.classList.remove('selected'));
  input.closest('label').classList.add('selected');
}

// ── Build final review ────────────────────────────────────────
function buildFinalReview() {
  const el = document.getElementById('final-review-content');
  if (!el) return;

  const getVal = id => document.getElementById(id)?.value || '—';
  const getRadio = name => document.querySelector(`input[name="${name}"]:checked`)?.value || '—';

  const authorList = authorRows.map((a,i) =>
    `${i+1}. ${a.firstName} ${a.lastName} &lt;${a.email}&gt;${a.corresponding?' (Corresponding)':''}`
  ).join('<br>');

  const reviewerList = reviewerRows.filter(r => r.name).map((r,i) =>
    `${i+1}. ${r.name} — ${r.institution} — ${r.email}`
  ).join('<br>') || '—';

  const allFiles = Object.entries(subFiles)
    .flatMap(([cat, files]) => files.map(f => `${f.name} (${cat.replace('_',' ')})`))
    .join('<br>') || '—';

  el.innerHTML = `
    <div class="final-review-block">
      <div class="final-review-block-head">1. Article Type &amp; Subspecialty</div>
      <div class="final-review-row"><strong>Article Type</strong><span>${getVal('s1-article-type')}</span></div>
      <div class="final-review-row"><strong>Subspecialty</strong><span>${getVal('s1-subspecialty')}</span></div>
      <div class="final-review-row"><strong>CTR Number</strong><span>${getVal('s1-ctr') || 'N/A'}</span></div>
      <div class="final-review-row"><strong>Conflict of Interest</strong><span>${getRadio('coi')}</span></div>
      <div class="final-review-row"><strong>Financial Support</strong><span>${getVal('s1-financial')}</span></div>
      <div class="final-review-row"><strong>Patient Consent</strong><span>${getRadio('patient-consent')}</span></div>
      <div class="final-review-row"><strong>IRB Permission</strong><span>${getRadio('irb')}</span></div>
      <div class="final-review-row"><strong>AI Used</strong><span>${getRadio('ai-used')}</span></div>
      <div class="final-review-row"><strong>Preprint Submitted</strong><span>${getRadio('preprint')}</span></div>
      <div class="final-review-row"><strong>No. of Authors</strong><span>${getVal('s1-num-authors')}</span></div>
      <div class="final-review-row"><strong>No. of Figures</strong><span>${getVal('s1-num-figures')}</span></div>
      <div class="final-review-row"><strong>No. of Tables</strong><span>${getVal('s1-num-tables')}</span></div>
    </div>
    <div class="final-review-block">
      <div class="final-review-block-head">2. Article Title, Abstract &amp; Keywords</div>
      <div class="final-review-row"><strong>Article Title</strong><span>${escHtml(getVal('s2-title'))}</span></div>
      <div class="final-review-row"><strong>Running Title</strong><span>${escHtml(getVal('s2-running-title')) || 'N/A'}</span></div>
      <div class="final-review-row"><strong>Keywords</strong><span>${keywords.join(', ') || '—'}</span></div>
      <div class="final-review-row"><strong>Abstract</strong><span style="white-space:pre-line;line-height:1.6;">${escHtml(getVal('s2-abstract'))}</span></div>
    </div>
    <div class="final-review-block">
      <div class="final-review-block-head">3. Author Information</div>
      <div class="final-review-row"><strong>Authors</strong><span>${authorList}</span></div>
    </div>
    <div class="final-review-block">
      <div class="final-review-block-head">4–6. Files Uploaded</div>
      <div class="final-review-row"><strong>All Files</strong><span>${allFiles}</span></div>
    </div>
    <div class="final-review-block">
      <div class="final-review-block-head">7. Suggested Reviewers</div>
      <div class="final-review-row"><strong>Reviewers</strong><span>${reviewerList}</span></div>
    </div>`;
}

// ── Final submit ───────────────────────────────────────────────
async function finalSubmit() {
  const btn = document.getElementById('final-approve-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Submitting…'; }

  const session = getSession();
  const getVal  = id => document.getElementById(id)?.value || '';
  const getRadio = name => document.querySelector(`input[name="${name}"]:checked`)?.value || '';

  // Build local record
  const localEntry = {
    id:           'CRJ-' + Date.now().toString().slice(-6),
    email:        session?.email,
    title:        getVal('s2-title').trim(),
    running_title:getVal('s2-running-title').trim(),
    article_type: getVal('s1-article-type'),
    subspecialty: getVal('s1-subspecialty'),
    ctr_number:   getVal('s1-ctr'),
    category:     'medical',
    authors:      authorRows.map(a => `${a.firstName} ${a.lastName}`).join(', '),
    abstract:     getVal('s2-abstract').trim(),
    keywords:     keywords.join(', '),
    conflict_of_interest: getRadio('coi'),
    financial_support:    getVal('s1-financial'),
    patient_consent:      getRadio('patient-consent'),
    irb_permission:       getRadio('irb'),
    ai_used:              getRadio('ai-used'),
    preprint_submitted:   getRadio('preprint'),
    num_authors:          parseInt(getVal('s1-num-authors')) || 1,
    num_figures:          parseInt(getVal('s1-num-figures')) || 0,
    num_tables:           parseInt(getVal('s1-num-tables'))  || 0,
    files:        Object.entries(subFiles).flatMap(([,files]) => files.map(f => f.name)),
    status:       'pending',
    date:         new Date().toLocaleDateString('en-IN'),
    reviewNote:   '',
  };

  // Save locally first
  const subs = getLocalSubmissions();
  subs.push(localEntry);
  saveLocalSubmissions(subs);

  // POST to backend
  try {
    const formData = new FormData();
    formData.append('title',               localEntry.title);
    formData.append('running_title',       localEntry.running_title);
    formData.append('article_type',        localEntry.article_type);
    formData.append('subspecialty',        localEntry.subspecialty);
    formData.append('ctr_number',          localEntry.ctr_number);
    formData.append('category',            'medical');
    formData.append('authors',             localEntry.authors);
    formData.append('abstract',            localEntry.abstract);
    formData.append('keywords',            localEntry.keywords);
    formData.append('conflict_of_interest',localEntry.conflict_of_interest);
    formData.append('conflict_details',    getVal('s1-coi-details'));
    formData.append('financial_support',   localEntry.financial_support);
    formData.append('patient_consent',     localEntry.patient_consent);
    formData.append('irb_permission',      localEntry.irb_permission);
    formData.append('ai_used',             localEntry.ai_used);
    formData.append('preprint_submitted',  localEntry.preprint_submitted);
    formData.append('num_authors',         localEntry.num_authors);
    formData.append('num_figures',         localEntry.num_figures);
    formData.append('num_tables',          localEntry.num_tables);
    formData.append('suggested_reviewers', JSON.stringify(reviewerRows));

    // Append all files with their category
    Object.entries(subFiles).forEach(([category, files]) => {
      files.forEach(f => {
        formData.append('files', f);
        formData.append('file_categories', category);
      });
    });

    await fetch(`${API}/submissions/`, {
      method:  'POST',
      headers: { 'Authorization': `Token ${session?.token}` },
      body:    formData,
    });
  } catch (_) { /* backend offline - localStorage saved */ }

  // Reset form
  resetSubmitForm();
  if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Approve and Submit'; }

  showToast('Submitted!', `"${localEntry.title.slice(0,50)}…" has been submitted successfully.`, 'success');
  showSection('submissions');
  loadSubmissions();
}

// ── Reset form ─────────────────────────────────────────────────
function resetSubmitForm() {
  // Reset to disclaimer screen
  document.getElementById('sub-disclaimer-screen').style.display = 'block';
  document.getElementById('sub-wizard-screen').style.display     = 'none';
  goToSubStep(1);

  // Clear all fields
  ['s1-article-type','s1-subspecialty','s1-ctr','s1-financial','s1-num-authors','s1-num-figures','s1-num-tables',
   's2-title','s2-running-title','s2-abstract'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = id === 's1-financial' ? 'Nil' : id.startsWith('s1-num') ? '0' : '';
  });

  // Reset radios
  document.querySelector('input[name="coi"][value="no"]')?.click();
  document.querySelector('input[name="patient-consent"][value="not_applicable"]')?.click();
  document.querySelector('input[name="irb"][value="waived"]')?.click();
  document.querySelector('input[name="ai-used"][value="no"]')?.click();
  document.querySelector('input[name="preprint"][value="no"]')?.click();

  // Clear files
  Object.keys(subFiles).forEach(k => subFiles[k] = []);
  ['fuz-files-cover','fuz-files-manuscript','fuz-files-figures','fuz-files-supplementary',
   'fuz-files-guideline','fuz-files-copyright','fuz-files-disclosure','fuz-files-other'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });

  // Clear keywords
  keywords = [];
  renderKeywordTags();

  // Reset author/reviewer tables
  authorRows = [];
  reviewerRows = [];
  initAuthorTable();
}

// ── Utility ────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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

window.toggleAdminDetails = toggleAdminDetails;
