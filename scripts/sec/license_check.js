#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "fs";
try { execSync("npx license-checker --json > reports/licenses/npm.json", {stdio:"pipe",shell:true}); } catch(e){}
const data = JSON.parse(fs.readFileSync("reports/licenses/npm.json","utf8"));
const forbidden = ["GPL-3.0","AGPL-3.0"];
let bad = [];
for (const [name, meta] of Object.entries(data)) if (forbidden.includes((meta.licenses||"").toUpperCase())) bad.push(name);
const out = { gate_id:"G-LICENSES", status: bad.length? "FAIL":"PASS",
  metrics:{ offenders: bad.length }, artifacts:["reports/licenses/npm.json"],
  timestamp:new Date().toISOString(), reason: bad.length? "forbidden_license":"ok", offenders: bad };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-LICENSES.summary.json", JSON.stringify(out,null,2));
process.exit(bad.length?1:0);
