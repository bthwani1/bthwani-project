# BTW-CORE — FE⇄BE Parity Action Plan

- التاريخ: **2025-10-23 15:06 UTC**
- جذر التحليل: `/mnt/data/bthwani-project-main/bthwani-project-main`

## Executive Summary
- إجمالي مسارات الباك إند: **631**
- إجمالي مسارات FE المميزة: **89** عبر **6** تطبيقات
- إجمالي نداءات FE: **101**
- إجمالي الفجوات FE→BE: **75**
- مسارات BE غير مستخدمة من FE: **604**

**الحكم:** الربط غير مكتمل. توجد فجوات تستلزم توحيد المسارات وتوليد عميل OpenAPI.

## Backend Focus — أعلى الملفات من حيث عدد النهايات التقريبية
- `/backend-nest/src/modules/admin/admin.controller.ts` → ~76 نهايات
- `/backend-nest/src/modules/finance/finance.controller.ts` → ~32 نهايات
- `/backend-nest/src/modules/analytics/analytics.controller.ts` → ~30 نهايات
- `/backend-nest/src/modules/driver/driver.controller.ts` → ~28 نهايات
- `/backend-nest/src/modules/er/er.controller.ts` → ~28 نهايات
- `/backend-nest/src/modules/cart/cart.controller.ts` → ~26 نهايات
- `/backend-nest/src/modules/merchant/merchant.controller.ts` → ~25 نهايات
- `/backend-nest/src/modules/order/order.controller.ts` → ~24 نهايات
- `/backend-nest/src/modules/wallet/wallet.controller.ts` → ~24 نهايات
- `/backend-nest/src/modules/marketer/marketer.controller.ts` → ~22 نهايات

## Backend Orphans (عينة)
| Method | Path | File |
|---|---|---|
| GET | `/` | `/backend-nest/scripts/extract-routes.ts` |
| GET | `/content/pages` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| GET | `/content/pages/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| POST | `/content/pages` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| PUT | `/content/pages/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| DELETE | `/content/pages/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| POST | `/content/strings` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| PUT | `/content/strings/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| DELETE | `/content/strings/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| POST | `/content/home-layouts` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| PUT | `/content/home-layouts/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| DELETE | `/content/home-layouts/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| DELETE | `/wallet/coupons/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| DELETE | `/wallet/subscriptions/{id}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| POST | `/reports/generate` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| POST | `/reports/export/{id}/{format}` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| GET | `/reports/realtime` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| GET | `/wallet/settlements/export` | `/backend-nest/src/modules/admin/admin-cms.controller.ts` |
| GET | `/admin/dashboard` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/stats/today` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/stats/financial` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/dashboard/orders-by-status` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/dashboard/revenue` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/dashboard/live-metrics` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/drivers/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/drivers/{id}/performance` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| DELETE | `/admin/drivers/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/drivers/{id}/financials` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/drivers/{id}/ban` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/drivers/{id}/unban` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| PATCH | `/admin/drivers/{id}/adjust-balance` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/vendors/pending` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/vendors/{id}/approve` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/vendors/{id}/reject` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/vendors/{id}/suspend` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/users/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/users/{id}/ban` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/users/{id}/unban` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/reports/daily` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/reports/export/{type}/{format}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/drivers/{id}/attendance` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/drivers/attendance/summary` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/drivers/{id}/attendance/adjust` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| DELETE | `/admin/drivers/shifts/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| DELETE | `/admin/drivers/assets/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/drivers/leave-requests` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| PATCH | `/admin/drivers/leave-requests/{id}/approve` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| PATCH | `/admin/drivers/leave-requests/{id}/reject` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| DELETE | `/admin/drivers/leave-requests/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/drivers/{id}/leave-balance` | `/backend-nest/src/modules/admin/admin.controller.ts` |

… (+554 أخرى)

