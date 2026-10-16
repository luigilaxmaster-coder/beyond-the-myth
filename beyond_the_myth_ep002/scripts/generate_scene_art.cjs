const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'assets', 'forma-core.js'), 'utf8');
global.window = global;
global.document = { createElementNS: () => ({}) };
eval(code);

// Let's test palettes
const palettes = ['editorial', 'aurora', 'jardin', 'melocoton', 'oceano', 'caramelo'];
console.log('Available palettes:', palettes);
console.log('Editorial palette colors:', FORMA.defaultPalette);

// Let's see how drawPerson works
console.log('drawPerson function exists:', typeof FORMA.primitives);
// Let's inspect the people definitions
console.log('People keys:', Object.keys(FORMA.people || {}));

// Let's inspect how people are structured in catalog
const investigadora = FORMA.catalog.find(a => a.id.startsWith('personas-investigadora'));
console.log('Investigadora recipe:', investigadora.recipe);

// Render person with specific instance
const personSvg = FORMA.renderMarkup(investigadora, {
  instance: 'test-maya',
  paletteName: 'editorial',
  width: 400
});
console.log('Person SVG length:', personSvg.length);
fs.writeFileSync(path.join(__dirname, 'test_maya.svg'), personSvg, 'utf8');
console.log('Wrote scripts/test_maya.svg');
