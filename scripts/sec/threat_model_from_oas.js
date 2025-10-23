#!/usr/bin/env node
import fs from "fs";
const oas = JSON.parse(fs.readFileSync(process.argv[2] || "openapi/spec.json","utf8"));
const threats = [];
for (const [path, methods] of Object.entries(oas.paths||{})) {
  for (const [m, op] of Object.entries(methods)) {
    const auth = (op.security||oas.security||[]).length>0;
    const t = [];
    if (!auth) t.push({id:"ASVS-2.1",name:"Auth missing"});
    if (!((op.requestBody||{}).required===false)) t.push({id:"ASVS-5.3",name:"Input validation"});
    if (/(create|pay|order)/i.test(op.operationId||"")) t.push({id:"ASVS-3.4",name:"Idempotency"});
    threats.push({method:m.toUpperCase(), path, operationId: op.operationId||"", asvs: t});
  }
}
fs.mkdirSync("reports/sec",{recursive:true});
fs.writeFileSync("reports/sec/threat_model.json", JSON.stringify({items:threats},null,2));
const gaps = threats.reduce((n,x)=>n+(x.asvs.length?0:1),0);
const out = { gate_id:"G-THREAT-ASVS", status: gaps? "FAIL":"PASS",
  metrics:{ endpoints: threats.length, unmapped: gaps }, artifacts:["reports/sec/threat_model.json"],
  timestamp:new Date().toISOString(), reason: gaps? "unmapped_endpoints":"ok" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-THREAT-ASVS.summary.json", JSON.stringify(out,null,2));
process.exit(gaps?1:0);