## Global Action Plan (Prioritized)
| Area | Task | Owner | Due |
|---|---|---|---|
| Contracts/OpenAPI | تجميع كل النهايات في openapi.yaml واحد. نسبة Consistency≥85 وParity≤5% على الرحلات الحرجة. | @BE | +5d |
| FE→BE Parity | سد جميع الفجوات المكتشفة (75). مراجعة تسمية الإصدارات `/api/v2/*` وتوحيد البادئات. | @BE/@FE | +7d |
| Typed Clients | توليد SDK TypeScript من OpenAPI لكل تطبيق FE. إيقاف النداءات اليدوية. | @FE | +5d |
| Security/Headers | CSP/HSTS/CORS + Cookie flags على staging. تقارير في CI. | @Sec/@FE | +4d |
| Perf/A11y | LHCI p75 LCP≤2.5s, INP≤200ms وPa11y=WCAG2.2 AA. | @FE/@Perf | +7d |
| Idempotency/Webhooks | تطبيق Idempotency-Key على POST الحرجة وتوقيع Webhooks مع نافذة ≤300s. | @BE | +5d |
| DR/Release | اختبار Rollback ≤5m وتقرير DR (RPO≤15m,RTO≤30m). | @SRE | +10d |

---

## admin-dashboard
- مسارات FE المميزة: **51**
- عدد نداءات FE: **62**
- تغطية FE→BE: **8%**
- فجوات غير مغطاة: **56**

