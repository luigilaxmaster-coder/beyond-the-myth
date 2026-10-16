const fs = require('fs');
const path = require('path');

// Load forma-core.js
const formaCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'forma-core.js'), 'utf8');
global.window = global;
global.document = { createElementNS: () => ({}) };
eval(formaCode);

console.log('--- ALL FAMILIES BY CATEGORY ---');
const byCat = {};
for (const f of FORMA.families) {
  if (!byCat[f.category]) byCat[f.category] = [];
  byCat[f.category].push({ key: f.key, label: f.label, group: f.group });
}

for (const [cat, fams] of Object.entries(byCat)) {
  console.log(`\nCategory: ${cat} (${fams.length} families)`);
  console.log(fams.map(f => `${f.key} (${f.label})`).join(', '));
}
