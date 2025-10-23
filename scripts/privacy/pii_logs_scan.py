#!/usr/bin/env python3
import re, glob, json, time, sys
patterns = [r'\b\d{3}-\d{2}-\d{4}\b', r'[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}']
pat = re.compile("|".join(patterns), re.I)
hits=0
for f in glob.glob("logs/**/*.log", recursive=True):
  for i,l in enumerate(open(f,'r',errors='ignore')):
    if pat.search(l): hits+=1; break
status = "PASS" if hits==0 else "FAIL"
out = {"gate_id":"G-PII-LOGS","status":status,"metrics":{"files_with_pii":hits},
       "artifacts":["logs/**"],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),"reason":"pii_found" if hits else "ok"}
open("reports/gates/G-PII-LOGS.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