| FE Call | Suggested BE | Confidence | FE File |
|---|---|---:|---|
| `ANY /api/content/latest` | `GET /content/pages` | 72% | `/admin-dashboard/public/sw.js` |
| `ANY /api/content/latest` | `GET /content/pages` | 72% | `/admin-dashboard/public/sw.js` |
| `GET /admin/dashboard/summary` | `GET /admin/dashboard` | 80% | `/admin-dashboard/src/api/adminOverview.ts` |
| `GET /admin/dashboard/timeseries` | `GET /admin/dashboard/live-metrics` | 82% | `/admin-dashboard/src/api/adminOverview.ts` |
| `GET /admin/dashboard/top` | `GET /admin/dashboard` | 88% | `/admin-dashboard/src/api/adminOverview.ts` |
| `GET /admin/dashboard/alerts` | `GET /admin/dashboard` | 82% | `/admin-dashboard/src/api/adminOverview.ts` |
| `POST /auth/login` | `GET /catalog` | 63% | `/admin-dashboard/src/api/client-example.ts` |
| `GET /admin/me` | `GET /me` | 90% | `/admin-dashboard/src/hook/useAdminUser.ts` |
| `GET /features` | `GET /fee` | 61% | `/admin-dashboard/src/hook/useFeatures.ts` |
| `POST /api/leads/captain` | `GET /admin/vendors/pending` | 55% | `/admin-dashboard/src/landing/pages/BecomeCaptainPage.tsx` |
| `ANY /api/leads/captain` | `GET /admin/vendors/pending` | 55% | `/admin-dashboard/src/landing/pages/BecomeCaptainPage.tsx` |
| `POST /api/support/contact` | `GET /support/stats` | 70% | `/admin-dashboard/src/landing/pages/ContactPage.tsx` |
| `ANY /api/support/contact` | `GET /support/stats` | 70% | `/admin-dashboard/src/landing/pages/ContactPage.tsx` |
| `POST /api/leads/merchant` | `POST /merchants` | 62% | `/admin-dashboard/src/landing/pages/ForMerchantsPage.tsx` |
| `ANY /api/leads/merchant` | `POST /merchants` | 62% | `/admin-dashboard/src/landing/pages/ForMerchantsPage.tsx` |
| `GET /admin/vendors` | `POST /vendors` | 90% | `/admin-dashboard/src/pages/admin/AdminVendorCreatePage.tsx` |
| `GET /delivery/stores` | `PATCH /delivery-address` | 72% | `/admin-dashboard/src/pages/admin/AdminVendorCreatePage.tsx` |
| `POST /vendor` | `POST /vendors` | 93% | `/admin-dashboard/src/pages/admin/AdminVendorCreatePage.tsx` |
| `GET /admin/settings/appearance` | `GET /admin/settings` | 73% | `/admin-dashboard/src/pages/admin/AppearanceSettingsPage.tsx` |
| `PUT /admin/settings/appearance` | `GET /admin/settings` | 73% | `/admin-dashboard/src/pages/admin/AppearanceSettingsPage.tsx` |
| `GET /admin/users/list` | `GET /admin/users` | 82% | `/admin-dashboard/src/pages/admin/UserManagement.tsx` |
| `GET /admin/modules` | `GET /admin/roles` | 84% | `/admin-dashboard/src/pages/admin/admins/api.ts` |
| `GET /admin/list` | `GET /admin/roles` | 78% | `/admin-dashboard/src/pages/admin/admins/api.ts` |
| `POST /admin/create` | `POST /admin/backup/create` | 78% | `/admin-dashboard/src/pages/admin/admins/api.ts` |
| `GET /finance/commissions/settings` | `GET /finance/commissions/stats/my` | 86% | `/admin-dashboard/src/pages/admin/finance/CommissionSettingsPage.tsx` |
| `GET /finance/commissions/audit-log` | `POST /finance/commissions` | 80% | `/admin-dashboard/src/pages/admin/finance/CommissionSettingsPage.tsx` |
| `POST /finance/commissions/settings` | `GET /finance/commissions/stats/my` | 86% | `/admin-dashboard/src/pages/admin/finance/CommissionSettingsPage.tsx` |
| `GET /admin/ops/drivers/realtime` | `GET /admin/drivers/{id}` | 69% | `/admin-dashboard/src/pages/admin/ops/OpsDriversDashboard.tsx` |
| `GET /admin/ops/heatmap` | `GET /admin/system/health` | 68% | `/admin-dashboard/src/pages/admin/ops/OpsDriversDashboard.tsx` |
| `GET /pricing-strategies` | `POST /merchants/categories` | 60% | `/admin-dashboard/src/pages/admin/pricing/PricingStrategiesPage.tsx` |
| `POST /pricing-strategies` | `POST /merchants/categories` | 60% | `/admin-dashboard/src/pages/admin/pricing/PricingStrategiesPage.tsx` |
| `GET /admin/support/stats` | `GET /support/stats` | 90% | `/admin-dashboard/src/pages/admin/support/SupportTicketsPage.tsx` |
| `POST /admin/support/tickets` | `POST /support/tickets` | 90% | `/admin-dashboard/src/pages/admin/support/SupportTicketsPage.tsx` |
| `GET /admin/audit-logs/stats` | `GET /admin/audit-logs` | 85% | `/admin-dashboard/src/pages/admin/system/AuditLogPage.tsx` |
| `GET /admin/audit-logs/my-actions?limit=3` | `GET /admin/audit-logs/{id}` | 65% | `/admin-dashboard/src/pages/admin/system/AuditLogPage.tsx` |
| `POST /admin/vendors` | `POST /vendors` | 90% | `/admin-dashboard/src/pages/admin/vendors/VendorsManagement.tsx` |
| `GET /delivery/banners/admin` | `PATCH /delivery-address` | 55% | `/admin-dashboard/src/pages/delivery/DeliveryBannersPage.tsx` |
| `GET /delivery/categories` | `GET /categories` | 70% | `/admin-dashboard/src/pages/delivery/DeliveryBannersPage.tsx` |
| `POST /delivery/categories/bulk-reorder` | `—` | 0% | `/admin-dashboard/src/pages/delivery/DeliveryCategoriesPage.tsx` |
| `GET /admin/drivers/attendance` | `GET /admin/drivers/{id}/attendance` | 90% | `/admin-dashboard/src/pages/drivers/DriversList.tsx` |
| `GET /admin/driver-assets` | `DELETE /admin/drivers/assets/{id}` | 82% | `/admin-dashboard/src/pages/drivers/tabs/Assets.tsx` |
| `GET /admin/drivers/docs` | `GET /admin/drivers` | 84% | `/admin-dashboard/src/pages/drivers/tabs/Documents.tsx` |
| `GET /admin/driver-payouts` | `GET /admin/drivers` | 80% | `/admin-dashboard/src/pages/drivers/tabs/Finance.tsx` |
| `GET /admin/driver-shifts` | `DELETE /admin/drivers/shifts/{id}` | 82% | `/admin-dashboard/src/pages/drivers/tabs/Shifts.tsx` |
| `POST /marketing/adspend/upload` | `POST /marketer/files/upload` | 68% | `/admin-dashboard/src/pages/marketing/AdSpendUpload.tsx` |
| `POST /segments/preview` | `GET /stats/overview` | 62% | `/admin-dashboard/src/pages/marketing/Segments.tsx` |
| `POST /segments/sync` | `GET /metrics/json` | 59% | `/admin-dashboard/src/pages/marketing/Segments.tsx` |
| `GET /accounts/chart?onlyLeaf=1` | `DELETE /accounts/chart/{id}` | 65% | `/admin-dashboard/src/pages/money/JournalEntries.tsx` |
| `GET /partners` | `GET /transfers` | 63% | `/admin-dashboard/src/pages/parteners/PartnerDetails.tsx` |
| `POST /partners/upsert` | `POST /pin/set` | 58% | `/admin-dashboard/src/pages/parteners/PartnerDetails.tsx` |
| `GET /admin/dashboard/support-tickets` | `GET /admin/dashboard/live-metrics` | 68% | `/admin-dashboard/src/pages/support/Inbox.tsx` |
| `GET /support/reports/summary` | `POST /support/tickets` | 60% | `/admin-dashboard/src/pages/support/Reports.tsx` |
| `GET /accounts/chart` | `DELETE /accounts/chart/{id}` | 85% | `/admin-dashboard/src/services/chartAccount.api.ts` |
| `GET /accounts/chart/tree` | `DELETE /accounts/chart/{id}` | 80% | `/admin-dashboard/src/services/chartAccount.api.ts` |
| `POST /accounts/chart` | `DELETE /accounts/chart/{id}` | 85% | `/admin-dashboard/src/services/chartAccount.api.ts` |
| `POST /media/sign-upload` | `POST /marketer/files/upload` | 55% | `/admin-dashboard/src/services/uploadService.ts` |

