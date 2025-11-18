// script.js

// S'assurer que le DOM est chargé avant d'exécuter le JS
document.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById('startBtn');
  const reveal = document.getElementById('reveal');
  const card = document.getElementById('card');

  // Clic sur "Lancer la vérification"
  start.addEventListener('click', () => {
    start.disabled = true;
    start.textContent = "Vérification en cours…";

    // Simuler une vérification de 3 secondes
    setTimeout(() => {
      reveal.classList.add('show');   // afficher le prank
      start.textContent = "Lancer la vérification";
      start.disabled = false;
      spawnConfetti(40);              // lancer les confettis
    }, 3000);
  });
});

// Fonction pour créer les confettis
function spawnConfetti(n) {
  const colors = ['#ff5c8a','#ffd166','#7ae582','#7cc7ff','#b399ff'];

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

    // Supprimer le confetti après l'animation
    setTimeout(() => el.remove(), 2200);
  }
}

// Bouton "Partager" dans le prank
function share() {
  const text = "Je viens de me faire avoir par un petit prank 😈 (tkt, c'était drôle)";
  if (navigator.share) {
    navigator.share({ text })
      .catch(() => alert("Impossible de partager."));
  } else {
    navigator.clipboard.writeText(text)
      .then(() => alert("Texte copié !"));
  }
}

// Bouton "Retourner" pour fermer le prank
function closePrank() {
  const reveal = document.getElementById('reveal');
  reveal.classList.remove('show');
}
