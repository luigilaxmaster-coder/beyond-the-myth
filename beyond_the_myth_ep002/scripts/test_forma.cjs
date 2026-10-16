const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('C:/Users/PD2/Downloads/FORMA_Pastel_Studio.html', 'utf8');
const scriptMatch = html.match(/<script id="asset-core">([\s\S]*?)<\/script>/);

if (scriptMatch) {
  const code = scriptMatch[1];
  // Extract and save forma-core.js so it can be loaded directly or referenced in index.html!
  const outPath = path.join(__dirname, '..', 'assets', 'forma-core.js');
  fs.writeFileSync(outPath, code, 'utf8');
  console.log('Saved forma-core.js to assets/, size:', (code.length / 1024).toFixed(1), 'KB');

  // Let's eval in a browser-like global context
  global.window = global;
  global.document = {
    createElementNS: (ns, tag) => ({ tag, attributes: {}, setAttribute: (k, v) => {} })
  };
  eval(code);
  console.log('FORMA loaded successfully!');
  console.log('Total catalog items:', global.FORMA.catalog.length);
  console.log('Categories:', global.FORMA.categories.map(c => c.key));

  // Let's inspect people, scenarios, objects, effects, interface
  const personas = global.FORMA.catalog.filter(a => a.category === 'personas');
  console.log('Personas count:', personas.length);
  console.log('Sample personas:', personas.slice(0, 10).map(p => ({ id: p.id, name: p.name, tags: p.tags.slice(0, 5) })));

  const escenarios = global.FORMA.catalog.filter(a => a.category === 'escenarios');
  console.log('Escenarios count:', escenarios.length);
  console.log('Sample escenarios:', escenarios.slice(0, 10).map(e => ({ id: e.id, name: e.name })));

  const efectos = global.FORMA.catalog.filter(a => a.category === 'efectos');
  console.log('Efectos count:', efectos.length);
  console.log('Sample efectos:', efectos.slice(0, 10).map(e => ({ id: e.id, name: e.name })));
} else {
  console.log('Could not find asset-core script tag');
}
