#!/usr/bin/env ts-node
import fs from "fs";
import glob from "glob";
type Row = { method:string, path_norm:string };
const files = glob.sync("reports/openapi/*.json");
let pairs: Row[] = [];
for (const f of files) {
  try { const o = JSON.parse(fs.readFileSync(f,"utf8"));
    for (const [p, methods] of Object.entries<any>(o.paths||{})) {
      for (const [m] of Object.entries<any>(methods)) {
        const pn = (p as string).replace(/:[^/]+/g,"{PARAM}").replace(/\{[^}]+\}/g,"{PARAM}").toUpperCase();
        pairs.push({ method: (m as string).toUpperCase(), path_norm: pn });
      }
    }
  } catch {}
}
const key = (r:Row)=> `${r.method} ${r.path_norm}`;
const counts = new Map<string,number>();
pairs.forEach(r=>counts.set(key(r),(counts.get(key(r))||0)+1));
const dups = Array.from(counts.entries()).filter(([_,c])=>c>1);
const out = { gate_id:"G-API-ROUTES-UNIQ", status: dups.length? "FAIL":"PASS",
  metrics:{ duplicates: dups.length }, artifacts: files, timestamp: new Date().toISOString(),
  reason: dups.length? "duplicates":"ok", duplicates: dups.slice(0,50).map(([k])=>k) };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-API-ROUTES-UNIQ.summary.json", JSON.stringify(out,null,2));
process.exit(dups.length?1:0);
