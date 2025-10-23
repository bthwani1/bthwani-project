# S06 — عقود API: OAS + Taxonomy + Idempotency

> Generated: 2025-10-22 18:22:24Z UTC


## الفجوات
- غياب/تباين OAS، عدم توحيد أخطاء، Idempotency للمعاملات.

## العلاج
- تحديث openapi/*.yaml.
- قواعد Spectral: error-object-shape, allowed status, idempotency header.
- اختبارات رحلة: checkout/refund/profile.

## أوامر
```bash
npx spectral lint openapi/*.yaml --fail-severity=warn --format json > reports/openapi/spectral.json
node scripts/api/webhook_replay_guard.js || true
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