### Action Items
- سد الفجوات (56) عبر: إنشاء نهايات BE مطابقة، أو تعديل مسارات FE إلى المقترحة، أو إضافة Proxy بـ `/api/v2/*`.
- توليد عميل TypeScript من OpenAPI، واستبدال النداءات اليدوية.
- إضافة اختبارات E2E لمسارات: تسجيل الدخول، الطلبات/الدفع، الإشعارات.
## app-user
- مسارات FE المميزة: **9**
- عدد نداءات FE: **9**
- تغطية FE→BE: **56%**
- فجوات غير مغطاة: **4**

| FE Call | Suggested BE | Confidence | FE File |
|---|---|---:|---|
| `ANY /api/orders` | `GET /order` | 70% | `/app-user/src/__tests__/integration/offline.test.ts` |
| `ANY /api/cart` | `POST /pin/change` | 60% | `/app-user/src/__tests__/integration/offline.test.ts` |
| `ANY /api/favorites/789` | `—` | 0% | `/app-user/src/__tests__/integration/offline.test.ts` |
| `ANY /api/topup` | `GET /pin/status` | 57% | `/app-user/src/__tests__/screens/wallet/Topup/GamePackagesScreen.test.tsx` |

### Action Items
- سد الفجوات (4) عبر: إنشاء نهايات BE مطابقة، أو تعديل مسارات FE إلى المقترحة، أو إضافة Proxy بـ `/api/v2/*`.
- توليد عميل TypeScript من OpenAPI، واستبدال النداءات اليدوية.
- إضافة اختبارات E2E لمسارات: تسجيل الدخول، الطلبات/الدفع، الإشعارات.
## bthwani-web
- مسارات FE المميزة: **5**
- عدد نداءات FE: **5**
- تغطية FE→BE: **20%**
- فجوات غير مغطاة: **4**

| FE Call | Suggested BE | Confidence | FE File |
|---|---|---:|---|
| `POST /notifications/register` | `GET /notifications/preferences` | 77% | `/bthwani-web/src/api/notifications.ts` |
| `POST /payments/create-session` | `POST /merchants/categories` | 57% | `/bthwani-web/src/api/payments.ts` |
| `POST /payments/confirm` | `GET /api/v2/payments/holds/my` | 57% | `/bthwani-web/src/api/payments.ts` |
| `ANY /api/placeholder/300/200` | `—` | 0% | `/bthwani-web/src/pages/delivery/Deals.tsx` |

