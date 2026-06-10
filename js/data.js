// ============================================================
//  Clinova – Demo Data
//  All demo articles, categories, editorial board data
// ============================================================
const CLINOVA_ARTICLES = [];

// Stats shown on homepage
const CLINOVA_STATS = {
  totalArticles: 0,
  totalAuthors: 0,
  disciplines: 3,
  citeScore: 0.9,
  estYear: 2026,
  avgReview: "18 days",
  countries: 1
};

// Category counts
const CLINOVA_CAT_COUNTS = {
  medical: 118,
  tech: 82,
  science: 48
};

// SVG thumbnails for articles
function getThumbSVG(type) {
  const svgs = {
    roc: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="200" height="150" fill="#FAF1F2"/>
      <text x="100" y="20" text-anchor="middle" fill="#7A1F2B" font-size="9" font-family="serif" font-weight="600">ROC Curve Analysis</text>
      <line x1="30" y1="130" x2="30" y2="30" stroke="#D4CCBC" stroke-width="1"/>
      <line x1="30" y1="130" x2="170" y2="130" stroke="#D4CCBC" stroke-width="1"/>
      <path d="M30 130 L170 30" stroke="#E8E2D5" stroke-width="1" stroke-dasharray="3,3"/>
      <path d="M30 130 Q40 100 60 70 Q90 40 130 35 Q160 32 170 30" stroke="#7A1F2B" stroke-width="2.5" fill="none"/>
      <path d="M30 130 Q50 90 80 65 Q120 38 170 30" stroke="#C9A961" stroke-width="2" fill="none" stroke-dasharray="4,2"/>
      <circle cx="88" cy="58" r="3" fill="#7A1F2B"/>
      <text x="100" y="140" text-anchor="middle" fill="#7A6F72" font-size="7" font-family="sans-serif">1 - Specificity</text>
      <text x="14" y="80" fill="#7A6F72" font-size="7" font-family="sans-serif" transform="rotate(-90,14,80)">Sensitivity</text>
    </svg>`,
    chart: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="200" height="150" fill="#F5EFE3"/>
      <text x="100" y="18" text-anchor="middle" fill="#5C1620" font-size="9" font-family="serif" font-weight="600">DR Grade Distribution</text>
      <rect x="30" y="90" width="20" height="40" fill="#7A1F2B" rx="2"/>
      <rect x="60" y="70" width="20" height="60" fill="#9B2D3B" rx="2"/>
      <rect x="90" y="55" width="20" height="75" fill="#C9A961" rx="2"/>
      <rect x="120" y="80" width="20" height="50" fill="#7A1F2B" opacity=".7" rx="2"/>
      <rect x="150" y="95" width="20" height="35" fill="#9B2D3B" opacity=".7" rx="2"/>
      <line x1="25" y1="130" x2="180" y2="130" stroke="#D4CCBC" stroke-width="1"/>
      <text x="40" y="142" text-anchor="middle" fill="#7A6F72" font-size="6.5">G0</text>
      <text x="70" y="142" text-anchor="middle" fill="#7A6F72" font-size="6.5">G1</text>
      <text x="100" y="142" text-anchor="middle" fill="#7A6F72" font-size="6.5">G2</text>
      <text x="130" y="142" text-anchor="middle" fill="#7A6F72" font-size="6.5">G3</text>
      <text x="160" y="142" text-anchor="middle" fill="#7A6F72" font-size="6.5">G4</text>
    </svg>`,
    bar: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="200" height="150" fill="#FAF7F2"/>
      <text x="100" y="18" text-anchor="middle" fill="#5C1620" font-size="9" font-family="serif" font-weight="600">Forest Plot — OR by Population</text>
      <line x1="30" y1="25" x2="30" y2="130" stroke="#D4CCBC" stroke-width="1"/>
      <line x1="30" y1="130" x2="180" y2="130" stroke="#D4CCBC" stroke-width="1"/>
      <line x1="105" y1="25" x2="105" y2="130" stroke="#C9A961" stroke-width="1" stroke-dasharray="3,2"/>
      ${[40,60,80,100].map((y,i) => `
        <line x1="${55 + i*8}" y1="${y}" x2="${155 - i*5}" y2="${y}" stroke="#D4CCBC" stroke-width="1"/>
        <rect x="${80 + i*3}" y="${y - 5}" width="10" height="10" fill="#7A1F2B" rx="2"/>
        <text x="20" y="${y + 4}" text-anchor="end" fill="#7A6F72" font-size="7">Pop${i+1}</text>
      `).join('')}
      <text x="105" y="143" text-anchor="middle" fill="#7A6F72" font-size="7">Odds Ratio</text>
    </svg>`,
    scatter: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="200" height="150" fill="#F5EFE3"/>
      <text x="100" y="18" text-anchor="middle" fill="#5C1620" font-size="9" font-family="serif" font-weight="600">NPK Sensor Calibration</text>
      <line x1="30" y1="130" x2="30" y2="30" stroke="#D4CCBC" stroke-width="1"/>
      <line x1="30" y1="130" x2="180" y2="130" stroke="#D4CCBC" stroke-width="1"/>
      <path d="M30 130 L180 30" stroke="#C9A961" stroke-width="1.5" stroke-dasharray="4,2"/>
      ${[[50,110],[65,95],[80,85],[100,70],[115,58],[130,48],[150,38],[165,32]].map(([x,y]) =>
        `<circle cx="${x}" cy="${y}" r="4" fill="#7A1F2B" opacity=".8"/>`
      ).join('')}
      <text x="105" y="143" text-anchor="middle" fill="#7A6F72" font-size="7">ICP-OES Reference (mg/kg)</text>
    </svg>`,
    line: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="200" height="150" fill="#FAF1F2"/>
      <text x="100" y="18" text-anchor="middle" fill="#5C1620" font-size="9" font-family="serif" font-weight="600">Tumour Volume Over Time</text>
      <line x1="30" y1="130" x2="30" y2="30" stroke="#D4CCBC" stroke-width="1"/>
      <line x1="30" y1="130" x2="180" y2="130" stroke="#D4CCBC" stroke-width="1"/>
      <path d="M30 80 Q70 75 100 65 Q130 55 160 40 Q170 36 175 35" stroke="#7A1F2B" stroke-width="2.5" fill="none"/>
      <path d="M30 80 Q60 85 90 95 Q120 108 160 120 Q170 123 175 125" stroke="#C9A961" stroke-width="2" fill="none" stroke-dasharray="5,2"/>
      <path d="M30 80 Q65 78 100 82 Q130 88 160 100" stroke="#9B2D3B" stroke-width="2" fill="none" stroke-dasharray="3,3"/>
      <circle cx="30" cy="80" r="3.5" fill="#7A1F2B"/>
      <text x="105" y="143" text-anchor="middle" fill="#7A6F72" font-size="7">Days Post-Treatment</text>
    </svg>`
  };
  return svgs[type] || svgs.chart;
}

// Build article card HTML
function buildArticleCard(article, compact = false) {
  const typeClass = {
    'Original Article': 'research',
    'Review Article': 'review',
    'Case Report': 'case',
    'Technical Communication': 'research',
    'Editorial': 'editorial',
    'Conference Abstract': 'editorial'
  }[article.type] || 'research';

  return `
  <div class="article-card" data-id="${article.id}" data-cat="${article.category}">
    <div class="article-thumb">
      ${getThumbSVG(article.thumb || 'chart')}
    </div>
    <div class="article-content">
      <div class="article-type ${typeClass}">${article.type} · ${article.categoryLabel}</div>
      <h3 class="article-title">
        <a href="${compact ? 'articles.html' : '#'}" onclick="openArticle('${article.id}'); return false;">${article.title}</a>
      </h3>
      <p class="article-authors">${article.authors}</p>
      <div class="article-meta">
        <a class="article-doi" href="https://doi.org/${article.doi}" target="_blank" rel="noopener">DOI: ${article.doi}</a>
        <span class="article-citations">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
          Citations <strong>${article.citations}</strong>
        </span>
        <span style="font-size:.8rem;color:var(--text-muted);">${article.volume} · ${article.date}</span>
      </div>
      <div class="article-links">
        <a href="#" onclick="openArticle('${article.id}'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Full text
        </a>
        <a href="#" onclick="openArticle('${article.id}'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          PDF
        </a>
      </div>
    </div>
  </div>`;
}

// Expose to window
window.CLINOVA_ARTICLES = CLINOVA_ARTICLES;
window.CLINOVA_STATS = CLINOVA_STATS;
window.CLINOVA_CAT_COUNTS = CLINOVA_CAT_COUNTS;
window.getThumbSVG = getThumbSVG;
window.buildArticleCard = buildArticleCard;
