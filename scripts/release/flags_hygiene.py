#!/usr/bin/env python3
import json, time, sys
flags = json.load(open("evidence/flags/inventory.json"))
expired = []; missing_owner=[]
for f in flags:
  if f.get("expires_at","") < time.strftime("%Y-%m-%d"): expired.append(f["key"])
  if not f.get("owner"): missing_owner.append(f["key"])
status = "PASS" if not expired and not missing_owner else "FAIL"
out = {"gate_id":"G-FEATURE-FLAGS","status":status,"metrics":{"expired":len(expired),"missing_owner":len(missing_owner)},
       "artifacts":["evidence/flags/inventory.json"],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason": "expired_or_ownerless" if status=="FAIL" else "ok","expired":expired,"missing_owner":missing_owner}
open("reports/gates/G-FEATURE-FLAGS.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
