const fs = require('fs');
const path = require('path');

// Charger le SVG template une seule fois au démarrage
const SVG_TEMPLATE_PATH = path.join(__dirname, '../assets/Nft-V2.svg');
let SVG_TEMPLATE = '';

// Charger le template
try {
  SVG_TEMPLATE = fs.readFileSync(SVG_TEMPLATE_PATH, 'utf8');
  console.log('✅ SVG Template loaded successfully');
} catch (error) {
  console.error('❌ Error loading SVG template:', error.message);
}

/**
 * Configurations des humeurs avec leurs styles
 */
const MOOD_CONFIGS = {
  0: {
    name: 'Happy',
    colors: { primary: '#FFD700', secondary: '#FFA500' },
    opacity: 1.0,
    rotation: 0,
    scale: 1.0,
    saturation: 1.3,
    brightness: 1.2
  },
  1: {
    name: 'Sad',
    colors: { primary: '#87CEEB', secondary: '#4169E1' },
    opacity: 0.85,
    rotation: -5,
    scale: 0.95,
    saturation: 0.7,
    brightness: 0.9
  },
  2: {
    name: 'Anger',
    colors: { primary: '#FF6347', secondary: '#DC143C' },
    opacity: 1.0,
    rotation: 10,
    scale: 1.05,
    saturation: 1.5,
    brightness: 1.1
  },
  3: {
    name: 'Fear',
    colors: { primary: '#9370DB', secondary: '#8B4789' },
    opacity: 0.75,
    rotation: -10,
    scale: 0.9,
    saturation: 0.5,
    brightness: 0.8
  },
  4: {
    name: 'Surprise',
    colors: { primary: '#FFB6C1', secondary: '#FF69B4' },
    opacity: 1.0,
    rotation: 5,
    scale: 1.1,
    saturation: 1.2,
    brightness: 1.3
  },
  5: {
    name: 'Boredom',
    colors: { primary: '#808080', secondary: '#A9A9A9' },
    opacity: 0.7,
    rotation: 0,
    scale: 0.95,
    saturation: 0.3,
    brightness: 0.85
  },
  6: {
    name: 'Shame',
    colors: { primary: '#E6E6FA', secondary: '#DDA0DD' },
    opacity: 0.8,
    rotation: -15,
    scale: 0.85,
    saturation: 0.6,
    brightness: 0.75
  },
  7: {
    name: 'Determination',
    colors: { primary: '#000000', secondary: '#333333' },
    opacity: 1.0,
    rotation: 0,
    scale: 1.0,
    saturation: 1.0,
    brightness: 0.9
  },
  8: {
    name: 'Excitement',
    colors: { primary: '#FF1493', secondary: '#FF69B4' },
    opacity: 1.0,
    rotation: 15,
    scale: 1.15,
    saturation: 1.8,
    brightness: 1.4
  },
  9: {
    name: 'Kawaii',
    colors: { primary: '#FFB6DE', secondary: '#FF69B4' },
    opacity: 1.0,
    rotation: -10,
    scale: 1.05,
    saturation: 1.5,
    brightness: 1.3
  },
  10: {
    name: 'Sleepy',
    colors: { primary: '#FFFACD', secondary: '#FFE4B5' },
    opacity: 0.6,
    rotation: 0,
    scale: 0.95,
    saturation: 0.5,
    brightness: 0.8
  },
  11: {
    name: 'Mischievous',
    colors: { primary: '#00FF00', secondary: '#32CD32' },
    opacity: 1.0,
    rotation: 8,
    scale: 1.0,
    saturation: 1.4,
    brightness: 1.2
  }
};

/**
 * Génère un SVG personnalisé basé sur l'humeur
 */
function generateMoodSVG(moodIndex, message = '') {
  const config = MOOD_CONFIGS[moodIndex] || MOOD_CONFIGS[0];

  let modifiedSVG = SVG_TEMPLATE;

  // 1. Ajouter les filtres CSS pour l'humeur
  modifiedSVG = applyMoodFilters(modifiedSVG, config);

  // 2. Remplacer les couleurs
  modifiedSVG = replaceMoodColors(modifiedSVG, config.colors);

  // 3. Ajouter transformation (rotation + scale)
  modifiedSVG = addTransformation(modifiedSVG, config.rotation, config.scale);

  // 4. Ajouter le message
  modifiedSVG = addMessageText(modifiedSVG, message, config.colors.primary);

  // 5. Ajouter le label du mood
  modifiedSVG = addMoodLabel(modifiedSVG, config.name, config.colors.secondary);

  return modifiedSVG;
}

/**
 * Appliquer les filtres CSS pour l'humeur
 */
function applyMoodFilters(svg, config) {
  const filterStyle = `
    filter: brightness(${config.brightness}) saturate(${config.saturation});
    opacity: ${config.opacity};
  `;

  return svg.replace(
    /<svg([^>]*)>/,
    `<svg$1 style="${filterStyle}">`
  );
}

/**
 * Remplacer les couleurs du SVG
 */
function replaceMoodColors(svg, colors) {
  let modified = svg;

  // Remplacer les couleurs primaires (chercher les fills courants)
  // Adaptez ces patterns selon votre SVG réel
  
  // Remplacer par la couleur primaire
  modified = modified.replace(/#FFD700/g, colors.primary);
  modified = modified.replace(/#FFA500/g, colors.secondary);
  
  // Ou si vous avez des classes
  modified = modified.replace(/class="primary"/g, `style="fill:${colors.primary}"`);
  modified = modified.replace(/class="secondary"/g, `style="fill:${colors.secondary}"`);

  return modified;
}

/**
 * Ajouter transformation (rotation + scale)
 */
function addTransformation(svg, rotation, scale) {
  // Extraire le viewBox
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) return svg;

  const [x, y, w, h] = viewBoxMatch[1].split(' ').map(Number);
  const cx = x + w / 2;
  const cy = y + h / 2;

  let modified = svg;

  // Envelopper le contenu avec un groupe transformé
  modified = modified.replace(
    /<svg/,
    `<svg><g transform="translate(${cx}, ${cy}) rotate(${rotation}) scale(${scale}) translate(${-cx}, ${-cy})">`
  );

  modified = modified.replace('</svg>', '</g></svg>');

  return modified;
}

/**
 * Ajouter le texte du message
 */
function addMessageText(svg, message, color) {
  if (!message || message.trim() === '') {
    return svg;
  }

  const displayMessage = message.substring(0, 50);
  const textElement = `
    <text x="200" y="350" font-size="14" text-anchor="middle" fill="${color}" font-family="Arial" font-weight="bold">
      "${displayMessage}"
    </text>
  `;

  return svg.replace('</svg>', textElement + '</svg>');
}

/**
 * Ajouter le label de l'humeur
 */
function addMoodLabel(svg, moodName, color) {
  const labelElement = `
    <text x="200" y="375" font-size="16" text-anchor="middle" fill="${color}" font-family="Arial" font-weight="bold">
      ${moodName}
    </text>
  `;

  return svg.replace('</svg>', labelElement + '</svg>');
}

/**
 * Obtenir le nom de l'humeur par index
 */
function getMoodName(moodIndex) {
  return MOOD_CONFIGS[moodIndex]?.name || 'Unknown';
}

module.exports = {
  generateMoodSVG,
  getMoodName,
  MOOD_CONFIGS
};
