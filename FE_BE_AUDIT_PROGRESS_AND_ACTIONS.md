# BTW-CORE — تدقيق تقدّم الترابط FE⇄BE + خطة عمل مُفصّلة

- التاريخ: **2025-10-23 16:27 UTC**
- الجذر المفحوص: `/mnt/data/src_latest/bthwani-project-main`

## ملخص تنفيذي
- Backends: **1** | Frontends: **6**
- نهايات BE: **635** | مسارات FE الفريدة: **120** | نداءات FE: **141**
- فجوات FE→BE: **105** | BE Orphans: **600** | Duplicates: **0**

### قياس التقدّم مقابل الأساس السابق
- لا تتوفر بيانات سابقة، يعتمد هذا التقرير كأساس جديد.

## ازدواجيات في الباك إند
- لا توجد.

## نهايات BE غير مستخدمة (عينة)
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
| PATCH | `/admin/drivers/{id}/leave-balance/adjust` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/quality/metrics` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/settings` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| PATCH | `/admin/settings` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/settings/feature-flags` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| PATCH | `/admin/settings/feature-flags/{flag}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/backup/create` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/backup/list` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/backup/{id}/restore` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/backup/{id}/download` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/data-deletion/requests` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| PATCH | `/admin/data-deletion/{id}/approve` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| PATCH | `/admin/data-deletion/{id}/reject` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/security/password-attempts` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/security/reset-password/{userId}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/security/unlock-account/{userId}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/marketers` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/marketers/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/marketers` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| PATCH | `/admin/marketers/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/marketers/{id}/performance` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/marketers/{id}/stores` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/marketers/{id}/activate` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| POST | `/admin/marketers/{id}/deactivate` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/marketers/statistics` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/marketers/export` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/audit-logs` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/audit-logs/{id}` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/system/health` | `/backend-nest/src/modules/admin/admin.controller.ts` |
| GET | `/admin/system/metrics` | `/backend-nest/src/modules/admin/admin.controller.ts` |

… (+520 أخرى)


## تحليل حسب كل واجهة (مع أسباب وFix لكل نقطة)

### admin-dashboard
- التغطية: **11%** | مسارات: **74** | فجوات: **80**

| FE Call | التصنيف | Suggested BE | ثقة | ملف FE | السبب | التصحيح المقترح (ضمان 100%) |
|---|---|---|---:|---|---|---|
| `ANY /api/content/latest` | next_api_route_or_proxy | `GET /content/pages` | 72% | `/admin-dashboard/public/sw.js` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `ANY /api/content/latest` | next_api_route_or_proxy | `GET /content/pages` | 72% | `/admin-dashboard/public/sw.js` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `GET /admin/notifications/campaigns` | admin_prefix_mismatch | `GET /notifications/my` | 68% | `/admin-dashboard/src/api/adminNotifications.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /admin/notifications/campaigns` | admin_prefix_mismatch | `GET /notifications/my` | 68% | `/admin-dashboard/src/api/adminNotifications.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/notifications/templates` | admin_prefix_mismatch | `GET /notifications/my` | 68% | `/admin-dashboard/src/api/adminNotifications.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /admin/notifications/templates` | admin_prefix_mismatch | `GET /notifications/my` | 68% | `/admin-dashboard/src/api/adminNotifications.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/modules` | admin_prefix_mismatch | `GET /admin/roles` | 84% | `/admin-dashboard/src/api/adminUsers.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/amani` | admin_prefix_mismatch | `POST /amani` | 90% | `/admin-dashboard/src/api/amani.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/arabon` | admin_prefix_mismatch | `POST /arabon` | 90% | `/admin-dashboard/src/api/arabon.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /auth/login` | generic_gap | `GET /catalog` | 63% | `/admin-dashboard/src/api/client-example.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /admin/drivers/finance` | admin_prefix_mismatch | `POST /admin/drivers/{id}/unban` | 80% | `/admin-dashboard/src/api/driverFinance.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /admin/drivers/finance/run` | admin_prefix_mismatch | `GET /admin/drivers/{id}/financials` | 75% | `/admin-dashboard/src/api/driverFinance.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/es3afni` | admin_prefix_mismatch | `POST /es3afni` | 90% | `/admin-dashboard/src/api/es3afni.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/kawader` | admin_prefix_mismatch | `POST /kawader` | 90% | `/admin-dashboard/src/api/kawader.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/kawader/stats/overview` | admin_prefix_mismatch | `GET /promotions/stats/overview` | 69% | `/admin-dashboard/src/api/kawader.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/kenz` | admin_prefix_mismatch | `POST /kenz` | 90% | `/admin-dashboard/src/api/kenz.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/kenz/stats/overview` | admin_prefix_mismatch | `GET /stats/overview` | 73% | `/admin-dashboard/src/api/kenz.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/maarouf` | admin_prefix_mismatch | `POST /maarouf` | 90% | `/admin-dashboard/src/api/maarouf.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/maarouf/stats/overview` | admin_prefix_mismatch | `GET /stats/overview` | 68% | `/admin-dashboard/src/api/maarouf.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/payments` | admin_prefix_mismatch | `GET /admin/marketers` | 70% | `/admin-dashboard/src/api/payments.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/payments/stats/overview` | admin_prefix_mismatch | `GET /promotions/stats/overview` | 71% | `/admin-dashboard/src/api/payments.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/sanad` | admin_prefix_mismatch | `GET /admin/errands` | 76% | `/admin-dashboard/src/api/sanad.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/sanad/stats/overview` | admin_prefix_mismatch | `GET /promotions/stats/overview` | 75% | `/admin-dashboard/src/api/sanad.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/me` | admin_prefix_mismatch | `GET /me` | 90% | `/admin-dashboard/src/hook/useAdminUser.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /features` | generic_gap | `GET /fee` | 61% | `/admin-dashboard/src/hook/useFeatures.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /api/leads/captain` | next_api_route_or_proxy | `GET /admin/vendors/pending` | 55% | `/admin-dashboard/src/landing/pages/BecomeCaptainPage.tsx` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `ANY /api/leads/captain` | next_api_route_or_proxy | `GET /admin/vendors/pending` | 55% | `/admin-dashboard/src/landing/pages/BecomeCaptainPage.tsx` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `POST /api/support/contact` | next_api_route_or_proxy | `GET /support/stats` | 70% | `/admin-dashboard/src/landing/pages/ContactPage.tsx` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `ANY /api/support/contact` | next_api_route_or_proxy | `GET /support/stats` | 70% | `/admin-dashboard/src/landing/pages/ContactPage.tsx` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `POST /api/leads/merchant` | next_api_route_or_proxy | `POST /merchants` | 62% | `/admin-dashboard/src/landing/pages/ForMerchantsPage.tsx` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `ANY /api/leads/merchant` | next_api_route_or_proxy | `POST /merchants` | 62% | `/admin-dashboard/src/landing/pages/ForMerchantsPage.tsx` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `GET /admin/vendors` | admin_prefix_mismatch | `POST /vendors` | 90% | `/admin-dashboard/src/pages/admin/AdminVendorCreatePage.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /delivery/stores` | generic_gap | `PATCH /delivery-address` | 72% | `/admin-dashboard/src/pages/admin/AdminVendorCreatePage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /vendor` | generic_gap | `POST /vendors` | 93% | `/admin-dashboard/src/pages/admin/AdminVendorCreatePage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /admin/settings/appearance` | admin_prefix_mismatch | `GET /admin/settings` | 73% | `/admin-dashboard/src/pages/admin/AppearanceSettingsPage.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `PUT /admin/settings/appearance` | admin_prefix_mismatch | `GET /admin/settings` | 73% | `/admin-dashboard/src/pages/admin/AppearanceSettingsPage.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/users/list` | admin_prefix_mismatch | `GET /admin/users` | 82% | `/admin-dashboard/src/pages/admin/UserManagement.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/modules` | admin_prefix_mismatch | `GET /admin/roles` | 84% | `/admin-dashboard/src/pages/admin/admins/api.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/list` | admin_prefix_mismatch | `GET /admin/roles` | 78% | `/admin-dashboard/src/pages/admin/admins/api.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /admin/create` | admin_prefix_mismatch | `POST /admin/backup/create` | 78% | `/admin-dashboard/src/pages/admin/admins/api.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /admin/commission-plans` | admin_prefix_mismatch | `GET /finance/commission-plans` | 83% | `/admin-dashboard/src/pages/admin/commission/useCommissionPlans.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /finance/commissions/settings` | generic_gap | `GET /finance/commissions/stats/my` | 86% | `/admin-dashboard/src/pages/admin/finance/CommissionSettingsPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /finance/commissions/audit-log` | generic_gap | `POST /finance/commissions` | 80% | `/admin-dashboard/src/pages/admin/finance/CommissionSettingsPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /finance/commissions/settings` | generic_gap | `GET /finance/commissions/stats/my` | 86% | `/admin-dashboard/src/pages/admin/finance/CommissionSettingsPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /admin/wallet/coupons` | admin_prefix_mismatch | `GET /wallet/coupons/my` | 76% | `/admin-dashboard/src/pages/admin/marketing/AdminCouponsPage.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /wallet/coupons` | generic_gap | `GET /wallet/coupons/my` | 90% | `/admin-dashboard/src/pages/admin/marketing/AdminCouponsPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /admin/pending-activations` | admin_prefix_mismatch | `POST /admin/stores/{id}/activate` | 60% | `/admin-dashboard/src/pages/admin/onboarding/usePendingActivations.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /delivery/stores` | generic_gap | `PATCH /delivery-address` | 72% | `/admin-dashboard/src/pages/admin/onboarding/usePendingActivations.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /admin/vendors` | admin_prefix_mismatch | `POST /vendors` | 90% | `/admin-dashboard/src/pages/admin/onboarding/usePendingActivations.ts` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/ops/drivers/realtime` | admin_prefix_mismatch | `GET /admin/drivers/{id}` | 69% | `/admin-dashboard/src/pages/admin/ops/OpsDriversDashboard.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/ops/heatmap` | admin_prefix_mismatch | `GET /admin/system/health` | 68% | `/admin-dashboard/src/pages/admin/ops/OpsDriversDashboard.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /pricing-strategies` | generic_gap | `POST /merchants/categories` | 60% | `/admin-dashboard/src/pages/admin/pricing/PricingStrategiesPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /pricing-strategies` | generic_gap | `POST /merchants/categories` | 60% | `/admin-dashboard/src/pages/admin/pricing/PricingStrategiesPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /reports/marketers/overview` | generic_gap | `GET /marketer/overview` | 80% | `/admin-dashboard/src/pages/admin/reports/useMarketerReports.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /admin/support/stats` | admin_prefix_mismatch | `GET /support/stats` | 90% | `/admin-dashboard/src/pages/admin/support/SupportTicketsPage.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /admin/support/tickets` | admin_prefix_mismatch | `POST /support/tickets` | 90% | `/admin-dashboard/src/pages/admin/support/SupportTicketsPage.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/audit-logs/stats` | admin_prefix_mismatch | `GET /admin/audit-logs` | 85% | `/admin-dashboard/src/pages/admin/system/AuditLogPage.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/audit-logs/my-actions?limit=3` | admin_prefix_mismatch | `GET /admin/audit-logs/{id}` | 65% | `/admin-dashboard/src/pages/admin/system/AuditLogPage.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /admin/vendors` | admin_prefix_mismatch | `POST /vendors` | 90% | `/admin-dashboard/src/pages/admin/vendors/VendorsManagement.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /delivery/banners/admin` | generic_gap | `PATCH /delivery-address` | 55% | `/admin-dashboard/src/pages/delivery/DeliveryBannersPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /delivery/categories` | generic_gap | `GET /categories` | 70% | `/admin-dashboard/src/pages/delivery/DeliveryBannersPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /delivery/categories/bulk-reorder` | generic_gap | `—` | 0% | `/admin-dashboard/src/pages/delivery/DeliveryCategoriesPage.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /admin/drivers/attendance` | admin_prefix_mismatch | `GET /admin/drivers/{id}/attendance` | 90% | `/admin-dashboard/src/pages/drivers/DriversList.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/driver-assets` | admin_prefix_mismatch | `DELETE /admin/drivers/assets/{id}` | 82% | `/admin-dashboard/src/pages/drivers/tabs/Assets.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/drivers/docs` | admin_prefix_mismatch | `GET /admin/drivers` | 84% | `/admin-dashboard/src/pages/drivers/tabs/Documents.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/driver-payouts` | admin_prefix_mismatch | `GET /admin/drivers` | 80% | `/admin-dashboard/src/pages/drivers/tabs/Finance.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/driver-shifts` | admin_prefix_mismatch | `DELETE /admin/drivers/shifts/{id}` | 82% | `/admin-dashboard/src/pages/drivers/tabs/Shifts.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /admin/drivers/vacations/stats` | admin_prefix_mismatch | `POST /drivers/vacations/request` | 75% | `/admin-dashboard/src/pages/drivers/tabs/Vacations.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `POST /marketing/adspend/upload` | generic_gap | `POST /marketer/files/upload` | 68% | `/admin-dashboard/src/pages/marketing/AdSpendUpload.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /segments/preview` | generic_gap | `GET /stats/overview` | 62% | `/admin-dashboard/src/pages/marketing/Segments.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /segments/sync` | generic_gap | `GET /metrics/json` | 59% | `/admin-dashboard/src/pages/marketing/Segments.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /accounts/chart?onlyLeaf=1` | generic_gap | `DELETE /accounts/chart/{id}` | 65% | `/admin-dashboard/src/pages/money/JournalEntries.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /partners` | generic_gap | `GET /transfers` | 63% | `/admin-dashboard/src/pages/parteners/PartnerDetails.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /partners/upsert` | generic_gap | `POST /pin/set` | 58% | `/admin-dashboard/src/pages/parteners/PartnerDetails.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /admin/dashboard/support-tickets` | admin_prefix_mismatch | `GET /admin/dashboard/alerts` | 72% | `/admin-dashboard/src/pages/support/Inbox.tsx` | بادئة /admin غير متاحة أو مختلفة في BE. | انسخ عقود BE الفعلية (orders-by-status/revenue) أو أنشئ نهايات مطابقة لمسارات FE وثّقها. |
| `GET /support/reports/summary` | generic_gap | `POST /support/tickets` | 60% | `/admin-dashboard/src/pages/support/Reports.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /accounts/chart` | generic_gap | `DELETE /accounts/chart/{id}` | 85% | `/admin-dashboard/src/services/chartAccount.api.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /accounts/chart/tree` | generic_gap | `DELETE /accounts/chart/{id}` | 80% | `/admin-dashboard/src/services/chartAccount.api.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /accounts/chart` | generic_gap | `DELETE /accounts/chart/{id}` | 85% | `/admin-dashboard/src/services/chartAccount.api.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /media/sign-upload` | generic_gap | `POST /marketer/files/upload` | 55% | `/admin-dashboard/src/services/uploadService.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |

**Action Items للتطبيق**
- تبنّي SDK مولّد من OpenAPI ومنع النداءات اليدوية (ESLint rule).
- E2E على الرحلات الحرجة وربط النتائج ببوابة Parity في CI.
- تثبيت `API_BASE` للبيئة الإنتاجية أثناء الفحص لمنع Proxy المحلي.

### app-user
- التغطية: **50%** | مسارات: **10** | فجوات: **6**

| FE Call | التصنيف | Suggested BE | ثقة | ملف FE | السبب | التصحيح المقترح (ضمان 100%) |
|---|---|---|---:|---|---|---|
| `ANY /api/orders` | next_api_route_or_proxy | `GET /order` | 70% | `/app-user/src/__tests__/integration/offline.test.ts` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `ANY /api/cart` | next_api_route_or_proxy | `POST /pin/change` | 60% | `/app-user/src/__tests__/integration/offline.test.ts` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `ANY /api/favorites/789` | next_api_route_or_proxy | `—` | 0% | `/app-user/src/__tests__/integration/offline.test.ts` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `ANY /api/topup` | next_api_route_or_proxy | `GET /pin/status` | 57% | `/app-user/src/__tests__/screens/wallet/Topup/GamePackagesScreen.test.tsx` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `GET /users/me` | generic_gap | `GET /vendors/me` | 70% | `/app-user/src/context/verify.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `DELETE /users/me` | generic_gap | `GET /vendors/me` | 70% | `/app-user/src/screens/profile/UserProfileScreen.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |

**Action Items للتطبيق**
- تبنّي SDK مولّد من OpenAPI ومنع النداءات اليدوية (ESLint rule).
- E2E على الرحلات الحرجة وربط النتائج ببوابة Parity في CI.
- تثبيت `API_BASE` للبيئة الإنتاجية أثناء الفحص لمنع Proxy المحلي.

### bthwani-web
- التغطية: **33%** | مسارات: **6** | فجوات: **4**

| FE Call | التصنيف | Suggested BE | ثقة | ملف FE | السبب | التصحيح المقترح (ضمان 100%) |
|---|---|---|---:|---|---|---|
| `POST /notifications/register` | generic_gap | `GET /notifications/preferences` | 77% | `/bthwani-web/src/api/notifications.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /payments/create-session` | payments_version_prefix | `POST /merchants/categories` | 57% | `/bthwani-web/src/api/payments.ts` | الـFE يستخدم /payments بينما BE تحت /api/vN/payments. | حدّث FE إلى `/api/v2/payments/*` أو أضف Redirect 308 وتحديث OAS. |
| `POST /payments/confirm` | payments_version_prefix | `GET /api/v2/payments/holds/my` | 57% | `/bthwani-web/src/api/payments.ts` | الـFE يستخدم /payments بينما BE تحت /api/vN/payments. | حدّث FE إلى `/api/v2/payments/*` أو أضف Redirect 308 وتحديث OAS. |
| `ANY /api/placeholder/300/200` | next_api_route_or_proxy | `—` | 0% | `/bthwani-web/src/pages/delivery/Deals.tsx` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |

**Action Items للتطبيق**
- تبنّي SDK مولّد من OpenAPI ومنع النداءات اليدوية (ESLint rule).
- E2E على الرحلات الحرجة وربط النتائج ببوابة Parity في CI.
- تثبيت `API_BASE` للبيئة الإنتاجية أثناء الفحص لمنع Proxy المحلي.

### field-marketers
- التغطية: **33%** | مسارات: **6** | فجوات: **4**

| FE Call | التصنيف | Suggested BE | ثقة | ملف FE | السبب | التصحيح المقترح (ضمان 100%) |
|---|---|---|---:|---|---|---|
| `GET /auth/me` | generic_gap | `GET /health/metrics` | 60% | `/field-marketers/src/context/AuthContext.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /auth/delete-account/request` | generic_gap | `POST /vendors/account/delete-request` | 64% | `/field-marketers/src/screens/account/ProfileScreen.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `DELETE /auth/delete-account` | generic_gap | `DELETE /legal/account` | 58% | `/field-marketers/src/screens/account/ProfileScreen.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /field/quick-onboard` | generic_gap | `POST /onboarding/quick-onboard` | 71% | `/field-marketers/src/screens/onboarding/OnboardingWizardScreen.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |

**Action Items للتطبيق**
- تبنّي SDK مولّد من OpenAPI ومنع النداءات اليدوية (ESLint rule).
- E2E على الرحلات الحرجة وربط النتائج ببوابة Parity في CI.
- تثبيت `API_BASE` للبيئة الإنتاجية أثناء الفحص لمنع Proxy المحلي.

### rider-app
- التغطية: **60%** | مسارات: **20** | فجوات: **8**

| FE Call | التصنيف | Suggested BE | ثقة | ملف FE | السبب | التصحيح المقترح (ضمان 100%) |
|---|---|---|---:|---|---|---|
| `GET /drivers/me` | generic_gap | `POST /drivers` | 84% | `/rider-app/app/(driver)/locations.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /drivers/locations` | generic_gap | `PATCH /drivers/location` | 97% | `/rider-app/app/(driver)/locations.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `ANY /api/v1/driver/sos` | next_api_route_or_proxy | `GET /admin/drivers` | 68% | `/rider-app/app/(driver)/triggerSOS.ts` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `GET /akhdimni/driver/my-errands` | generic_gap | `GET /driver/my-errands` | 80% | `/rider-app/src/api/akhdimni.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /driver/login` | generic_gap | `PATCH /drivers/location` | 80% | `/rider-app/src/api/auth.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `GET /drivers/withdrawals/my` | generic_gap | `GET /admin/withdrawals` | 73% | `/rider-app/src/api/driver.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /drivers/withdrawals/request` | generic_gap | `POST /withdraw/request` | 75% | `/rider-app/src/api/driver.ts` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |
| `POST /rides/sos` | generic_gap | `GET /metrics/json` | 60% | `/rider-app/src/componant/triggerSOS.tsx` | غياب توثيق/تنفيذ BE لهذا المسار. | أنشئ/عدّل نهاية BE، أضفها إلى OAS، وأعد توليد SDK ثم حدث FE. |

**Action Items للتطبيق**
- تبنّي SDK مولّد من OpenAPI ومنع النداءات اليدوية (ESLint rule).
- E2E على الرحلات الحرجة وربط النتائج ببوابة Parity في CI.
- تثبيت `API_BASE` للبيئة الإنتاجية أثناء الفحص لمنع Proxy المحلي.

### vendor-app
- التغطية: **25%** | مسارات: **4** | فجوات: **3**

| FE Call | التصنيف | Suggested BE | ثقة | ملف FE | السبب | التصحيح المقترح (ضمان 100%) |
|---|---|---|---:|---|---|---|
| `ANY /api/users` | next_api_route_or_proxy | `GET /admin/users` | 81% | `/vendor-app/__tests__/utils/auth.test.js` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `ANY /api/../users` | next_api_route_or_proxy | `GET /admin/users` | 72% | `/vendor-app/__tests__/utils/auth.test.js` | المسار يضرب API محلية/Proxy وليس BE الإنتاجي. | اربط إلى Gateway الرسمي `/api/v2/*`، وثّق في OAS، وولّد SDK للواجهة. |
| `POST /vendor/auth/vendor-login` | vendor_auth_mismatch | `GET /vendors/dashboard/overview` | 57% | `/vendor-app/src/screens/LoginScreen.tsx` | لا توجد نهاية مكافئة لمصادقة البائع في BE. | أضف `POST /vendors/auth/login` أو عدّل FE لاستخدام نهاية BE القائمة، ثم حدث SDK. |

**Action Items للتطبيق**
- تبنّي SDK مولّد من OpenAPI ومنع النداءات اليدوية (ESLint rule).
- E2E على الرحلات الحرجة وربط النتائج ببوابة Parity في CI.
- تثبيت `API_BASE` للبيئة الإنتاجية أثناء الفحص لمنع Proxy المحلي.

## خطة تنفيذ شاملة لإغلاق 100%
| المجال | المهمة | المالك | الموعد |
|---|---|---|---|
| Contracts | توحيد `openapi.yaml` + Spectral + Error taxonomy + Idempotency/Webhooks. | @BE | +5d |
| Parity Gate | حارس `parity_gap≤5%` و`undocumented=0` في CI. | @Ops | +4d |
| SDK Rollout | توليد ودمج SDK في كل واجهة مع قواعد ESLint. | @FE | +5d |
| Admin/Payments/Vendor | إغلاق الفجوات المحددة في الجدول أعلاه. | @BE/@FE | +4d |
| Runtime Tap | تسجيل requests.csv من Staging وتدقيق أسبوعي. | @SRE | +3d |
| Governance | استثناءات زمنية قصيرة مع انتهاء تلقائي لحين الإكمال. | @Sec/@CTO | +1d |