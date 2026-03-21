// ============================================================
// STATE
// ============================================================
let selectedTables = [];
let selectedLevel = 1;
let calculs = [];
let currentSlide = 0;
let serieCode = '';     // code 4 chiffres affiché
let serieBase64 = '';  // données complètes (pour le footer PDF)
let selectedLevels = [];
let slideTimer = null;

console.log('%c Multiplication Trainer v1.0 ', 'background:#4f46e5;color:#fff;padding:4px 8px;border-radius:4px;font-weight:700;');

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('tables-grid');
  for (let i = 2; i <= 13; i++) {
    const btn = document.createElement('button');
    btn.id = `table-${i}`;
    btn.className = 'table-btn border-2 border-gray-200 rounded-xl py-2 font-black text-gray-600 hover:border-indigo-400 transition text-sm';
    btn.textContent = i;
    btn.onclick = () => toggleTable(i);
    grid.appendChild(btn);
  }

  document.addEventListener('keydown', e => {
    const proj = document.getElementById('projection-mode');
    if (proj.style.display === 'flex') {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); nextSlide(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prevSlide(); }
      if (e.key === 'Escape') exitProjection();
    }
  });
});

// ============================================================
// TABLE SELECTION
// ============================================================
function toggleTable(n) {
  const idx = selectedTables.indexOf(n);
  const btn = document.getElementById(`table-${n}`);
  if (idx === -1) {
    selectedTables.push(n);
    btn.classList.add('selected');
  } else {
    selectedTables.splice(idx, 1);
    btn.classList.remove('selected');
  }
  updateAllBtn();
}

function toggleAll() {
  const allSelected = selectedTables.length === 12;
  selectedTables = [];
  for (let i = 2; i <= 13; i++) {
    document.getElementById(`table-${i}`).classList.remove('selected');
  }
  if (!allSelected) {
    for (let i = 2; i <= 13; i++) {
      selectedTables.push(i);
      document.getElementById(`table-${i}`).classList.add('selected');
    }
  }
  updateAllBtn();
}

function updateAllBtn() {
  const btn = document.getElementById('btn-all');
  btn.textContent = selectedTables.length === 12 ? 'Tout désélectionner' : 'Tout sélectionner';
}

// ============================================================
// LEVEL SELECTION
// ============================================================
function toggleLevel(l) {
  const idx = selectedLevels.indexOf(l);
  const btn = document.getElementById(`level-${l}`);
  if (idx === -1) {
    selectedLevels.push(l);
    btn.classList.add('selected');
  } else {
    selectedLevels.splice(idx, 1);
    btn.classList.remove('selected');
  }
}

// ============================================================
// GÉNÉRATION
// ============================================================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCalculs(tables, nb, levels) {
  const list = [];
  for (let i = 0; i < nb; i++) {
    const table = tables[rand(0, tables.length - 1)];
    const other = rand(1, Math.max(10, table));
    const [a, b] = [table, other];
    const result = a * b;
    const level = levels[rand(0, levels.length - 1)];
    let hidden;
    if (level === 1) {
      hidden = 'result';
    } else if (level === 2) {
      hidden = Math.random() < 0.5 ? 'a' : 'b';
    } else {
      hidden = 'both';
    }
    list.push({ a, b, result, hidden });
  }
  return list;
}

function encodeSession(tables, nb, levels, calculs) {
  const data = { tables, nb, levels, calculs };
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function decodeSession(base64) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  } catch (e) {
    return null;
  }
}

// Génère un code 4 chiffres unique, stocke le base64 dans localStorage, retourne le code.
function saveSerieToLocalStorage(base64) {
  let code, attempts = 0;
  do {
    code = String(Math.floor(Math.random() * 9000) + 1000);
    attempts++;
  } while (localStorage.getItem('serie_' + code) && attempts < 50);
  localStorage.setItem('serie_' + code, base64);
  return code;
}

