document.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById('startBtn');
  const reveal = document.getElementById('reveal');
  const card = document.getElementById('card');

  start.addEventListener('click', () => {
    start.disabled = true;
    start.textContent = "Vérification en cours…";

    setTimeout(() => {
      reveal.classList.add('show');   // afficher le prank
      start.textContent = "Lancer la vérification";
      start.disabled = false;
      spawnConfetti(40);              // lancer les confettis

      const originalBtn = reveal.querySelector(".white-btn");
      makeButtonUncatchable(originalBtn, reveal);

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

// Partage
function share() {
  const text = "Je viens de me faire avoir par un petit prank 😈 (tkt, c'était drôle)";
  if (navigator.share) {
    navigator.share({ text }).catch(() => alert("Impossible de partager."));
  } else {
    navigator.clipboard.writeText(text).then(() => alert("Texte copié !"));
  }
}

// Retour prank (optionnel si on clique vraiment)
function closePrank() {
  const reveal = document.getElementById('reveal');
  reveal.classList.remove('show');
}

// Bouton insaisissable sans casser la page
function makeButtonUncatchable(originalBtn, container) {
  // Cloner le bouton pour pouvoir le bouger librement
  const clone = originalBtn.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.top = originalBtn.offsetTop + "px";
  clone.style.left = originalBtn.offsetLeft + "px";
  clone.style.margin = "0";
  clone.style.zIndex = "1000";
  originalBtn.parentElement.appendChild(clone);

  originalBtn.style.visibility = "hidden";

  clone.addEventListener("mouseenter", () => {
    const maxX = container.clientWidth - clone.offsetWidth;
    const maxY = container.clientHeight - clone.offsetHeight;
    clone.style.left = Math.random() * maxX + "px";
    clone.style.top = Math.random() * maxY + "px";
  });

  clone.addEventListener("click", () => {
    alert("Tu as réussi à cliquer !");
    container.classList.remove("show");
  });
}
