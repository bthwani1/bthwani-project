#!/usr/bin/env node
import fs from "fs";
const cfg = JSON.parse(fs.readFileSync("evidence/notif/webhook_policy.json","utf8"));
const ok = cfg.tolerance_window_sec && cfg.tolerance_window_sec <= 300 && ["HMAC-SHA256","Ed25519"].includes(cfg.algo);
const out = { gate_id:"G-API-WEBHOOK-REPLAY", status: ok? "PASS":"FAIL",
  metrics:{ tolerance_window_sec: cfg.tolerance_window_sec||0, algo: cfg.algo||"TBD" },
  artifacts:["evidence/notif/webhook_policy.json"], timestamp:new Date().toISOString(),
  reason: ok? "ok":"replay_window_missing_or_weak" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-API-WEBHOOK-REPLAY.summary.json", JSON.stringify(out,null,2));
process.exit(ok?0:1);
