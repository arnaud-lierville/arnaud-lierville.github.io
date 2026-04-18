const PALETTE = [
  '#FF3366', '#FF6B00', '#FFD700', '#39FF14', '#00FFFF',
  '#7B2FFF', '#FF1493', '#00FF7F', '#FF4500', '#1E90FF',
];

const state = {
  n: 0,
  c: 5,
  colors: [],
  showSorted: false,
  showBars: false,
};

const $ = (id) => document.getElementById(id);
const sliderN    = $('slider-n');
const sliderC    = $('slider-c');
const n2Val      = $('n2-val');
const cVal       = $('c-val');
const toggleSorted = $('toggle-sorted');
const toggleBars   = $('toggle-bars');
const grid1 = $('grid1');
const grid2 = $('grid2');
const barsEl = $('bars');
const col2El = $('col2');
const col3El = $('col3');
const btnRelancer = $('btn-relancer');

let debounceTimer;

function cellSize(n) {
  if (n === 0) return 20;
  const max = Math.min(460, window.innerWidth * 0.38);
  return Math.max(4, Math.floor(max / n));
}

function barCellSize(n, maxCount) {
  // barH = maxCount * bCell + (maxCount - 1) gaps ≤ gridH
  // → bCell ≤ (gridH - maxCount + 1) / maxCount = floor((gridH + 1) / maxCount) - 1
  const gridH = n * cellSize(n) + (n - 1);
  const size = Math.floor((gridH + 1) / Math.max(maxCount, 1)) - 1;
  return Math.max(4, Math.min(18, size));
}

function generateColors(n, c) {
  return Array.from({ length: n * n }, () => Math.floor(Math.random() * c));
}

function spiralOrder(n) {
  const order = [];
  let top = 0, bottom = n - 1, left = 0, right = n - 1;
  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++)   order.push(top * n + col);
    top++;
    for (let row = top; row <= bottom; row++)   order.push(row * n + right);
    right--;
    if (top <= bottom) {
      for (let col = right; col >= left; col--) order.push(bottom * n + col);
      bottom--;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) order.push(row * n + left);
      left++;
    }
  }
  return order;
}

function staggerMs(total, budget = 600) {
  return Math.max(4, Math.min(40, Math.floor(budget / Math.max(total, 1))));
}

// ── Colonne 1 : grille aléatoire ─────────────────────────────────────────────

function buildGrid1() {
  grid1.innerHTML = '';
  const { n, colors } = state;

  if (n === 0) {
    grid1.innerHTML = '<p class="empty-msg">Déplacez le curseur n</p>';
    return Promise.resolve();
  }

  const cell = cellSize(n);
  grid1.style.gridTemplateColumns = `repeat(${n}, ${cell}px)`;

  for (const ci of colors) {
    const sq = document.createElement('div');
    sq.className = 'square';
    sq.style.cssText = `width:${cell}px;height:${cell}px;background:${PALETTE[ci]};opacity:0;transform:scale(0)`;
    grid1.appendChild(sq);
  }

  const spiral = spiralOrder(n);
  const posInSpiral = new Array(n * n);
  spiral.forEach((cellIdx, pos) => { posInSpiral[cellIdx] = pos; });
  const ms = staggerMs(n * n, 600);

  return new Promise(resolve => {
    anime({
      targets: grid1.querySelectorAll('.square'),
      opacity: [0, 1],
      scale: [0, 1],
      delay: (el, i) => posInSpiral[i] * ms,
      duration: 280,
      easing: 'easeOutCubic',
      complete: resolve,
    });
  });
}

// ── Colonne 2 : grille triée par couleur ──────────────────────────────────────

