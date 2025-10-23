#!/usr/bin/env python3
import json, glob, time, sys
schemas = glob.glob("events/schemas/*.json")
bad=[]; pii_missing=[]
for s in schemas:
  j=json.load(open(s))
  if not j.get("$id") or not j.get("version"):
    bad.append(s)
  if "properties" in j:
    for k,v in j["properties"].items():
      if v.get("pii") is None: pii_missing.append(f"{s}:{k}")
status = "PASS" if not bad and not pii_missing else "FAIL"
out = {"gate_id":"G-DATA-CONTRACTS","status":status,
       "metrics":{"invalid":len(bad),"pii_flag_missing":len(pii_missing)},
       "artifacts":schemas[:20],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason":"schema_issues" if status=="FAIL" else "ok","invalid":bad, "pii_missing": pii_missing[:50]}
open("reports/gates/G-DATA-CONTRACTS.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