// ============================================================
// START
// ============================================================
function startSession() {
  const errEl = document.getElementById('params-error');
  errEl.classList.add('hidden');

  if (selectedTables.length === 0) {
    errEl.textContent = 'Sélectionne au moins une table.';
    errEl.classList.remove('hidden');
    return;
  }
  if (selectedLevels.length === 0) {
    errEl.textContent = 'Sélectionne au moins un niveau.';
    errEl.classList.remove('hidden');
    return;
  }
  const nb = parseInt(document.getElementById('nb-calculs').value);
  if (!nb || nb < 1) {
    errEl.textContent = 'Nombre de calculs invalide.';
    errEl.classList.remove('hidden');
    return;
  }

  const tables = [...selectedTables].sort((a, b) => a - b);
  const levels = [...selectedLevels].sort();
  calculs = generateCalculs(tables, nb, levels);
  serieBase64 = encodeSession(tables, nb, levels, calculs);
  serieCode = saveSerieToLocalStorage(serieBase64);
  renderDashboard(tables, nb, levels);
}

function importCode() {
  const input = document.getElementById('import-code').value.trim();
  const errEl = document.getElementById('import-error');

  if (!/^\d{4}$/.test(input)) {
    errEl.textContent = 'Entrez un code à 4 chiffres.';
    errEl.classList.remove('hidden');
    return;
  }

  const stored = localStorage.getItem('serie_' + input);
  if (!stored) {
    errEl.textContent = 'Code introuvable sur cet appareil. Ce code n\'est valide que sur la machine où la série a été créée.';
    errEl.classList.remove('hidden');
    return;
  }

  const data = decodeSession(stored);
  if (!data || !data.calculs) {
    errEl.textContent = 'Données corrompues pour ce code.';
    errEl.classList.remove('hidden');
    return;
  }
  errEl.classList.add('hidden');

  selectedTables = data.tables;
  selectedLevels = data.levels || [data.level];
  calculs = data.calculs;
  serieCode = input;
  serieBase64 = stored;

  for (let i = 2; i <= 13; i++) {
    const btn = document.getElementById(`table-${i}`);
    if (selectedTables.includes(i)) btn.classList.add('selected');
    else btn.classList.remove('selected');
  }
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`level-${i}`);
    if (selectedLevels.includes(i)) btn.classList.add('selected');
    else btn.classList.remove('selected');
  }
  document.getElementById('nb-calculs').value = data.nb;

  renderDashboard(data.tables, data.nb, selectedLevels);
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard(tables, nb, levels) {
  document.getElementById('page-params').classList.add('hidden');
  document.getElementById('page-correction').classList.add('hidden');
  document.getElementById('page-dashboard').classList.remove('hidden');

  document.getElementById('serie-code').textContent = serieCode;
  document.getElementById('info-tables').textContent = tables.join(', ');
  document.getElementById('info-nb').textContent = nb;
  document.getElementById('info-level').textContent = levels.map(l => `L${l}`).join(' + ');

  const apercu = document.getElementById('apercu-list');
  apercu.innerHTML = '';
  calculs.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'bg-indigo-50 rounded-xl py-2 px-3 text-center font-bold text-indigo-800 text-sm';
    el.textContent = formatCalcul(c, false);
    apercu.appendChild(el);
  });
}

function toggleCard(id) {
  const body = document.getElementById('card-' + id);
  const arrow = document.getElementById('toggle-' + id);
  const hidden = body.classList.toggle('hidden');
  arrow.textContent = hidden ? '▼' : '▲';
}

function showDashboard() {
  document.getElementById('page-correction').classList.add('hidden');
  document.getElementById('page-dashboard').classList.remove('hidden');
}

function goBack() {
  document.getElementById('page-dashboard').classList.add('hidden');
  document.getElementById('page-params').classList.remove('hidden');
}

// ============================================================
// FORMAT CALCUL
// ============================================================
function formatCalcul(c, showAnswer) {
  if (c.hidden === 'result') return `${c.a} × ${c.b} = ${showAnswer ? c.result : '?'}`;
  if (c.hidden === 'a') return `? × ${c.b} = ${c.result}`;
  if (c.hidden === 'b') return `${c.a} × ? = ${c.result}`;
  return `? × ? = ${c.result}`;
}

