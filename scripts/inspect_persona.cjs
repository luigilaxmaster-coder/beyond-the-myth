const fs = require('fs');
const path = require('path');
const code = fs.readFileSync('c:/Users/PD2/Desktop/cad/video/beyond_the_myth_ep002/assets/forma-core.js', 'utf8');

global.window = global;
global.document = { createElementNS: () => ({}) };
eval(code);

const p = FORMA.catalog.find(x => x.id === 'personas-investigadora-01');
const svg = FORMA.renderMarkup(p, { instance: 'maya', paletteName: 'editorial', width: 500 });
console.log('SVG length:', svg.length);

const ids = [];
const idRegex = /id="([^"]+)"/g;
let m;
while ((m = idRegex.exec(svg)) !== null) {
  ids.push(m[1]);
}
console.log('Sample IDs (total ' + ids.length + '):', ids.slice(0, 30));

const parts = [];
const partRegex = /data-part="([^"]+)"/g;
while ((m = partRegex.exec(svg)) !== null) {
  parts.push(m[1]);
}
console.log('Data parts (total ' + parts.length + '):', [...new Set(parts)]);

const layers = [];
const layerRegex = /data-layer="([^"]+)"/g;
while ((m = layerRegex.exec(svg)) !== null) {
  layers.push(m[1]);
}
console.log('Data layers:', [...new Set(layers)]);
