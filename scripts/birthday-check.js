'use strict';

/*
 * Vérifie si quelqu'un fête son anniversaire aujourd'hui (heure de Paris)
 * et poste un message dans le salon Discord via le webhook.
 *
 * Usage :
 *   DISCORD_WEBHOOK=https://discord.com/api/webhooks/... node scripts/birthday-check.js
 *
 * Pour tester avec une date précise (format JJ/MM) :
 *   TEST_DATE=05/08 DISCORD_WEBHOOK=... node scripts/birthday-check.js
 */

const fs = require('fs');
const path = require('path');

/* ============================================================
 * RÉGLAGES — c'est ici qu'on personnalise le message
 * ============================================================ */
const CONFIG = {
  // Adresse de ton site GitHub Pages, SANS le / final.
  // Sert à afficher homme.jpg / femme.jpg en vignette dans le message.
  // Mets '' pour ne pas afficher de vignette.
  siteUrl: '',

  // Rend le titre cliquable vers ton site. '' pour désactiver.
  lienSite: '',

  // '@everyone', '@here', '<@&ID_DU_ROLE>' ou '' pour ne rien mentionner.
  mention: '',

  // Couleur de la barre latérale (jaune doré).
  couleur: 0xfee75c,
};

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;
if (!WEBHOOK_URL) {
  console.error('❌ La variable DISCORD_WEBHOOK est manquante.');
  console.error('   Sur GitHub : Settings → Secrets and variables → Actions → New repository secret');
  process.exit(1);
}

/* ---- Date du jour, fuseau Europe/Paris ---- */
function getTodayParis() {
  const override = process.env.TEST_DATE; // ex: "05/08"
  if (override) {
    const [d, m] = override.split('/').map(Number);
    if (!d || !m) {
      console.error('❌ TEST_DATE invalide, format attendu : JJ/MM (ex: 05/08)');
      process.exit(1);
    }
    console.log(`🧪 Mode test : date forcée au ${override}`);
    const y = new Date().getFullYear();
    return { day: d, month: m, year: y, hour: 0, weekday: new Date(y, m - 1, d).getDay() };
  }
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  const day = get('day');
  const month = get('month');
  const year = get('year');
  return { day, month, year, hour: get('hour'), weekday: new Date(year, month - 1, day).getDay() };
}

/* ---- Chargement de la liste ---- */
const dataPath = path.join(__dirname, '..', 'birthdays.json');
const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const today = getTodayParis();

/* ---- Garde-fou minuit ---- */
if (process.env.STRICT_MIDNIGHT === 'true' && !process.env.TEST_DATE && today.hour !== 0) {
  console.log(`⏭️  Il est ${today.hour}h à Paris (pas minuit) — ce run se retire, l'autre horaire prendra le relais.`);
  process.exit(0);
}

const celebrants = users.filter((u) => u.birthday.day === today.day && u.birthday.month === today.month);

if (celebrants.length === 0) {
  console.log(`✅ ${String(today.day).padStart(2, '0')}/${String(today.month).padStart(2, '0')} — aucun anniversaire aujourd'hui. Rien à envoyer.`);
  process.exit(0);
}

/* ============================================================
 * CONSTRUCTION DU MESSAGE
 * ============================================================ */
const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* Vœux tirés au sort : le message change d'une personne à l'autre
   et d'une année sur l'autre. Ajoute les tiens librement. */
const VOEUX = [
  "Que cette nouvelle année soit synonyme de sérénité, d'épanouissement et de réussites durables.",
  "Une pensée sincère en ce jour particulier. Que l'année à venir soit à la hauteur de tes aspirations.",
  "Santé, clarté d'esprit et beaux accomplissements pour ce nouveau chapitre.",
  "Un an de plus, et une belle assurance qui s'affirme. Que cette journée te soit douce.",
  "Que les mois à venir t'apportent la réussite dans tes projets et la quiétude au quotidien.",
  "À la célébration du chemin parcouru et aux belles perspectives qui s'ouvrent à toi.",
  "Que cette année soit riche en moments rares, en belles rencontres et en projets porteurs de sens.",
  "Passe une excellente journée. Que la sérénité et le succès guident cette nouvelle étape.",
  "Que chaque initiative entreprise cette année trouve un écho à la hauteur de ton engagement.",
  "Un très bon anniversaire — que la suite soit inspirante, équilibrée et féconde.",
];

function pickVoeu(seed) {
  return VOEUX[Math.abs(seed) % VOEUX.length];
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDateLongue() {
  const jour = today.day === 1 ? '1er' : today.day;
  return capitalize(`${WEEKDAYS[today.weekday]} ${jour} ${MONTHS[today.month - 1]} ${today.year}`);
}

/* Vignette : photo homme.jpg / femme.jpg hébergée sur le site */
function thumbnailFor(user) {
  if (!CONFIG.siteUrl || !user.genre) return undefined;
  const file = user.genre === 'femme' ? 'femme.jpg' : 'homme.jpg';
  return { url: `${CONFIG.siteUrl}/${file}` };
}

function buildEmbed(user) {
  const age = user.birthday.year != null ? today.year - user.birthday.year : null;
  const voeu = pickVoeu(today.day + today.month + user.prenom.length);

  const description = [
    age !== null
      ? `Les années filent et l'histoire s'écrit : **${user.prenom}** célèbre aujourd'hui ses **${age} ans**`
      : `C'est le grand jour de **${user.prenom}** 🕯️`,
    '',
    voeu,
    '',
    '*Toute la communauté pense à toi*  ❤️',
  ].join('\n');

  const embed = {
    title: `Joyeux anniversaire, ${user.prenom} !`,
    description,
    color: CONFIG.couleur,
    footer: { text: formatDateLongue() },
  };

  const thumb = thumbnailFor(user);
  if (thumb) embed.thumbnail = thumb;
  if (CONFIG.lienSite) embed.url = CONFIG.lienSite;

  return embed;
}

/* Ligne au-dessus des embeds : uniquement la mention, si elle est configurée */
function buildContent() {
  return CONFIG.mention || '';
}

const payload = {
  content: buildContent(),
  embeds: celebrants.map(buildEmbed),
};

/* ---- Envoi ---- */
(async () => {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Discord a répondu ${res.status} : ${text}`);
      process.exit(1);
    }
    console.log(`🎂 Message envoyé pour : ${celebrants.map((u) => u.prenom).join(', ')}`);
  } catch (err) {
    console.error('❌ Échec de l\'envoi :', err.message);
    process.exit(1);
  }
})();
