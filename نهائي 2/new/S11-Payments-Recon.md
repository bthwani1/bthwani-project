# S11 — المدفوعات والتسوية المالية

> Generated: 2025-10-22 18:22:24Z UTC


## الأهداف
- Idempotency-Key لكل POST مالي
- Success ≥97%، Variance ≤0.1%
- Webhooks موقعة + نافذة replay ≤300s

## أوامر
```bash
python3 scripts/fin/recon_variance.py evidence/fin/recon_today.csv 0.001
node scripts/api/webhook_replay_guard.js
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
