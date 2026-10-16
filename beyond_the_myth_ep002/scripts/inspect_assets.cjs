const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, '..', 'assets', 'forma-core.js'), 'utf8');
global.window = global;
global.document = { createElementNS: () => ({}) };
eval(code);

function checkAsset(id, palette = 'editorial') {
  const asset = FORMA.catalog.find(a => a.id === id || a.id.startsWith(id));
  if (!asset) {
    console.log('Not found:', id);
    return;
  }
  const svg = FORMA.renderMarkup(asset, { paletteName: palette, width: 800 });
  const layers = svg.match(/data-layer="[^"]+"/g);
  const parts = svg.match(/data-part="[^"]+"/g);
  console.log(`\n=== ASSET: ${asset.id} (${asset.name}) ===`);
  console.log(`Length: ${svg.length} chars, viewBox: ${asset.viewBox}`);
  console.log('Layers:', [...new Set(layers || [])]);
  console.log('Parts count:', (parts || []).length);
  console.log('Parts sample:', [...new Set(parts || [])].slice(0, 10));
}

checkAsset('escenarios-mercado-01');
checkAsset('escenarios-investigacion-01');
checkAsset('escenarios-oficina-01');
checkAsset('escenarios-laboratorio-01');
checkAsset('escenarios-calle-01');
checkAsset('personas-investigadora-01');
checkAsset('personas-narrador-02');
checkAsset('personas-ingeniera-01');
checkAsset('efectos-rayos-01');
checkAsset('efectos-vapor-01');
checkAsset('efectos-destellos-01');