### Action Items
- سد الفجوات (4) عبر: إنشاء نهايات BE مطابقة، أو تعديل مسارات FE إلى المقترحة، أو إضافة Proxy بـ `/api/v2/*`.
- توليد عميل TypeScript من OpenAPI، واستبدال النداءات اليدوية.
- إضافة اختبارات E2E لمسارات: تسجيل الدخول، الطلبات/الدفع، الإشعارات.
## field-marketers
- مسارات FE المميزة: **0**
- عدد نداءات FE: **0**
- تغطية FE→BE: **0%**
- فجوات غير مغطاة: **0**

لا فجوات.

### Action Items
- سد الفجوات (0) عبر: إنشاء نهايات BE مطابقة، أو تعديل مسارات FE إلى المقترحة، أو إضافة Proxy بـ `/api/v2/*`.
- توليد عميل TypeScript من OpenAPI، واستبدال النداءات اليدوية.
- إضافة اختبارات E2E لمسارات: تسجيل الدخول، الطلبات/الدفع، الإشعارات.
## rider-app
- مسارات FE المميزة: **20**
- عدد نداءات FE: **21**
- تغطية FE→BE: **60%**
- فجوات غير مغطاة: **8**

| FE Call | Suggested BE | Confidence | FE File |
|---|---|---:|---|
| `GET /drivers/me` | `POST /drivers` | 84% | `/rider-app/app/(driver)/locations.tsx` |
| `POST /drivers/locations` | `PATCH /drivers/location` | 97% | `/rider-app/app/(driver)/locations.tsx` |
| `ANY /api/v1/driver/sos` | `GET /admin/drivers` | 68% | `/rider-app/app/(driver)/triggerSOS.ts` |
| `GET /akhdimni/driver/my-errands` | `GET /driver/my-errands` | 80% | `/rider-app/src/api/akhdimni.ts` |
| `POST /driver/login` | `PATCH /drivers/location` | 80% | `/rider-app/src/api/auth.ts` |
| `GET /drivers/withdrawals/my` | `GET /admin/withdrawals` | 73% | `/rider-app/src/api/driver.ts` |
| `POST /drivers/withdrawals/request` | `POST /withdraw/request` | 75% | `/rider-app/src/api/driver.ts` |
| `POST /rides/sos` | `GET /metrics/json` | 60% | `/rider-app/src/componant/triggerSOS.tsx` |

### Action Items
- سد الفجوات (8) عبر: إنشاء نهايات BE مطابقة، أو تعديل مسارات FE إلى المقترحة، أو إضافة Proxy بـ `/api/v2/*`.
- توليد عميل TypeScript من OpenAPI، واستبدال النداءات اليدوية.
- إضافة اختبارات E2E لمسارات: تسجيل الدخول، الطلبات/الدفع، الإشعارات.
## vendor-app
- مسارات FE المميزة: **4**
- عدد نداءات FE: **4**
- تغطية FE→BE: **25%**
- فجوات غير مغطاة: **3**

| FE Call | Suggested BE | Confidence | FE File |
|---|---|---:|---|
| `ANY /api/users` | `GET /admin/users` | 81% | `/vendor-app/__tests__/utils/auth.test.js` |
| `ANY /api/../users` | `GET /admin/users` | 72% | `/vendor-app/__tests__/utils/auth.test.js` |
| `POST /vendor/auth/vendor-login` | `GET /vendors/dashboard/overview` | 57% | `/vendor-app/src/screens/LoginScreen.tsx` |

### Action Items
- سد الفجوات (3) عبر: إنشاء نهايات BE مطابقة، أو تعديل مسارات FE إلى المقترحة، أو إضافة Proxy بـ `/api/v2/*`.
- توليد عميل TypeScript من OpenAPI، واستبدال النداءات اليدوية.
- إضافة اختبارات E2E لمسارات: تسجيل الدخول، الطلبات/الدفع، الإشعارات.