function buildGrid2(doFlip) {
  grid2.innerHTML = '';
  const { n, colors } = state;
  if (n === 0) return;

  const cell = cellSize(n);
  grid2.style.gridTemplateColumns = `repeat(${n}, ${cell}px)`;

  const sortedIndices = colors
    .map((color, i) => ({ color, i }))
    .sort((a, b) => a.color - b.color)
    .map((x) => x.i);

  for (const origIdx of sortedIndices) {
    const sq = document.createElement('div');
    sq.className = 'square';
    sq.style.cssText = `width:${cell}px;height:${cell}px;background:${PALETTE[colors[origIdx]]};opacity:0`;
    sq.dataset.origIdx = origIdx;
    grid2.appendChild(sq);
  }

  if (doFlip) {
    requestAnimationFrame(() => {
      const sq1 = [...grid1.querySelectorAll('.square')];
      const sq2 = [...grid2.querySelectorAll('.square')];
      const r1 = sq1.map((el) => el.getBoundingClientRect());
      const r2 = sq2.map((el) => el.getBoundingClientRect());

      anime({
        targets: sq2,
        translateX: (el, i) => {
          const orig = parseInt(el.dataset.origIdx);
          return [r1[orig].left - r2[i].left, 0];
        },
        translateY: (el, i) => {
          const orig = parseInt(el.dataset.origIdx);
          return [r1[orig].top - r2[i].top, 0];
        },
        opacity: [0, 1],
        delay: anime.stagger(staggerMs(n * n, 700)),
        duration: 420,
        easing: 'easeOutCubic',
      });
    });
  } else {
    anime({
      targets: grid2.querySelectorAll('.square'),
      opacity: [0, 1],
      scale: [0, 1],
      delay: anime.stagger(staggerMs(n * n, 400)),
      duration: 200,
      easing: 'easeOutCubic',
    });
  }
}

// ── Colonne 3 : histogramme de barres ────────────────────────────────────────

function buildBars() {
  barsEl.innerHTML = '';
  const { n, c, colors } = state;
  if (n === 0) return;

  const counts = Array(c).fill(0);
  for (const ci of colors) counts[ci]++;
  const maxCount = Math.max(...counts);
  const bCell = barCellSize(n, maxCount);
  const perSq = staggerMs(maxCount, 700);

  for (let ci = 0; ci < c; ci++) {
    const count = counts[ci];
    const group = document.createElement('div');
    group.className = 'bar-group';

    const stack = document.createElement('div');
    stack.className = 'bar-stack';

    for (let i = 0; i < count; i++) {
      const sq = document.createElement('div');
      sq.className = 'bar-square';
      sq.style.cssText = `width:${bCell}px;height:${bCell}px;background:${PALETTE[ci]};opacity:0`;
      stack.appendChild(sq);
    }

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = count;

    group.appendChild(stack);
    group.appendChild(label);
    barsEl.appendChild(group);
  }

  // Toutes les barres se remplissent simultanément, de bas en haut
  barsEl.querySelectorAll('.bar-group').forEach((group) => {
    const squares = group.querySelectorAll('.bar-square');
    if (squares.length === 0) return;
    anime({
      targets: squares,
      opacity: [0, 1],
      scaleY: [0, 1],
      delay: anime.stagger(perSq),
      duration: 180,
      easing: 'easeOutQuad',
    });
  });
}

// ── Re-render global ─────────────────────────────────────────────────────────

async function render() {
  const { n, c } = state;
  state.colors = n > 0 ? generateColors(n, c) : [];

  grid2.innerHTML = '';
  barsEl.innerHTML = '';

  await buildGrid1();
  if (state.showSorted) buildGrid2(false);
  if (state.showBars)   buildBars();
}

// ── Événements ───────────────────────────────────────────────────────────────

sliderN.addEventListener('input', () => {
  state.n = +sliderN.value;
  n2Val.textContent = state.n ** 2;
  btnRelancer.disabled = state.n === 0;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(render, 80);
});

sliderC.addEventListener('input', () => {
  state.c = +sliderC.value;
  cVal.textContent = state.c;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(render, 80);
});

toggleSorted.addEventListener('change', () => {
  state.showSorted = toggleSorted.checked;
  if (state.showSorted) {
    col2El.classList.remove('hidden');
    if (state.n > 0) buildGrid2(true);
  } else {
    col2El.classList.add('hidden');
    grid2.innerHTML = '';
  }
});

toggleBars.addEventListener('change', () => {
  state.showBars = toggleBars.checked;
  if (state.showBars) {
    col3El.classList.remove('hidden');
    if (state.n > 0) buildBars();
  } else {
    col3El.classList.add('hidden');
    barsEl.innerHTML = '';
  }
});

btnRelancer.addEventListener('click', render);

// ── Init ─────────────────────────────────────────────────────────────────────

n2Val.textContent = '0';
cVal.textContent = state.c;