const SLOT_W = '1.5em';
const slotQ    = `<span style="display:inline-block;min-width:${SLOT_W};text-align:center;">?</span>`;
const slotDots = `<span style="display:inline-block;min-width:${SLOT_W};text-align:center;position:relative;top:0.18em;">.....</span>`;

function formatCalculSlide(c) {
  const q = slotQ;
  if (c.hidden === 'result') return `${c.a} × ${c.b} = ${q}`;
  if (c.hidden === 'a') return `${q} × ${c.b} = ${c.result}`;
  if (c.hidden === 'b') return `${c.a} × ${q} = ${c.result}`;
  return `${q} × ${q} = ${c.result}`;
}

function getAnswer(c) {
  if (c.hidden === 'result') return c.result;
  if (c.hidden === 'a') return c.a;
  if (c.hidden === 'b') return c.b;
  return `${c.a} × ${c.b}`;
}

// Remplace les "?" par "....." (pour PDF et slide révélée)
function formatCalculDots(c) {
  if (c.hidden === 'result') return `${c.a} × ${c.b} = .....`;
  if (c.hidden === 'a') return `..... × ${c.b} = ${c.result}`;
  if (c.hidden === 'b') return `${c.a} × ..... = ${c.result}`;
  return `..... × ..... = ${c.result}`;
}

function formatCalculDotsHTML(c) {
  const d = slotDots;
  if (c.hidden === 'result') return `${c.a} × ${c.b} = ${d}`;
  if (c.hidden === 'a') return `${d} × ${c.b} = ${c.result}`;
  if (c.hidden === 'b') return `${c.a} × ${d} = ${c.result}`;
  return `${d} × ${d} = ${c.result}`;
}

// Remplace les "?" par la réponse en rouge (HTML) pour la correction
function formatCalculCorrectionHTML(c) {
  const r = `<span style="color:#ef4444;font-weight:900;">${getAnswer(c)}</span>`;
  if (c.hidden === 'result') return `${c.a} × ${c.b} = ${r}`;
  if (c.hidden === 'a') return `${r} × ${c.b} = ${c.result}`;
  if (c.hidden === 'b') return `${c.a} × ${r} = ${c.result}`;
  const ra = `<span style="color:#ef4444;font-weight:900;">${c.a}</span>`;
  const rb = `<span style="color:#ef4444;font-weight:900;">${c.b}</span>`;
  return `${ra} × ${rb} = ${c.result}`;
}

// ============================================================
// COPY
// ============================================================
function copyCode() {
  navigator.clipboard.writeText(serieCode).then(() => {
    const btn = document.getElementById('btn-copy');
    btn.textContent = '✓ Copié !';
    btn.classList.add('bg-green-100', 'text-green-700');
    setTimeout(() => {
      btn.textContent = 'Copier';
      btn.classList.remove('bg-green-100', 'text-green-700');
    }, 2000);
  });
}

// ============================================================
// PROJECTION
// ============================================================
function startProjection() {
  currentSlide = 0;
  document.getElementById('projection-mode').style.display = 'flex';
  renderSlide();
}

function renderSlide() {
  if (slideTimer) { clearTimeout(slideTimer); slideTimer = null; }
  const c = calculs[currentSlide];
  const el = document.getElementById('slide-calcul');
  el.classList.remove('slide-enter');
  void el.offsetWidth;
  el.classList.add('slide-enter');
  el.innerHTML = formatCalculSlide(c);
  document.getElementById('slide-number').textContent = '';
  document.getElementById('slide-counter').textContent = `${currentSlide + 1} / ${calculs.length}`;
  slideTimer = setTimeout(() => {
    el.innerHTML = formatCalculDotsHTML(c);
    slideTimer = null;
  }, 2000);
}

function nextSlide() {
  if (currentSlide < calculs.length - 1) { currentSlide++; renderSlide(); }
}

