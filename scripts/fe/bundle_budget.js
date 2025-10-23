#!/usr/bin/env node
import fs from "fs"; import path from "node:path";
const budgetKB = 250;
const files = (fs.existsSync("web/dist")? fs.readdirSync("web/dist"):[]).filter(f=>/\.js$/.test(f));
let offenders=[];
for (const f of files){
  const kb = Math.ceil(fs.statSync(path.join("web/dist", f)).size/1024);
  if (kb > budgetKB) offenders.push({file:f,kb});
}
const out = { gate_id:"G-FE-BUNDLE-BUDGET", status: offenders.length? "FAIL":"PASS",
  metrics:{ offenders: offenders.length, budget_kb: budgetKB }, artifacts:["web/dist/**"],
  timestamp:new Date().toISOString(), reason: offenders.length? "bundle_exceeds":"ok", offenders };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-FE-BUNDLE-BUDGET.summary.json", JSON.stringify(out,null,2));
process.exit(offenders.length?1:0);
