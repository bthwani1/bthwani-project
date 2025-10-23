#!/usr/bin/env node
import fs from "fs";
const r = JSON.parse(fs.readFileSync("reports/qa/playwright-results.json","utf8"));
const failed = r.suites?.some(s=>s.status==="failed") || r.status==="failed";
const out = { gate_id:"G-COOKIE-CONSENT-TEST", status: failed? "FAIL":"PASS",
  metrics:{ failed: failed?1:0 }, artifacts:["reports/qa/playwright-results.json"],
  timestamp:new Date().toISOString(), reason: failed? "tracking_before_consent":"ok" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-COOKIE-CONSENT-TEST.summary.json", JSON.stringify(out,null,2));
process.exit(failed?1:0);
