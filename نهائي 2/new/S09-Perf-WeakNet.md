# S09 — الأداء والشبكات الضعيفة

> Generated: 2025-10-22 18:22:24Z UTC


## الأهداف
- LCP p75 ≤ 2.5s، INP p75 ≤ 200ms
- Cache-Control صحيح
- سياسات Weak-Net وWorkbox

## أوامر
```bash
npx lhci autorun --config=perf/lhci.json
node scripts/fe/cache_control_guard.js
node scripts/fe/bundle_budget.js
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
