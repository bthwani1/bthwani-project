#!/usr/bin/env node
import fs from "fs";
const cov = JSON.parse(fs.readFileSync("reports/qa/coverage-summary.json","utf8"));
const critical = cov.total.statements.pct;
const ok = critical >= 80;
const out = { gate_id:"G-QA-COVERAGE", status: ok? "PASS":"FAIL",
  metrics:{ statements_pct: critical }, artifacts:["reports/qa/coverage-summary.json"],
  timestamp: new Date().toISOString(), reason: ok? "ok":"below_threshold" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-QA-COVERAGE.summary.json", JSON.stringify(out,null,2));
process.exit(ok?0:1);
