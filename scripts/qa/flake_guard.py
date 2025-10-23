#!/usr/bin/env python3
import json, sys, time
runs = [json.load(open(f)) for f in ["reports/qa/run1.json","reports/qa/run2.json","reports/qa/run3.json"]]
failing = set()
for i,r in enumerate(runs):
  for t in r.get("tests",[]):
    if t["status"]=="failed": failing.add(t["name"])
flake = []
for name in list(failing):
  if sum(1 for r in runs for t in r.get("tests",[]) if t["name"]==name and t["status"]=="failed") == 1:
    flake.append(name)
status = "PASS" if len(flake)==0 else "FAIL"
out = {"gate_id":"G-QA-FLAKE","status":status,"metrics":{"flakes":len(flake)},"artifacts":["reports/qa/run*.json"],
       "timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),"reason":"flaky_tests" if flake else "ok","flakes":flake}
open("reports/gates/G-QA-FLAKE.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
