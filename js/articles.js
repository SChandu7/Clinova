// ============================================================
//  Clinova – articles.js
//  Filter, search, sort, pagination for articles page
// ============================================================

const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let filteredArticles = [];

function applyFilters() {
  const searchVal  = (document.getElementById('article-search')?.value || '').toLowerCase().trim();
  const sortVal    = document.getElementById('sort-select')?.value || 'newest';
  const catChecks  = [...document.querySelectorAll('.filter-sidebar input[type="checkbox"][value^="m"], .filter-sidebar input[type="checkbox"][value="tech"], .filter-sidebar input[type="checkbox"][value="science"]')]
                       .filter(c => c.checked).map(c => c.value);
  const typeChecks = [...document.querySelectorAll('.filter-sidebar input[type="checkbox"]')]
                       .filter(c => c.checked && !['medical','tech','science'].includes(c.value))
                       .map(c => c.value);
  const yearChecks = [...document.querySelectorAll('.filter-sidebar input[type="checkbox"][value="2026"], .filter-sidebar input[type="checkbox"][value="2025"], .filter-sidebar input[type="checkbox"][value="2024"], .filter-sidebar input[type="checkbox"][value="2023"]')]
                       .filter(c => c.checked).map(c => c.value);

  filteredArticles = (window.CLINOVA_ARTICLES || []).filter(a => {
    // Search
    if (searchVal) {
      const haystack = [a.title, a.authors, a.doi, a.abstract, ...(a.keywords||[])].join(' ').toLowerCase();
      if (!haystack.includes(searchVal)) return false;
    }
    // Category
    if (catChecks.length && !catChecks.includes(a.category)) return false;
    // Type
    if (typeChecks.length && !typeChecks.includes(a.type)) return false;
    // Year
    if (yearChecks.length && !yearChecks.includes(String(a.year))) return false;
    return true;
  });

  // Sort
  if (sortVal === 'newest')      filteredArticles.sort((a,b) => b.year - a.year || b.id.localeCompare(a.id));
  else if (sortVal === 'oldest') filteredArticles.sort((a,b) => a.year - b.year);
  else if (sortVal === 'title')  filteredArticles.sort((a,b) => a.title.localeCompare(b.title));

  currentPage = 1;
  renderArticlesList();
  renderPagination();
  updateActiveFilterTags(catChecks, typeChecks, yearChecks, searchVal);
}

function renderArticlesList() {
  const list    = document.getElementById('articles-main-list');
  const empty   = document.getElementById('articles-empty');
  const counter = document.getElementById('showing-count');
  if (!list) return;

  if (filteredArticles.length === 0) {
    list.innerHTML = '';
    empty && empty.classList.remove('hidden');
    if (counter) counter.textContent = 0;
    return;
  }

  empty && empty.classList.add('hidden');
  if (counter) counter.textContent = filteredArticles.length;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const page  = filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  list.innerHTML = page.map(a => buildArticleCard(a, false)).join('');
}

function renderPagination() {
  const pag = document.getElementById('pagination');
  if (!pag) return;
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) { pag.innerHTML = ''; return; }

  let html = `<button onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<span>…</span>`;
    }
  }
  html += `<button onclick="goPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}>›</button>`;
  pag.innerHTML = html;
}

function goPage(p) {
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderArticlesList();
  renderPagination();
  document.getElementById('articles-main-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.goPage = goPage;

function updateActiveFilterTags(cats, types, years, search) {
  const container = document.getElementById('active-filters');
  if (!container) return;
  let html = '';
  cats.forEach(c  => html += filterTag(c, `cat-${c}`));
  types.forEach(t => html += filterTag(t, `type-${t}`));
  years.forEach(y => html += filterTag(y, `year-${y}`));
  if (search)      html += filterTag(`"${search}"`, 'search');
  container.innerHTML = html;
}

function filterTag(label, key) {
  return `<span class="filter-tag">${label} <button onclick="removeFilter('${key}')">✕</button></span>`;
}

function removeFilter(key) {
  if (key.startsWith('cat-')) {
    const val = key.replace('cat-', '');
    const cb = document.querySelector(`.filter-sidebar input[value="${val}"]`);
    if (cb) cb.checked = false;
  } else if (key.startsWith('type-')) {
    const val = key.replace('type-', '');
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
      if (cb.value === val) cb.checked = false;
    });
  } else if (key.startsWith('year-')) {
    const val = key.replace('year-', '');
    const cb = document.querySelector(`.filter-sidebar input[value="${val}"]`);
    if (cb) cb.checked = false;
  } else if (key === 'search') {
    const inp = document.getElementById('article-search');
    if (inp) inp.value = '';
  }
  applyFilters();
}
window.removeFilter = removeFilter;

function clearAllFilters() {
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
  const inp = document.getElementById('article-search');
  if (inp) inp.value = '';
  const sort = document.getElementById('sort-select');
  if (sort) sort.value = 'newest';
  applyFilters();
}
window.clearAllFilters = clearAllFilters;

function handleInlineSearch(e) {
  e.preventDefault();
  const q = e.target.querySelector('input').value.trim();
  const inp = document.getElementById('article-search');
  if (inp && q) { inp.value = q; applyFilters(); }
}
window.handleInlineSearch = handleInlineSearch;

// Update counts in sidebar
function updateCategoryCounts() {
  const counts = window.CLINOVA_CAT_COUNTS || {};
  Object.entries(counts).forEach(([key, val]) => {
    const el = document.getElementById(`cnt-${key}`);
    if (el) el.textContent = val;
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  filteredArticles = [...(window.CLINOVA_ARTICLES || [])];
  filteredArticles.sort((a, b) => b.year - a.year);
  renderArticlesList();
  renderPagination();
  updateCategoryCounts();

  // Handle ?q= from homepage search
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const inp = document.getElementById('article-search');
    if (inp) { inp.value = q; applyFilters(); }
  }
});
