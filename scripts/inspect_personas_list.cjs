const fs = require('fs');
const code = fs.readFileSync('c:/Users/PD2/Desktop/cad/video/beyond_the_myth_ep002/assets/forma-core.js', 'utf8');

global.window = global;
global.document = { createElementNS: () => ({}) };
eval(code);

const personas = FORMA.catalog.filter(x => x.category === 'personas');
console.log('Total personas items:', personas.length);

const families = {};
for (const p of personas) {
  const fam = p.id.split('-').slice(0, 2).join('-');
  if (!families[fam]) families[fam] = [];
  families[fam].push({ id: p.id, name: p.name });
}

for (const [fam, items] of Object.entries(families)) {
  console.log(`\nFamily ${fam} (${items.length} variants):`);
  items.slice(0, 5).forEach(it => console.log(`  - ${it.id}: ${it.name}`));
}
