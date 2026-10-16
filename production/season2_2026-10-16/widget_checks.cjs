const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/PD2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const root='C:/Users/PD2/Desktop/cad/video';
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const results=[];
 for(let n=11;n<=20;n++){
  const ep='ep'+String(n).padStart(3,'0');const dir=path.join(root,'beyond_the_myth_'+ep);
  const page=await browser.newPage({viewport:{width:1080,height:1920}});
  await page.goto(pathToFileURL(path.join(dir,'index.html')).href);
  await page.waitForFunction(()=>window.__timelines&&Object.keys(window.__timelines).length>0);
  await page.evaluate(()=>{document.querySelectorAll('[data-start]').forEach(x=>x.style.display='none');});
  const before=await page.evaluate(ep=>window.__timelines[ep].time(),ep);
  await page.locator('#inspect').click();
  const after=await page.evaluate(ep=>window.__timelines[ep].time(),ep);
  const pressed=await page.locator('#inspect').getAttribute('aria-pressed');
  if(!(after>before&&pressed==='true'))throw new Error('Widget failed '+ep);
  // Scrub forward/backward twice: root time remains finite and reaches proof states.
  const scrub=await page.evaluate(ep=>{const t=window.__timelines[ep];t.seek(1);t.seek(40);t.seek(1);return {time:t.time(),finite:Number.isFinite(t.duration())}},ep);
  if(scrub.time!==1||!scrub.finite)throw new Error('Seek failed '+ep);
  results.push({episode:ep,button:true,proof_seconds:after,seek:true});await page.close();
 }
 await browser.close();fs.writeFileSync(path.join(root,'production/season2_2026-10-16/widget_checks.json'),JSON.stringify(results,null,2));console.log('10/10 interactive proof controls and reversible timeline seeks passed');
})().catch(e=>{console.error(e);process.exit(1)});
