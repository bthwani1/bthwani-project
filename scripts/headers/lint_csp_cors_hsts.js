#!/usr/bin/env node
import fs from "fs";
const sample = JSON.parse(fs.readFileSync("reports/headers/staging.json","utf8"));
const offenders = { csp_unsafe:[], cors_violation:[], hsts_missing:[] };
for (const {url, headers} of sample) {
  const csp = (headers["content-security-policy"] || "").toLowerCase();
  const cors = (headers["access-control-allow-origin"] || "");
  const hsts = headers["strict-transport-security"] || "";
  if (/unsafe-inline|unsafe-eval/.test(csp)) offenders.csp_unsafe.push(url);
  if (cors.includes("*") && (headers["access-control-allow-credentials"] || "").toLowerCase() === "true")
    offenders.cors_violation.push(url);
  if (!/max-age=\d+/.test(hsts)) offenders.hsts_missing.push(url);
}
const status = (offenders.csp_unsafe.length || offenders.cors_violation.length || offenders.hsts_missing.length) ? "FAIL":"PASS";
const out = {
  gate_id: "G-HEADERS",
  status,
  metrics: { csp_unsafe: offenders.csp_unsafe.length>0, cors_violation: offenders.cors_violation.length>0, hsts_missing: offenders.hsts_missing.length>0 },
  artifacts: ["reports/headers/staging.json"],
  timestamp: new Date().toISOString(),
  reason: status==="FAIL" ? (Object.keys(offenders).find(k=>offenders[k].length) || "violation") : "ok",
  offenders
};
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-HEADERS.summary.json", JSON.stringify(out,null,2));
process.exit(status==="PASS"?0:1);
