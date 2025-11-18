document.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById('startBtn');
  const reveal = document.getElementById('reveal');
  const card = document.getElementById('card');

  // Clic sur "Lancer la vérification"
  start.addEventListener('click', () => {
    start.disabled = true;
    start.textContent = "Vérification en cours…";

    // Simuler la vérification
    setTimeout(() => {
      reveal.classList.add('show');   // afficher le prank
      start.textContent = "Lancer la vérification";
      start.disabled = false;
      spawnConfetti(40);              // lancer les confettis

      // Après quelques secondes, ouvrir la "page finale"
      setTimeout(() => {
        openFakePage();
      }, 1500); // décalage après l'apparition du prank
    }, 3000);
  });
});

// Confettis
function spawnConfetti(n) {
  const colors = ['#ff5c8a','#ffd166','#7ae582','#7cc7ff','#b399ff'];
  const card = document.getElementById('card');

  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (10 + Math.random() * 80) + '%';
    el.style.top = (Math.random() * 30) + '%';
    el.style.background = colors[i % colors.length];
    el.style.transform = `translateY(-40px) rotate(${Math.random()*360}deg)`;
    el.style.animationDelay = (Math.random() * 800) + 'ms';
    el.style.width = (6 + Math.random()*12) + 'px';
    el.style.height = (8 + Math.random()*16) + 'px';
    card.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
}

// Bouton "Partager"
function share() {
  const text = "Je viens de me faire avoir par un petit prank 😈 (tkt, c'était drôle)";
  if (navigator.share) {
    navigator.share({ text }).catch(() => alert("Impossible de partager."));
  } else {
    navigator.clipboard.writeText(text).then(() => alert("Texte copié !"));
  }
}

// Bouton "Retourner" pour fermer le prank
function closePrank() {
  const reveal = document.getElementById('reveal');
  reveal.classList.remove('show');
}

// --- Page finale avec bouton insaisissable ---
function openFakePage() {
  const overlay = document.createElement('div');
  overlay.id = "fakePage";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "#071029";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.color = "#fff";
  overlay.style.zIndex = 9999;

  const title = document.createElement('h1');
  title.textContent = "Vérification finale…";
  overlay.appendChild(title);

  const btn = document.createElement('button');
  btn.textContent = "Retour";
  btn.style.padding = "12px 24px";
  btn.style.borderRadius = "12px";
  btn.style.cursor = "pointer";
  btn.style.position = "absolute";
  btn.style.top = "50%";
  btn.style.left = "50%";
  overlay.appendChild(btn);

  document.body.appendChild(overlay);

  // Bouton insaisissable
  btn.addEventListener("mouseenter", () => {
    const maxX = window.innerWidth - btn.offsetWidth;
    const maxY = window.innerHeight - btn.offsetHeight;
    btn.style.left = Math.random() * maxX + "px";
    btn.style.top = Math.random() * maxY + "px";
  });
}
