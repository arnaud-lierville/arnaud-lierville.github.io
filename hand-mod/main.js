'use strict';

const MAX_SPRITES = 20;
const SPREAD      = 160;   // dispersion aléatoire (px)
const LIFT        = 14;    // élévation en lévitation (px)
const SPRITE_W    = 130;   // largeur du sprite
const STORAGE_KEY = 'hand-mod-sprites';
const FADE_OUT_MS = 280;

let sprites = [];
// sprite : { id, el, x, y, rotation, flipped, state }

/* ─── Transform ──────────────────────────────────────────────── */

function setTransform(sprite) {
  const dy = sprite.state === 'levitating' ? -LIFT : 0;
  const sx = sprite.flipped ? -1 : 1;
  sprite.el.style.transform =
    `translate(${sprite.x}px, ${sprite.y + dy}px) rotate(${sprite.rotation}deg) scaleX(${sx})`;
}

/* ─── Utilitaires ────────────────────────────────────────────── */

function getLevitating() {
  return sprites.find(s => s.state === 'levitating') ?? null;
}

function syncSecondaryMenu() {
  document.getElementById('menu-secondaire')
    .classList.toggle('hidden', getLevitating() === null);
}

/* ─── Persistance ────────────────────────────────────────────── */

function saveState() {
  const data = sprites.map(s => ({ x: s.x, y: s.y, rotation: s.rotation, flipped: s.flipped }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    data.forEach(d => addHand({ ...d, _fromStorage: true }));
  } catch (e) { /* état corrompu — on ignore */ }
}

/* ─── Création ───────────────────────────────────────────────── */

function addHand(opts = {}) {
  if (sprites.length >= MAX_SPRITES) return;

  const scene = document.getElementById('scene');
  const cx = scene.clientWidth  / 2 - SPRITE_W / 2;
  const cy = scene.clientHeight / 2 - 40;
  const x  = opts.x  ?? cx + (Math.random() - 0.5) * SPREAD * 2;
  const y  = opts.y  ?? cy + (Math.random() - 0.5) * SPREAD * 2;

  const el = document.createElement('div');
  el.className = 'hand-sprite';

  const img = document.createElement('img');
  img.src = 'img/hand.png';
  img.alt = 'Main';
  img.draggable = false;
  el.appendChild(img);

  const sprite = {
    id: crypto.randomUUID(),
    el, x,
    y: y + 20,   // décalé vers le bas pour l'animation d'entrée
    rotation: opts.rotation ?? 0,
    flipped:  opts.flipped  ?? false,
    state: 'dropped',
  };
  sprites.push(sprite);

  // Positionner sans transition, puis animer vers la position réelle
  el.style.transition = 'none';
  el.style.opacity = '0';
  setTransform(sprite);
  scene.appendChild(el);

  el.getBoundingClientRect(); // force reflow

  el.style.transition = '';
  sprite.y = y;
  setTransform(sprite);
  el.style.opacity = '1';

  setupInteract(sprite);

  if (!opts._fromStorage) saveState();
}

/* ─── Interact.js : drag ─────────────────────────────────────── */

function setupInteract(sprite) {
  let dragged            = false;
  let totalDist          = 0;
  let dragStartedOnDropped = false;

  interact(sprite.el).draggable({
    listeners: {
      start() {
        dragged   = false;
        totalDist = 0;
        dragStartedOnDropped = sprite.state === 'dropped';

        if (dragStartedOnDropped) {
          // Lever immédiatement sans passer par toggleSprite
          sprites.forEach(s => {
            s.state = 'dropped';
            s.el.classList.remove('levitating');
            setTransform(s);
          });
          sprite.state = 'levitating';
          sprite.el.classList.add('levitating');
          setTransform(sprite);
          document.getElementById('menu-secondaire').classList.add('hidden');
        }

        sprite.el.classList.add('dragging');
      },
      move(e) {
        if (sprite.state !== 'levitating') return;
        totalDist += Math.abs(e.dx) + Math.abs(e.dy);
        if (totalDist > 5) dragged = true;
        sprite.x += e.dx;
        sprite.y += e.dy;
        setTransform(sprite);
      },
      end() {
        sprite.el.classList.remove('dragging');

        if (dragStartedOnDropped) {
          // Drag éphémère : reposer automatiquement
          sprite.state = 'dropped';
          sprite.el.classList.remove('levitating');
          setTransform(sprite);
          syncSecondaryMenu();
          dragStartedOnDropped = false;
        }

        saveState();
      },
    },
  });

  sprite.el.addEventListener('click', e => {
    e.stopPropagation();
    if (dragged) { dragged = false; return; }
    toggleSprite(sprite);
  });
}

/* ─── Interactions sprite ────────────────────────────────────── */

function toggleSprite(target) {
  const wasLevitating = target.state === 'levitating';

  sprites.forEach(s => {
    s.state = 'dropped';
    s.el.classList.remove('levitating');
    setTransform(s);
  });

  if (!wasLevitating) {
    target.state = 'levitating';
    target.el.classList.add('levitating');
    setTransform(target);
  }

  syncSecondaryMenu();
}

function dropAll() {
  sprites.forEach(s => {
    s.state = 'dropped';
    s.el.classList.remove('levitating');
    setTransform(s);
  });
  syncSecondaryMenu();
}

function clearAll() {
  const toRemove = [...sprites];
  toRemove.forEach(s => {
    interact(s.el).unset();
    s.el.style.transition = `transform ${FADE_OUT_MS}ms ease, opacity ${FADE_OUT_MS}ms ease`;
    s.el.style.opacity = '0';
    const dy = s.state === 'levitating' ? -LIFT : 0;
    const sx = s.flipped ? -1 : 1;
    s.el.style.transform =
      `translate(${s.x}px, ${s.y + dy + 20}px) rotate(${s.rotation}deg) scaleX(${sx})`;
  });
  sprites = [];
  syncSecondaryMenu();
  saveState();
  setTimeout(() => toRemove.forEach(s => s.el.remove()), FADE_OUT_MS + 50);
}

/* ─── Menu secondaire ────────────────────────────────────────── */

function rotateActive(sens) {
  const s = getLevitating();
  if (!s) return;
  s.rotation += sens === 'cw' ? 30 : -30;
  setTransform(s);
  saveState();
}

function flipActive() {
  const s = getLevitating();
  if (!s) return;

  const DURATION = 350;
  const start    = performance.now();
  let stateSwapped = false;

  // Suspend la transition CSS pendant l'animation manuelle
  s.el.style.transition = 'filter 0.25s ease, opacity 0.3s ease';

  function frame(now) {
    const t = Math.min((now - start) / DURATION, 1);

    let rotY;
    if (t < 0.5) {
      rotY = t * 2 * 90;                    // phase 1 : 0° → 90°
    } else {
      if (!stateSwapped) {
        s.rotation = -s.rotation;           // réflexion de l'angle
        s.flipped  = !s.flipped;            // inverse la chiralité
        stateSwapped = true;
      }
      rotY = -(1 - (t - 0.5) * 2) * 90;   // phase 2 : −90° → 0°
    }

    const dy = s.state === 'levitating' ? -LIFT : 0;
    const sx = s.flipped ? -1 : 1;
    s.el.style.transform =
      `translate(${s.x}px, ${s.y + dy}px) rotate(${s.rotation}deg) scaleX(${sx}) rotateY(${rotY}deg)`;

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      s.el.style.transition = '';  // restaure les transitions
      setTransform(s);             // nettoie le rotateY résiduel
      saveState();
    }
  }

  requestAnimationFrame(frame);
}