function prevSlide() {
  if (currentSlide > 0) { currentSlide--; renderSlide(); }
}

function exitProjection() {
  document.getElementById('projection-mode').style.display = 'none';
}

// ============================================================
// CORRECTION
// ============================================================

// Retourne toutes les décompositions non triviales de n (a × b, a ≤ b, a ≥ 2)
function getDecompositions(n) {
  const pairs = [];
  for (let a = 2; a <= Math.sqrt(n); a++) {
    if (n % a === 0) pairs.push([a, n / a]);
  }
  return pairs;
}

function toggleDecomp(uid) {
  const panel = document.getElementById(uid);
  const btn = document.getElementById('btn-' + uid);
  const isHidden = panel.classList.toggle('hidden');
  btn.textContent = isHidden ? '▼' : '▲';
}

function showCorrection() {
  document.getElementById('page-dashboard').classList.add('hidden');
  document.getElementById('page-correction').classList.remove('hidden');

  const list = document.getElementById('correction-list');
  list.innerHTML = '';
  calculs.forEach((c) => {
    const el = document.createElement('div');
    el.className = 'calcul-card bg-white rounded-2xl p-6 shadow text-center';

    if (c.hidden === 'both') {
      const decomps = getDecompositions(c.result);
      if (decomps.length <= 1) {
        // Une seule solution : carte simple
        const ra = `<span style="color:#ef4444;font-weight:900;">${c.a}</span>`;
        const rb = `<span style="color:#ef4444;font-weight:900;">${c.b}</span>`;
        el.innerHTML = `<div class="font-black text-gray-700 text-2xl">${ra} × ${rb} = ${c.result}</div>`;
      } else {
        // Plusieurs solutions : première + badge ▼ pour étendre
        const [first, ...rest] = decomps;
        const restLignes = rest.map(([a, b]) =>
          `<div class="text-xl font-black" style="color:#ef4444;">${a} × ${b} = ${c.result}</div>`
        ).join('');
        const uid = 'decomp-' + Math.random().toString(36).slice(2);
        el.innerHTML = `
          <div class="flex items-center justify-center gap-3">
            <div class="font-black text-2xl" style="color:#ef4444;">${first[0]} × ${first[1]} = ${c.result}</div>
            <button onclick="toggleDecomp('${uid}')" class="text-green-500 hover:text-green-700 transition text-sm leading-none" id="btn-${uid}">▼</button>
          </div>
          <div id="${uid}" class="hidden border-t border-gray-100 mt-3 pt-3 flex flex-col gap-1">${restLignes}</div>
        `;
      }
    } else {
      el.innerHTML = `<div class="font-black text-gray-700 text-2xl">${formatCalculCorrectionHTML(c)}</div>`;
    }

    list.appendChild(el);
  });
}

// ============================================================
// PDF
// ============================================================
function generatePDF() {
  // Grille de calculs
  const grid = document.getElementById('pdf-grid');
  grid.innerHTML = '';
  calculs.forEach(function(c) {
    const cell = document.createElement('div');
    cell.style.cssText = 'padding:10px 6px;';
    const q = document.createElement('span');
    q.style.cssText = 'font-size:20px;font-weight:800;';
    const pdfDots = `<span style="position:relative;top:0.18em;">.....</span>`;
    const pdfDotsHTML = (txt) => txt.replace(/\.\.\.\.\./g, pdfDots);
    q.innerHTML = pdfDotsHTML(formatCalculDots(c));
    cell.appendChild(q);
    grid.appendChild(cell);
  });

  // Code header discret
  document.getElementById('pdf-code-header').textContent = serieCode;
  document.getElementById('pdf-score-label').textContent = '.....' + ' / ' + calculs.length;

  const container = document.getElementById('pdf-container');
  container.classList.remove('hidden');

  const opt = {
    margin: [12, 12, 12, 12],
    filename: 'tables-' + serieCode + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(container).save().then(function() {
    container.classList.add('hidden');
  });
}
