#!/usr/bin/env python3
import json, time, sys
from datetime import datetime
data = json.load(open("evidence/release/rollback_tests.json"))
last = max(datetime.strptime(x["date"], "%Y-%m-%d") for x in data)
days = (datetime.utcnow() - last).days
status = "PASS" if days <= 30 else "FAIL"
out = {"gate_id":"G-RELEASE-ROLLBACK-FRESH","status":status,"metrics":{"last_days":days},
       "artifacts":["evidence/release/rollback_tests.json"],"timestamp":datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
       "reason":"stale" if status=="FAIL" else "ok" }
open("reports/gates/G-RELEASE-ROLLBACK-FRESH.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
