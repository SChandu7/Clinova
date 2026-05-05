// ============================================================
//  Clinova – main.js
//  Navigation, search, toasts, article detail, shared utils
// ============================================================

/* ---- Mobile nav ---- */
const mobileToggle = document.getElementById('mobile-menu-toggle');
const mobileClose  = document.getElementById('mobile-menu-close');
const mainNav      = document.getElementById('main-nav');
const navOverlay   = document.getElementById('nav-overlay');

function openNav() {
  mainNav && mainNav.classList.add('is-open');
  navOverlay && navOverlay.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  mainNav && mainNav.classList.remove('is-open');
  navOverlay && navOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
}
mobileToggle && mobileToggle.addEventListener('click', openNav);
mobileClose  && mobileClose.addEventListener('click', closeNav);
navOverlay   && navOverlay.addEventListener('click', closeNav);

/* Show mobile search bar */
const mobileSearchBar = document.querySelector('.mobile-search-bar');
function checkMobileSearchBar() {
  if (mobileSearchBar) {
    mobileSearchBar.style.display = window.innerWidth <= 880 ? 'block' : 'none';
  }
}
window.addEventListener('resize', checkMobileSearchBar);
checkMobileSearchBar();

/* ---- Search ---- */
function handleSearch(e) {
  e.preventDefault();
  const q = e.target.querySelector('input').value.trim();
  if (q) window.location.href = 'articles.html?q=' + encodeURIComponent(q);
}

/* ---- Toast system ---- */
let toastTimer = null;
function showToast(title, msg, type = 'success') {
  const container = document.getElementById('toast-container') ||
    (() => { const d = document.createElement('div'); d.id = 'toast-container'; document.body.appendChild(d); return d; })();
  const old = container.querySelector('.toast');
  old && old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast' + (type === 'error' ? ' is-error' : '');
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="flex-shrink:0;color:${type==='error'?'var(--danger)':'var(--success)'}">
      ${type==='error'
        ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
        : '<polyline points="20 6 9 17 4 12"/>'}
    </svg>
    <div><strong>${title}</strong><span>${msg}</span></div>`;
  container.appendChild(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 4200);
}
window.showToast = showToast;

/* ---- Footer year ---- */
document.querySelectorAll('#footer-year, #footer-year2').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ---- Scope tab filter (homepage) ---- */
document.querySelectorAll('.scope-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.scope-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    filterHomeArticles(cat);
  });
});

function filterHomeArticles(cat) {
  const list = document.getElementById('home-articles-list');
  if (!list) return;
  const cards = list.querySelectorAll('.article-card');
  cards.forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? '' : 'none';
  });
}

/* ---- Render home articles ---- */
function renderHomeArticles() {
  const list = document.getElementById('home-articles-list');
  if (!list || !window.CLINOVA_ARTICLES) return;
  list.innerHTML = CLINOVA_ARTICLES.slice(0, 5).map(a => buildArticleCard(a, false)).join('');
}

/* ---- Open article detail (articles page) ---- */
function openArticle(id) {
  const article = (window.CLINOVA_ARTICLES || []).find(a => a.id === id);
  if (!article) return;

  // On articles.html, swap views
  const listView   = document.getElementById('articles-list-view');
  const detailView = document.getElementById('article-detail');
  const pageHero   = document.getElementById('page-hero-articles');

  if (listView && detailView) {
    listView.style.display   = 'none';
    detailView.style.display = 'block';
    if (pageHero) pageHero.style.display = 'none';
    populateArticleDetail(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Navigate from homepage → articles page with hash
    window.location.href = 'articles.html?id=' + encodeURIComponent(id);
  }
}
window.openArticle = openArticle;

function closeArticleDetail() {
  const listView   = document.getElementById('articles-list-view');
  const detailView = document.getElementById('article-detail');
  const pageHero   = document.getElementById('page-hero-articles');
  if (listView)   listView.style.display   = 'block';
  if (detailView) detailView.style.display = 'none';
  if (pageHero)   pageHero.style.display   = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.closeArticleDetail = closeArticleDetail;

function populateArticleDetail(a) {
  setText('det-title',    a.title);
  setText('det-authors',  a.authors);
  setText('det-doi',      a.doi);
  setText('det-vol',      a.volume);
  setText('det-date',     a.date);
  setText('det-cat',      a.categoryLabel);
  setText('det-abstract', a.abstract);
  setText('det-type',     a.type);
  setText('det-type2',    a.type);
  setText('det-vol2',     a.volume);
  setText('det-year2',    a.year);
  setText('det-cites',    a.citations);
  setText('det-views',    a.views.toLocaleString());

  // Keywords
  const kw = document.getElementById('det-keywords');
  if (kw) kw.innerHTML = (a.keywords || []).map(k => `<span class="keyword">${k}</span>`).join('');

  // Citation text
  const cite = document.getElementById('det-cite-text');
  if (cite) cite.textContent = `${a.authors}. "${a.title}." Clinova Multi-disciplinary Research Journal, ${a.volume}, ${a.date}. DOI: ${a.doi}`;

  // PDF area
  const pdfFrame = document.getElementById('det-pdf-frame');
  const pdfMsg   = document.getElementById('det-pdf-msg');
  const dlBtn    = document.getElementById('det-download-btn');
  const pdfBtn   = document.getElementById('det-pdf-btn');
  if (a.fileUrl) {
    if (pdfFrame) pdfFrame.innerHTML = `<iframe src="${a.fileUrl}" title="Article PDF"></iframe>`;
    if (dlBtn) { dlBtn.href = a.fileUrl; dlBtn.style.display = 'inline-flex'; }
    if (pdfBtn) pdfBtn.href = a.fileUrl;
  } else {
    if (pdfMsg) pdfMsg.textContent = 'The full-text document for this article is available via DOI. Click the DOI link or contact the editorial office.';
    if (pdfBtn) pdfBtn.href = `https://doi.org/${a.doi}`;
    if (pdfBtn) pdfBtn.setAttribute('target', '_blank');
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || '—';
}

