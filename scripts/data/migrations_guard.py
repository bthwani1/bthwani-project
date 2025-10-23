#!/usr/bin/env python3
import re, json, sys, time, glob
files = glob.glob("db/migrations/**/*.*", recursive=True) + glob.glob("**/migrations/**/*.*", recursive=True)
risk = 0; offenders=[]
pat = re.compile(r'\b(DROP\s+TABLE|DROP\s+COLUMN|ALTER\s+TABLE.*DROP|ALTER\s+COLUMN.*TYPE\b(?!.*USING))', re.I)
for f in files:
  try:
    txt=open(f,'r',errors='ignore').read()
    if pat.search(txt): risk+=1; offenders.append(f)
  except: pass
status = "PASS" if risk==0 else "FAIL"
out = {"gate_id":"G-DB-MIGRATION-RISK","status":status,"metrics":{"risky_migrations":risk},
       "artifacts":files[:20],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason": "destructive_changes" if risk else "ok","offenders": offenders}
open("reports/gates/G-DB-MIGRATION-RISK.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
