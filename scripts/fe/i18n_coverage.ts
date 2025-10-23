#!/usr/bin/env ts-node
import fs from "fs";
const base = JSON.parse(fs.readFileSync("web/i18n/en.json","utf8"));
const ar   = JSON.parse(fs.readFileSync("web/i18n/ar.json","utf8"));
const missing = Object.keys(base).filter(k => ar[k] === undefined);
const status = missing.length===0 ? "PASS":"FAIL";
const out = { gate_id: "G-FE-I18N-COVERAGE", status, metrics: { missing: missing.length },
  artifacts: ["web/i18n/en.json","web/i18n/ar.json"], timestamp: new Date().toISOString(),
  reason: missing.length? "missing_keys":"ok", missing };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-FE-I18N-COVERAGE.summary.json", JSON.stringify(out,null,2));
process.exit(status==="PASS"?0:1);