function copyCitation() {
  const el = document.getElementById('det-cite-text');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent)
    .then(() => showToast('Copied!', 'Citation copied to clipboard.', 'success'))
    .catch(() => showToast('Error', 'Could not copy. Please copy manually.', 'error'));
}
window.copyCitation = copyCitation;

/* ---- Handle ?id= or ?q= on page load (articles.html) ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderHomeArticles();

  // Update stats counter
  const statTotal = document.getElementById('stat-total');
  const ctaStat   = document.getElementById('cta-stat1');
  if (statTotal && window.CLINOVA_STATS) statTotal.textContent = CLINOVA_STATS.totalArticles;
  if (ctaStat   && window.CLINOVA_STATS) ctaStat.textContent   = CLINOVA_STATS.totalArticles;

  // Parse URL params for articles.html
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  const qParam  = params.get('q');

  if (idParam) {
    // Slight delay so articles.js can render the list first
    setTimeout(() => openArticle(decodeURIComponent(idParam)), 80);
  }
  if (qParam) {
    const searchInput = document.getElementById('article-search');
    if (searchInput) {
      searchInput.value = decodeURIComponent(qParam);
      // Trigger filter
      if (typeof applyFilters === 'function') applyFilters();
    }
  }

  // Auth state - update header link
  updateAuthHeader();
});

/* ---- Auth state ---- */
function getSession() {
  try { return JSON.parse(localStorage.getItem('clinova_session')); } catch { return null; }
}
function updateAuthHeader() {
  const session = getSession();
  const area = document.getElementById('header-auth-area');
  const topbarLink = document.getElementById('topbar-auth-link');
  if (!area) return;
  if (session) {
    const initials = ((session.firstName || '?')[0] + (session.lastName || '?')[0]).toUpperCase();
    area.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <a href="dashboard.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--text);">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-darker));color:var(--gold-light);display:grid;place-items:center;font-weight:700;font-size:.85rem;border:2px solid var(--gold);">${initials}</div>
          <span style="font-size:.88rem;font-weight:600;color:var(--primary-darker);">${session.firstName}</span>
        </a>
      </div>`;
    if (topbarLink) { topbarLink.textContent = 'My Dashboard'; topbarLink.href = 'dashboard.html'; }
  }
}
window.getSession = getSession;
window.updateAuthHeader = updateAuthHeader;
