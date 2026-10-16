const fs = require('fs');
const path = require('path');

const formaCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'forma-core.js'), 'utf8');
global.window = global;
global.document = { createElementNS: () => ({}) };
eval(formaCode);

// Function to render asset and clean up its SVG for inlining
function getAssetSvg(id, options = {}) {
  const asset = FORMA.catalog.find(a => a.id === id || a.id.startsWith(id));
  if (!asset) throw new Error('Asset not found: ' + id);
  return FORMA.renderMarkup(asset, options);
}

console.log('Testing asset extraction...');
const mercado = getAssetSvg('escenarios-mercado-01', { paletteName: 'editorial', width: 1080 });
const lab = getAssetSvg('escenarios-laboratorio-01', { paletteName: 'oceano', width: 1080 });
const oficina = getAssetSvg('escenarios-oficina-01', { paletteName: 'aurora', width: 1080 });
const calle = getAssetSvg('escenarios-calle-01', { paletteName: 'melocoton', width: 1080 });
const maya = getAssetSvg('personas-investigadora-01', { instance: 'maya-main', paletteName: 'editorial', width: 450 });
const companion = getAssetSvg('personas-vecino-01', { instance: 'companion-main', paletteName: 'aurora', width: 450 });
const inspector = getAssetSvg('personas-ingeniera-01', { instance: 'inspector-main', paletteName: 'oceano', width: 450 });
const rayos = getAssetSvg('efectos-rayos-01', { paletteName: 'editorial', width: 600 });
const vapor = getAssetSvg('efectos-vapor-01', { paletteName: 'editorial', width: 300 });

console.log('Successfully rendered:');
console.log('- Mercado:', mercado.length, 'chars');
console.log('- Lab:', lab.length, 'chars');
console.log('- Oficina:', oficina.length, 'chars');
console.log('- Calle:', calle.length, 'chars');
console.log('- Maya:', maya.length, 'chars');
console.log('- Companion:', companion.length, 'chars');
console.log('- Inspector:', inspector.length, 'chars');
console.log('- Rayos:', rayos.length, 'chars');
console.log('- Vapor:', vapor.length, 'chars');
