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

/* Vœux tirés au hasard à chaque envoi. Ajoute les tiens librement. */
const VOEUX = [
  "Que cette année t'apporte tout le bonheur que tu mérites 🌟",
  "Une bougie de plus, et toujours autant de belles choses devant toi ✨",
  "Que les douze prochains mois te comblent, simplement 💛",
  "Qu'elle soit douce, lumineuse, et pleine de ce qui te rend heureux 🌅",
  "Que cette journée soit à ton image : rayonnante ☀️",
  "Tout le bonheur du monde pour cette nouvelle année 🌈",
  "Que chaque jour de cette année te donne une raison de sourire 😊",
  "Qu'elle t'apporte la santé, la sérénité et de beaux moments 🍀",
  "Que cette année dépasse tout ce que tu imagines 🌠",
  "Profite pleinement de ta journée, elle n'appartient qu'à toi 🎂",
  "Que le bonheur t'accompagne à chaque page de cette nouvelle année 📖",
  "Une année entière de belles choses t'attend 🌻",
  "Que tes rêves de cette année deviennent tes plus beaux souvenirs 🌙",
  "Qu'elle soit remplie de rires, de douceur et de belles surprises 🎁",
  "Que cette année t'offre exactement ce que ton cœur espère 💫",
  "Beaucoup de bonheur, beaucoup d'amour, et une très belle année ❤️",
  "Que rien ne vienne troubler la douceur de cette nouvelle année 🕊️",
  "Souffle tes bougies — que tous tes vœux se réalisent 🕯️",
  "Que cette année soit la plus belle jusqu'ici 🥂",
  "Qu'elle t'apporte la paix, la joie et tout ce qui compte pour toi 🌸",
  "Une nouvelle année s'ouvre à toi, qu'elle soit magnifique 🌤️",
  "Que le bonheur soit ton compagnon de route toute l'année 🍃",
  "Prends soin de toi, et savoure chaque instant de cette journée 💐",
  "Que cette année t'apporte réussite, tendresse et beaux projets 🌱",
  "Tu mérites tout le meilleur — que cette année te le donne 💎",
  "Qu'elle soit à la hauteur de la belle personne que tu es 🌷",
  "Que cette journée marque le début d'une année merveilleuse 🎊",
  "Plein de bonheur, de santé et de douceur pour cette nouvelle année 🌼",
  "Que chaque mois de cette année t'apporte sa part de joie 🌞",
  "Un très bel anniversaire, et une année à la mesure de tes espoirs ✨",
];

/* Tirage au hasard. Si plusieurs personnes fêtent leur anniversaire
   le même jour, chacune reçoit un vœu différent : les phrases déjà
   utilisées dans ce message sont écartées. */
const dejaUtilises = new Set();

function pickVoeu() {
  const dispo = VOEUX.filter((v) => !dejaUtilises.has(v));
  const pool = dispo.length > 0 ? dispo : VOEUX;
  const choix = pool[Math.floor(Math.random() * pool.length)];
  dejaUtilises.add(choix);
  return choix;
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
  const voeu = pickVoeu();

  const description = [
    age !== null
      ? `**${user.prenom}** souffle sa **${age}ᵉ bougie** aujourd'hui 🕯️`
      : `C'est le grand jour de **${user.prenom}** 🕯️`,
    '',
    voeu,
    '',
    '*Toute la communauté pense à toi* ❤️',
  ].join('\n');

  const embed = {
    title: `🎂  Joyeux anniversaire, ${user.prenom} !`,
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
