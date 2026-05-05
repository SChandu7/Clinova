// ============================================================
//  Clinova – Demo Data
//  All demo articles, categories, editorial board data
// ============================================================

const CLINOVA_ARTICLES = [
  {
    id: "CMRJ_001_2026",
    title: "Angiogenic Biomarkers and Maternal Cardiac Indices in Pre-eclampsia: A Multi-centre Prospective Study",
    authors: "Dr. Ananya Krishnamurthy, Dr. Priya Menon, Dr. S. Venkataraman, Prof. Leena Das",
    institution: "AIIMS New Delhi; IIT Madras; NIMHANS Bengaluru",
    type: "Original Article",
    category: "medical",
    categoryLabel: "Medical & Health",
    doi: "10.29847/CMRJ_001_2026",
    volume: "Vol. 8, No. 1",
    year: 2026,
    date: "March 2026",
    abstract: "Background: Pre-eclampsia remains a leading cause of maternal and perinatal morbidity worldwide, affecting 2–8% of pregnancies globally. Angiogenic imbalance plays a central role in its pathophysiology. This study aimed to evaluate the utility of angiogenic biomarkers—sFlt-1, PlGF, and their ratio—alongside maternal cardiac function indices in predicting adverse outcomes. Methods: A prospective multi-centre cohort study was conducted across three tertiary care hospitals in India between January 2024 and December 2025. A total of 320 pregnant women (160 with pre-eclampsia, 160 normotensive controls) were enrolled. Serum sFlt-1, PlGF, NT-proBNP, and troponin-I were measured at 28, 34, and 38 weeks. Cardiac parameters including GLS, GCW, and GWI were assessed by 2D speckle-tracking echocardiography. Results: sFlt-1/PlGF ratio was significantly elevated in pre-eclamptic women (median 112.3 vs. 14.6, p<0.001). GLS was impaired (−16.4±2.1% vs. −20.2±1.4%, p<0.001). A composite score incorporating sFlt-1/PlGF and GLS demonstrated AUC of 0.94 for predicting severe maternal outcomes. Conclusions: Combined angiogenic and echocardiographic assessment provides superior prediction of adverse maternal outcomes in pre-eclampsia compared to either parameter alone.",
    keywords: ["pre-eclampsia", "sFlt-1", "PlGF", "angiogenic markers", "maternal cardiac function", "speckle tracking echocardiography", "GLS"],
    citations: 3,
    views: 412,
    fileUrl: null,
    status: "published",
    thumb: "roc"
  },
  {
    id: "CMRJ_002_2026",
    title: "Deep Learning-Based Automated Detection of Diabetic Retinopathy Using Fundus Photographs: Validation on a 12,000-Image Dataset",
    authors: "Dr. Priya Menon, Mr. Arjun Subramaniam, Dr. K. Rajeswari, Prof. M. Chandrasekaran",
    institution: "IIT Madras; Sankara Nethralaya Chennai; BITS Pilani",
    type: "Original Article",
    category: "tech",
    categoryLabel: "Engineering & Tech",
    doi: "10.29847/CMRJ_002_2026",
    volume: "Vol. 8, No. 1",
    year: 2026,
    date: "March 2026",
    abstract: "Background: Diabetic retinopathy (DR) is the leading cause of preventable blindness globally, with India bearing a disproportionate burden. Automated screening using deep learning can bridge the gap in specialist availability. This study developed and validated a convolutional neural network (CNN) architecture for grading DR severity from fundus photographs. Methods: A multi-class CNN model (EfficientNet-B4 backbone with attention mechanisms) was trained on 9,600 labelled fundus images and validated on 2,400 held-out images from three clinical centres. Images were graded into five DR severity classes per ETDRS standards. Results: The model achieved an overall accuracy of 94.2%, with AUC of 0.97 for referable DR detection (Grade ≥2). Sensitivity was 93.8% and specificity 95.1% for sight-threatening DR. Processing time was 0.8 seconds per image on standard GPU hardware. The model demonstrated consistent performance across age groups and image quality levels. Conclusions: Our deep learning system demonstrates clinical-grade accuracy for automated DR screening and is suitable for deployment in resource-limited community health settings.",
    keywords: ["diabetic retinopathy", "deep learning", "CNN", "fundus photography", "automated screening", "EfficientNet", "computer vision"],
    citations: 7,
    views: 689,
    fileUrl: null,
    status: "published",
    thumb: "chart"
  },
  {
    id: "CMRJ_003_2025",
    title: "MTHFR Gene Polymorphism (C677T) and its Association with Pre-eclampsia Risk: A Systematic Review and Meta-analysis of 48 Studies",
    authors: "Dr. Sunita Patel, Dr. Obinna Edet, Prof. Arjun Rao, Dr. M. Lavanya",
    institution: "CSIR-CDRI Lucknow; University of Lagos; Sri Ramachandra Institute Chennai",
    type: "Review Article",
    category: "medical",
    categoryLabel: "Medical & Health",
    doi: "10.29847/CMRJ_003_2025",
    volume: "Vol. 7, No. 4",
    year: 2025,
    date: "December 2025",
    abstract: "Background: Methylenetetrahydrofolate reductase (MTHFR) gene polymorphisms, particularly C677T, have been proposed as risk factors for pre-eclampsia through elevated homocysteine pathways. However, existing studies show heterogeneous results across populations. We conducted a comprehensive meta-analysis to quantify this association. Methods: We systematically searched MEDLINE, EMBASE, SCOPUS, and CINAHL for studies published from 2000 to 2025. Studies reporting MTHFR C677T genotype frequencies in pre-eclamptic and normotensive pregnant women were included. Pooled odds ratios (OR) with 95% CI were calculated using random-effects models. Heterogeneity was assessed using I² statistics. Results: Forty-eight eligible studies encompassing 12,640 pre-eclamptic cases and 18,920 controls from 24 countries were included. The TT genotype was significantly associated with pre-eclampsia risk (OR 1.68, 95% CI 1.43–1.97, p<0.001), with moderate heterogeneity (I²=52%). The association was strongest in Asian populations (OR 2.14) compared to European (OR 1.41). Conclusions: MTHFR C677T TT genotype confers a significant but modest increase in pre-eclampsia risk, with notable population-based variation. Routine screening may be beneficial in high-risk Asian populations.",
    keywords: ["MTHFR", "C677T polymorphism", "pre-eclampsia", "meta-analysis", "homocysteine", "genetics", "obstetrics"],
    citations: 12,
    views: 1043,
    fileUrl: null,
    status: "published",
    thumb: "bar"
  },
  {
    id: "CMRJ_004_2025",
    title: "IoT-Based Real-Time Soil Health Monitoring System with NPK, pH and Pesticide Sensors for Precision Agriculture",
    authors: "Mr. S. Chandra Sekhar, Dr. T. Aravind Kumar, Prof. B. Satyanarayana",
    institution: "Andhra University, Visakhapatnam; JNTU Kakinada; IIT Hyderabad",
    type: "Technical Communication",
    category: "tech",
    categoryLabel: "Engineering & Tech",
    doi: "10.29847/CMRJ_004_2025",
    volume: "Vol. 7, No. 3",
    year: 2025,
    date: "September 2025",
    abstract: "This paper presents a low-cost IoT-based soil health monitoring system integrating NPK, pH, TDS, and toxic gas / pesticide sensors with ESP32 microcontrollers, cloud storage (AWS IoT Core), and a Flutter-based mobile dashboard. The system enables real-time continuous monitoring across agricultural fields with sub-minute data latency. NPK sensor calibration achieved R²=0.97 correlation with laboratory ICP-OES measurements across 240 soil samples from Andhra Pradesh. pH accuracy was ±0.1 pH units. The mobile application provides crop-specific fertilizer recommendations using a rule-based AI engine trained on agronomic standards. Field trials over one growing season demonstrated 18% reduction in fertilizer expenditure and 12% yield improvement compared to conventional soil testing. The complete system cost is under ₹8,500 per unit, making it viable for smallholder farmers across developing economies.",
    keywords: ["IoT", "soil health", "NPK sensor", "ESP32", "precision agriculture", "AWS IoT", "Flutter", "mobile app"],
    citations: 5,
    views: 823,
    fileUrl: null,
    status: "published",
    thumb: "scatter"
  },
  {
    id: "CMRJ_005_2025",
    title: "Nano-Curcumin Formulation Enhances Chemosensitivity in Triple-Negative Breast Cancer via PI3K/Akt/mTOR Pathway Inhibition",
    authors: "Dr. Vandana Iyer, Dr. R. Krishnaswamy, Dr. T. Bhattacharya, Prof. S. K. Nair",
    institution: "TATA Memorial Hospital Mumbai; CSIR-NCL Pune; ACTREC Mumbai",
    type: "Original Article",
    category: "science",
    categoryLabel: "Natural Sciences",
    doi: "10.29847/CMRJ_005_2025",
    volume: "Vol. 7, No. 3",
    year: 2025,
    date: "September 2025",
    abstract: "Triple-negative breast cancer (TNBC) lacks targetable hormone and HER2 receptors, limiting therapeutic options and leading to poor prognosis. Curcumin has demonstrated anti-tumour properties but has low bioavailability. We developed a poly-lactic-co-glycolic acid (PLGA) nano-encapsulated curcumin formulation and evaluated its efficacy in TNBC. Nanoparticle characterisation showed mean particle size of 142±18 nm, encapsulation efficiency of 87.3%, and sustained release over 72 hours. In vitro cytotoxicity assays in MDA-MB-231 and BT-549 cell lines demonstrated IC50 reduction of 6.4-fold compared to free curcumin. Flow cytometry confirmed enhanced G2/M arrest and apoptosis. Western blot analysis showed significant downregulation of p-Akt, p-mTOR, and p-S6K1 expression. In vivo xenograft models demonstrated 73% tumour volume reduction versus 41% for free curcumin (p<0.001). The nano-formulation significantly enhances curcumin's chemosensitising potential in TNBC via PI3K/Akt/mTOR pathway suppression.",
    keywords: ["nano-curcumin", "PLGA nanoparticles", "triple-negative breast cancer", "PI3K/Akt/mTOR", "chemosensitivity", "drug delivery", "apoptosis"],
    citations: 9,
    views: 756,
    fileUrl: null,
    status: "published",
    thumb: "line"
  }
];

// Stats shown on homepage
const CLINOVA_STATS = {
  totalArticles: 248,
  totalAuthors: 1430,
  disciplines: 3,
  citeScore: 0.9,
  estYear: 2019,
  avgReview: "18 days",
  countries: 40
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
