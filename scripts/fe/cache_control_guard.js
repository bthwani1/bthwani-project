#!/usr/bin/env node
import fs from "fs";
const dump = JSON.parse(fs.readFileSync("reports/headers/staging.json","utf8"));
let bad=0;
for (const {url,headers} of dump){
  const cc=(headers["cache-control"]||"").toLowerCase();
  const protectedFlow = /checkout|profile|admin/.test(url);
  if (protectedFlow && !/no-store/.test(cc)) bad++;
}
const out = { gate_id:"G-FE-CACHE-CONTROL", status: bad? "FAIL":"PASS",
  metrics:{ offenders: bad }, artifacts:["reports/headers/staging.json"],
  timestamp:new Date().toISOString(), reason: bad? "no_store_missing":"ok" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-FE-CACHE-CONTROL.summary.json", JSON.stringify(out,null,2));
process.exit(bad?1:0);