function deleteActive() {
  const s = getLevitating();
  if (!s) return;
  interact(s.el).unset();
  sprites = sprites.filter(sp => sp !== s);
  syncSecondaryMenu();
  saveState();

  // Fade-out + légère descente avant suppression DOM
  s.el.style.transition = `transform ${FADE_OUT_MS}ms ease, opacity ${FADE_OUT_MS}ms ease`;
  s.el.style.opacity = '0';
  const sx = s.flipped ? -1 : 1;
  s.el.style.transform =
    `translate(${s.x}px, ${s.y - LIFT + 20}px) rotate(${s.rotation}deg) scaleX(${sx})`;
  setTimeout(() => s.el.remove(), FADE_OUT_MS + 50);
}

function moveActive(dx, dy) {
  const s = getLevitating();
  if (!s) return;
  s.x += dx;
  s.y += dy;
  setTransform(s);
  saveState();
}

/* ─── Rotation de la scène ───────────────────────────────────── */

function rotateScene() {
  const scene = document.getElementById('scene');
  const cx = scene.clientWidth  / 2;
  const cy = scene.clientHeight / 2;

  sprites.forEach(s => {
    const dx = s.x - cx;
    const dy = s.y - cy;
    // Rotation −90° : x' = cx + dy,  y' = cy − dx
    s.x = cx + dy;
    s.y = cy - dx;
    s.rotation -= 90;
    setTransform(s);
  });

  saveState();
}

