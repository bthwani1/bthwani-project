#!/usr/bin/env python3
import csv, json, sys, time
path = sys.argv[1] if len(sys.argv)>1 else "evidence/fin/recon_today.csv"
max_var = float(sys.argv[2]) if len(sys.argv)>2 else 0.001
r = list(csv.DictReader(open(path)))
p = sum(float(x["provider_total"]) for x in r)
l = sum(float(x["ledger_total"]) for x in r)
var = abs(p - l) / p if p else 0.0
status = "PASS" if var <= max_var else "FAIL"
out = {"gate_id":"G-RECON-DAILY","status":status,"metrics":{"provider_total": p, "ledger_total": l, "variance": var},
       "artifacts":[path],"timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),"reason": "ok" if status=="PASS" else "variance_exceeds"}
open("reports/gates/G-RECON-DAILY.summary.json","w").write(json.dumps(out, indent=2))
sys.exit(0 if status=="PASS" else 1)
