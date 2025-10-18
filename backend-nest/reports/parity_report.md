# API Documentation Parity Report

**Generated:** ١٨‏/١٠‏/٢٠٢٥، ٦:٠٠:٢١ م

---

## 📊 Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Routes Reviewed** | 506 | 100% |
| ✅ **Matched** | 239 | 47.23% |
| ❌ **Undocumented** | 60 | 11.86% |
| ⚠️ **Mismatch** | 149 | 29.45% |
| 📝 **Missing Fields** | 58 | 11.46% |
| 🔢 **Wrong Status** | 0 | 0.00% |

### 🎯 Parity Metrics

- **Parity Gap:** `52.77%`
- **Parity Score:** `47.23%`

**Quality Rating:** 🔴 Poor

---

## 🔍 Issues by Category

### ❌ Undocumented Routes (60)

These routes exist in code but are not documented in OpenAPI:

- `POST /` - OrderController
- `GET /my-orders` - OrderController
- `POST /:id/assign-driver` - OrderController
- `POST /:id/notes` - OrderController
- `POST /:id/vendor-accept` - OrderController
- `POST /:id/vendor-cancel` - OrderController
- `POST /:id/pod` - OrderController
- `POST /:id/cancel` - OrderController
- `POST /:id/return` - OrderController
- `POST /:id/rate` - OrderController
- `POST /:id/repeat` - OrderController
- `GET /export` - OrderController
- `POST /:id/schedule` - OrderController
- `GET /public/:id/status` - OrderController
- `POST /:id/update-location` - OrderController
- `GET /me` - UserController
- `PATCH /me` - UserController
- `GET /addresses` - UserController
- `POST /addresses` - UserController
- `PATCH /addresses/:addressId` - UserController

... and 40 more

### ⚠️ Mismatches (149)

These routes have inconsistencies between code and documentation:

- `GET /admin/dashboard`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/stats/today`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/stats/financial`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/dashboard/orders-by-status`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/dashboard/revenue`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/dashboard/live-metrics`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/drivers`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/drivers/:id`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/drivers/:id/performance`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/drivers/:id/financials`
  - OpenAPI has security but inventory shows no auth guard
- `POST /admin/drivers/:id/ban`
  - OpenAPI has security but inventory shows no auth guard
- `POST /admin/drivers/:id/unban`
  - OpenAPI has security but inventory shows no auth guard
- `PATCH /admin/drivers/:id/adjust-balance`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/withdrawals`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/withdrawals/pending`
  - OpenAPI has security but inventory shows no auth guard
- `PATCH /admin/withdrawals/:id/approve`
  - OpenAPI has security but inventory shows no auth guard
- `PATCH /admin/withdrawals/:id/reject`
  - OpenAPI has security but inventory shows no auth guard
- `GET /admin/stores/pending`
  - OpenAPI has security but inventory shows no auth guard
- `POST /admin/stores/:id/approve`
  - OpenAPI has security but inventory shows no auth guard
- `POST /admin/stores/:id/reject`
  - OpenAPI has security but inventory shows no auth guard

... and 129 more

### 📝 Missing Fields (58)

These routes are documented but missing important fields:

- `POST /admin/emergency/pause-system`
  - Missing request body/parameters in OpenAPI
- `POST /analytics/roas/calculate`
  - Missing request body/parameters in OpenAPI
- `POST /analytics/adspend`
  - Missing request body/parameters in OpenAPI
- `POST /analytics/events/track`
  - Missing request body/parameters in OpenAPI
- `POST /auth/firebase/login`
  - Missing security/authentication in OpenAPI
- `PATCH /auth/profile`
  - Missing request body/parameters in OpenAPI
- `PATCH /content/my-subscription/cancel`
  - Missing request body/parameters in OpenAPI
- `POST /content/admin/pages`
  - Missing request body/parameters in OpenAPI
- `PATCH /content/admin/app-settings`
  - Missing request body/parameters in OpenAPI
- `POST /content/admin/faqs`
  - Missing request body/parameters in OpenAPI
- `PATCH /drivers/availability`
  - Missing request body/parameters in OpenAPI
- `PATCH /drivers/profile`
  - Missing request body/parameters in OpenAPI
- `POST /drivers/documents/upload`
  - Missing request body/parameters in OpenAPI
- `POST /drivers/vacations/request`
  - Missing request body/parameters in OpenAPI
- `POST /drivers/withdrawals/request`
  - Missing request body/parameters in OpenAPI
- `POST /drivers/issues/report`
  - Missing request body/parameters in OpenAPI
- `POST /er/attendance/check-in`
  - Missing request body/parameters in OpenAPI
- `POST /er/attendance/check-out`
  - Missing request body/parameters in OpenAPI
- `POST /er/payroll/generate`
  - Missing request body/parameters in OpenAPI
- `POST /finance/payouts/batches`
  - Missing request body/parameters in OpenAPI

... and 38 more

---

## 💡 Recommendations

1. **Add Swagger decorators** to 60 undocumented routes
2. **Fix 149 mismatches** between code and documentation
3. **Complete 58 routes** with missing documentation fields

---

*Report generated by Parity Gap Calculator*