/* ─── Scène : clic sur le fond / pan ────────────────────────── */

{
  const scene = document.getElementById('scene');
  let panDist = 0;

  // Clic simple sur le fond → déposer toutes les mains
  scene.addEventListener('click', dropAll);

  // Drag sur le fond → pan (ignorer les sprites)
  interact(scene).draggable({
    ignoreFrom: '.hand-sprite',
    listeners: {
      start() {
        panDist = 0;
        scene.classList.add('panning');
      },
      move(e) {
        panDist += Math.abs(e.dx) + Math.abs(e.dy);
        if (panDist > 5) {
          sprites.forEach(s => {
            s.x += e.dx;
            s.y += e.dy;
            setTransform(s);
          });
        }
      },
      end() {
        scene.classList.remove('panning');
        if (panDist > 5) saveState();
      },
    },
  });
}

/* ─── Menu principal ─────────────────────────────────────────── */

document.getElementById('btn-ajouter').addEventListener('click', () => addHand());
document.getElementById('btn-rotation-scene').addEventListener('click', rotateScene);
document.getElementById('btn-effacer').addEventListener('click', clearAll);

/* ─── Menu secondaire ────────────────────────────────────────── */

document.getElementById('btn-rotation-ccw').addEventListener('click', () => rotateActive('ccw'));
document.getElementById('btn-rotation-cw').addEventListener('click',  () => rotateActive('cw'));
document.getElementById('btn-retournement').addEventListener('click', flipActive);
document.getElementById('btn-supprimer').addEventListener('click', deleteActive);

/* ─── Modal d'aide ───────────────────────────────────────────── */

const modalAide = document.getElementById('modal-aide');
const openAide  = () => modalAide.classList.remove('hidden');
const closeAide = () => modalAide.classList.add('hidden');

document.getElementById('btn-aide').addEventListener('click', openAide);
document.getElementById('btn-fermer-modal').addEventListener('click', closeAide);
document.getElementById('modal-fond').addEventListener('click', closeAide);

/* ─── Clavier ────────────────────────────────────────────────── */

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  const PAS      = 10;
  const PAS_VITE = 50;

  switch (e.key) {
    case 'h': case 'H':
      e.preventDefault(); addHand(); break;

    case 'q': case 'Q':
      e.preventDefault(); rotateScene(); break;

    case 'Delete': case 'Backspace':
      e.preventDefault(); clearAll(); break;

    case '?':
      e.preventDefault();
      modalAide.classList.contains('hidden') ? openAide() : closeAide();
      break;

    case 'Escape':
      e.preventDefault(); dropAll(); closeAide(); break;

    case 'r': case 'R':
      e.preventDefault();
      rotateActive(e.shiftKey ? 'cw' : 'ccw');
      break;

    case 'f': case 'F':
      e.preventDefault(); flipActive(); break;

    case 'x': case 'X':
      e.preventDefault(); deleteActive(); break;

    case 'ArrowUp':
      e.preventDefault(); moveActive(0, -(e.shiftKey ? PAS_VITE : PAS)); break;

    case 'ArrowDown':
      e.preventDefault(); moveActive(0, e.shiftKey ? PAS_VITE : PAS); break;

    case 'ArrowLeft':
      e.preventDefault(); moveActive(-(e.shiftKey ? PAS_VITE : PAS), 0); break;

    case 'ArrowRight':
      e.preventDefault(); moveActive(e.shiftKey ? PAS_VITE : PAS, 0); break;
  }
});

/* ─── Chargement ─────────────────────────────────────────────── */

loadState();
