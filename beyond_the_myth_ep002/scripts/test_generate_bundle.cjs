const fs = require('fs');
const path = require('path');

// Load FORMA core
const formaCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'forma-core.js'), 'utf8');
global.window = global;
global.document = { createElementNS: () => ({}) };
eval(formaCode);

function getAssetSvg(id, options = {}) {
  const asset = FORMA.catalog.find(a => a.id === id || a.id.startsWith(id));
  if (!asset) throw new Error('Asset not found: ' + id);
  return FORMA.renderMarkup(asset, options);
}

console.log('Building high-density FORMA Pastel Studio 2.0 assets...');

// Extract SVGs with unique IDs to prevent gradient ID collisions
const mercadoSvg = getAssetSvg('escenarios-mercado-01', { instance: 'sc-mercado', paletteName: 'editorial', width: 1080 });
const mercadoCartSvg = getAssetSvg('escenarios-mercado-02', { instance: 'sc-mercado-cart', paletteName: 'melocoton', width: 1080 });
const labSvg = getAssetSvg('escenarios-laboratorio-01', { instance: 'sc-lab', paletteName: 'oceano', width: 1080 });
const oficinaSvg = getAssetSvg('escenarios-oficina-01', { instance: 'sc-oficina', paletteName: 'aurora', width: 1080 });
const calleSvg = getAssetSvg('escenarios-calle-01', { instance: 'sc-calle', paletteName: 'melocoton', width: 1080 });

const mayaInvestigadora = getAssetSvg('personas-investigadora-01', { instance: 'maya-point', paletteName: 'editorial', width: 480 });
const mayaNarradora = getAssetSvg('personas-narrador-02', { instance: 'maya-talk', paletteName: 'editorial', width: 480 });
const companionVecino = getAssetSvg('personas-vecino-01', { instance: 'comp-curious', paletteName: 'aurora', width: 440 });
const companionAdolescente = getAssetSvg('personas-adolescente-01', { instance: 'comp-listen', paletteName: 'jardin', width: 440 });
const inspectorIngeniera = getAssetSvg('personas-ingeniera-01', { instance: 'insp-factory', paletteName: 'oceano', width: 460 });

const rayosSvg = getAssetSvg('efectos-rayos-01', { instance: 'fx-rayos', paletteName: 'editorial', width: 800 });
const vaporSvg = getAssetSvg('efectos-vapor-01', { instance: 'fx-vapor', paletteName: 'editorial', width: 320 });
const destellosSvg = getAssetSvg('efectos-destellos-01', { instance: 'fx-destellos', paletteName: 'editorial', width: 400 });

console.log('All SVGs generated successfully.');
