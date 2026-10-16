const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const times = [
  { time: '00:00:03.00', name: 's1_impact.jpg' },
  { time: '00:00:08.50', name: 's2_maya_discovery.jpg' },
  { time: '00:00:15.00', name: 's3_factory_inspection.jpg' },
  { time: '00:00:23.00', name: 's4_desk_contract_fees.jpg' },
  { time: '00:00:30.50', name: 's5_street_normal_life.jpg' },
  { time: '00:00:37.00', name: 's6_tablet_vs_box.jpg' },
  { time: '00:00:45.00', name: 's7_cart_human_dimension.jpg' },
  { time: '00:00:55.00', name: 's8_closing_lockup.jpg' }
];

const snapDir = path.join(__dirname, '..', 'renders', 'snapshots');
if (!fs.existsSync(snapDir)) fs.mkdirSync(snapDir, { recursive: true });

const artifactDir = 'C:/Users/PD2/.gemini/antigravity-ide/brain/28210e2a-095a-4ee1-a901-ce23b5e75ce7';

for (const item of times) {
  const outPath = path.join(snapDir, item.name);
  const cmd = `ffmpeg -y -ss ${item.time} -i renders/ep002_kosher_60s_master.mp4 -vframes 1 -q:v 2 "${outPath}"`;
  execSync(cmd, { cwd: path.join(__dirname, '..') });
  console.log(`Extracted: ${item.name} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
  
  // Also copy to artifacts dir
  const artPath = path.join(artifactDir, item.name);
  fs.copyFileSync(outPath, artPath);
}
console.log('All snapshots extracted and copied to artifacts!');
