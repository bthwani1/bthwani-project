#!/usr/bin/env node
import fs from "fs";
const dump = JSON.parse(fs.readFileSync("reports/headers/staging.json","utf8"));
let bad = 0;
for (const {headers} of dump) {
  const setCookie = headers["set-cookie"] || "";
  if (setCookie && (!/httponly/i.test(setCookie) || !/secure/i.test(setCookie) || !/samesite=(lax|strict)/i.test(setCookie))) bad++;
}
const out = {
  gate_id: "G-COOKIE-SESSION",
  status: bad? "FAIL":"PASS",
  metrics: { offenders: bad },
  artifacts: ["reports/headers/staging.json"],
  timestamp: new Date().toISOString(),
  reason: bad? "cookie_flags" : "ok"
};
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-COOKIE-SESSION.summary.json", JSON.stringify(out,null,2));
process.exit(bad?1:0);
