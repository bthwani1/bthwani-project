# جدول تفصيلي لحالة كل Endpoint في Admin Module

## 📝 دليل الرموز

| الرمز | المعنى | الإجراء المطلوب |
|------|--------|------------------|
| ✅ | مكتمل وجاهز | لا يوجد |
| ⚠️ | يحتاج إكمال | تكملة المنطق + Entity |
| 🔄 | مكرر | دمج أو حذف |
| ❌ | غير آمن/منطقي | مراجعة أو إزالة |
| 🔴 | أولوية حرجة | البدء فوراً |
| 🟠 | أولوية عالية | خلال أسبوع |
| 🟡 | أولوية متوسطة | خلال أسبوعين |

---

## 1️⃣ Dashboard & Statistics

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 1 | GET | `/admin/dashboard` | ✅ | - | - | مكتمل |
| 2 | GET | `/admin/stats/today` | ✅ | - | - | مكتمل |
| 3 | GET | `/admin/stats/financial` | ✅ | - | - | مكتمل |
| 4 | GET | `/admin/dashboard/orders-by-status` | ✅ | - | - | مكتمل |
| 5 | GET | `/admin/dashboard/revenue` | ✅ | - | - | يدعم daily/weekly/monthly |
| 6 | GET | `/admin/dashboard/live-metrics` | ✅ | - | - | مكتمل |

---

## 2️⃣ Drivers Management

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 7 | GET | `/admin/drivers` | ✅ | - | - | مكتمل مع pagination |
| 8 | GET | `/admin/drivers/:id` | ✅ | - | - | تفاصيل كاملة |
| 9 | GET | `/admin/drivers/:id/performance` | ✅ | - | - | مكتمل |
| 10 | GET | `/admin/drivers/:id/financials` | ✅ | - | - | مكتمل |
| 11 | POST | `/admin/drivers/:id/ban` | ✅ | - | - | مكتمل |
| 12 | POST | `/admin/drivers/:id/unban` | ✅ | - | - | مكتمل |
| 13 | PATCH | `/admin/drivers/:id/adjust-balance` | ✅ | - | - | مكتمل - TODO: add transaction record |
| 14 | GET | `/admin/drivers/:id/assets` | ⚠️ | DriverAsset | 🟡 | يحتاج Entity + منطق |
| 15 | POST | `/admin/drivers/assets` | ⚠️ | DriverAsset | 🟡 | يحتاج Entity + منطق |
| 16 | POST | `/admin/drivers/:driverId/assets/:assetId/assign` | ⚠️ | AssetAssignment | 🟡 | يحتاج Entity + منطق |
| 17 | POST | `/admin/drivers/:driverId/assets/:assetId/return` | ⚠️ | AssetAssignment | 🟡 | يحتاج Entity + منطق |
| 18 | GET | `/admin/drivers/:id/documents` | ✅ | - | - | مكتمل |
| 19 | POST | `/admin/drivers/:id/documents/:docId/verify` | ✅ | - | - | مكتمل |
| 20 | PATCH | `/admin/drivers/:id/documents/:docId` | ✅ | - | - | مكتمل |
| 21 | GET | `/admin/drivers/:id/attendance` | ⚠️ | use: er/Attendance | 🟠 | استخدام Entity موجود |
| 22 | GET | `/admin/drivers/attendance/summary` | ⚠️ | use: er/Attendance | 🟠 | استخدام Entity موجود |
| 23 | POST | `/admin/drivers/:id/attendance/adjust` | ⚠️ | use: er/Attendance | 🟠 | استخدام Entity موجود |
| 24 | GET | `/admin/shifts` | ⚠️ | DriverShift | 🟠 | يحتاج Entity جديد |
| 25 | POST | `/admin/shifts` | ⚠️ | DriverShift | 🟠 | يحتاج Entity جديد |
| 26 | PATCH | `/admin/shifts/:id` | ⚠️ | DriverShift | 🟠 | يحتاج Entity جديد |
| 27 | POST | `/admin/shifts/:shiftId/assign/:driverId` | ⚠️ | DriverShift | 🟠 | يحتاج Entity جديد |
| 28 | GET | `/admin/drivers/:id/shifts` | ⚠️ | DriverShift | 🟠 | يحتاج Entity جديد |
| 29 | GET | `/admin/drivers/leave-requests` | ⚠️ | use: er/LeaveRequest | 🟠 | استخدام Entity موجود |
| 30 | PATCH | `/admin/drivers/leave-requests/:id/approve` | ⚠️ | use: er/LeaveRequest | 🟠 | استخدام Entity موجود |
| 31 | PATCH | `/admin/drivers/leave-requests/:id/reject` | ⚠️ | use: er/LeaveRequest | 🟠 | استخدام Entity موجود |
| 32 | GET | `/admin/drivers/:id/leave-balance` | ⚠️ | use: er/LeaveRequest | 🟠 | استخدام Entity موجود |
| 33 | PATCH | `/admin/drivers/:id/leave-balance/adjust` | ⚠️ | use: er/LeaveRequest | 🟠 | استخدام Entity موجود |
| 34 | GET | `/admin/drivers/stats/top-performers` | 🔄 | - | - | يمكن من drivers + sort |
| 35 | GET | `/admin/drivers/stats/by-status` | ✅ | - | - | مكتمل |
| 36 | POST | `/admin/drivers/:id/payout/calculate` | 🔄 | - | - | موجود في finance module |

---

## 3️⃣ Withdrawals Management

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 37 | GET | `/admin/withdrawals` | ⚠️ | WithdrawalRequest | 🔴 | حرج للعمليات المالية |
| 38 | GET | `/admin/withdrawals/pending` | ⚠️ | WithdrawalRequest | 🔴 | حرج للعمليات المالية |
| 39 | PATCH | `/admin/withdrawals/:id/approve` | ⚠️ | WithdrawalRequest | 🔴 | حرج للعمليات المالية |
| 40 | PATCH | `/admin/withdrawals/:id/reject` | ⚠️ | WithdrawalRequest | 🔴 | حرج للعمليات المالية |

---

## 4️⃣ Store & Vendor Moderation

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 41 | GET | `/admin/stores/pending` | ✅ | - | - | مكتمل |
| 42 | POST | `/admin/stores/:id/approve` | ✅ | - | - | مكتمل |
| 43 | POST | `/admin/stores/:id/reject` | ✅ | - | - | مكتمل |
| 44 | POST | `/admin/stores/:id/suspend` | ✅ | - | - | مكتمل |
| 45 | GET | `/admin/vendors/pending` | ✅ | - | - | مكتمل |
| 46 | POST | `/admin/vendors/:id/approve` | ✅ | - | - | مكتمل |
| 47 | POST | `/admin/vendors/:id/reject` | ✅ | - | - | مكتمل |
| 48 | POST | `/admin/vendors/:id/suspend` | ✅ | - | - | مكتمل |
| 49 | GET | `/admin/stores/stats/top-performers` | 🔄 | - | - | يمكن من aggregation |
| 50 | GET | `/admin/stores/:id/orders-history` | ⚠️ | - | 🟡 | يحتاج تنفيذ |
| 51 | GET | `/admin/vendors/:id/settlements-history` | 🔄 | - | - | موجود في finance module |
| 52 | GET | `/admin/vendors/:id/financials` | 🔄 | - | - | موجود في finance module |

---

## 5️⃣ Users Management

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 53 | GET | `/admin/users` | ✅ | - | - | مكتمل مع search |
| 54 | GET | `/admin/users/:id` | ✅ | - | - | مكتمل |
| 55 | POST | `/admin/users/:id/ban` | ✅ | - | - | مكتمل |
| 56 | POST | `/admin/users/:id/unban` | ✅ | - | - | مكتمل |
| 57 | GET | `/admin/users/:id/wallet-history` | 🔄 | - | - | موجود في wallet module |
| 58 | GET | `/admin/users/:id/orders-history` | ✅ | - | - | مكتمل |
| 59 | PATCH | `/admin/users/:id/wallet/adjust` | 🔄 | - | - | موجود في wallet module |

---

## 6️⃣ Reports

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 60 | GET | `/admin/reports/daily` | ✅ | - | - | مكتمل |
| 61 | GET | `/admin/reports/weekly` | 🔄 | - | - | استخدام revenue analytics |
| 62 | GET | `/admin/reports/monthly` | 🔄 | - | - | استخدام revenue analytics |
| 63 | GET | `/admin/reports/export` | 🔄 | - | - | مكرر في endpoints أخرى |
| 64 | GET | `/admin/reports/drivers/performance` | 🔄 | - | - | مكرر مع drivers/:id/performance |
| 65 | GET | `/admin/reports/stores/performance` | 🔄 | - | - | يمكن دمجه |
| 66 | GET | `/admin/reports/financial/detailed` | 🔄 | - | - | مكرر مع stats/financial |
| 67 | GET | `/admin/reports/users/activity` | ✅ | - | - | مكتمل |

---

## 7️⃣ Notifications

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 68 | POST | `/admin/notifications/send-bulk` | ⚠️ | - | 🟠 | يحتاج Firebase/FCM integration |
| 69 | GET | `/admin/notifications/history` | 🔄 | - | - | موجود في notification module |
| 70 | GET | `/admin/notifications/stats` | 🔄 | - | - | موجود في notification module |

---

## 8️⃣ Quality & Reviews

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 71 | GET | `/admin/quality/reviews` | ⚠️ | QualityReview | 🟡 | يحتاج Entity + منطق |
| 72 | POST | `/admin/quality/reviews` | ⚠️ | QualityReview | 🟡 | يحتاج Entity + منطق |
| 73 | GET | `/admin/quality/metrics` | ✅ | - | - | مكتمل جزئياً |

---

## 9️⃣ Support Tickets

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 74 | GET | `/admin/support/tickets` | ⚠️ | SupportTicket | 🔴 | حرج لخدمة العملاء |
| 75 | PATCH | `/admin/support/tickets/:id/assign` | ⚠️ | SupportTicket | 🔴 | حرج لخدمة العملاء |
| 76 | PATCH | `/admin/support/tickets/:id/resolve` | ⚠️ | SupportTicket | 🔴 | حرج لخدمة العملاء |
| 77 | GET | `/admin/support/sla-metrics` | ⚠️ | SupportTicket | 🔴 | حرج لخدمة العملاء |

---

## 🔟 Settings & Feature Flags

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 78 | GET | `/admin/settings` | ⚠️ | AppSettings | 🟠 | يحتاج Entity + منطق |
| 79 | PATCH | `/admin/settings` | ⚠️ | AppSettings | 🟠 | يحتاج Entity + منطق |
| 80 | GET | `/admin/settings/feature-flags` | ⚠️ | FeatureFlag | 🟠 | يحتاج Entity + منطق |
| 81 | PATCH | `/admin/settings/feature-flags/:flag` | ⚠️ | FeatureFlag | 🟠 | يحتاج Entity + منطق |

---

## 1️⃣1️⃣ Backup System

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 82 | POST | `/admin/backup/create` | ⚠️ | BackupRecord | 🔴 | حرج للأمان |
| 83 | GET | `/admin/backup/list` | ⚠️ | BackupRecord | 🔴 | حرج للأمان |
| 84 | POST | `/admin/backup/:id/restore` | ⚠️ | BackupRecord | 🔴 | حرج للأمان - خطير |
| 85 | GET | `/admin/backup/:id/download` | ⚠️ | BackupRecord | 🔴 | حرج للأمان |

---

## 1️⃣2️⃣ Data Deletion (GDPR)

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 86 | GET | `/admin/data-deletion/requests` | ⚠️ | DataDeletionRequest | 🔴 | متطلب قانوني |
| 87 | PATCH | `/admin/data-deletion/:id/approve` | ⚠️ | DataDeletionRequest | 🔴 | متطلب قانوني |
| 88 | PATCH | `/admin/data-deletion/:id/reject` | ⚠️ | DataDeletionRequest | 🔴 | متطلب قانوني |

---

## 1️⃣3️⃣ Password Security

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 89 | GET | `/admin/security/password-attempts` | ⚠️ | LoginAttempt | 🟠 | يحتاج Entity + منطق |
| 90 | POST | `/admin/security/reset-password/:userId` | ✅ | - | - | مكتمل - TODO: send SMS |
| 91 | POST | `/admin/security/unlock-account/:userId` | ✅ | - | - | مكتمل |

---

## 1️⃣4️⃣ Activation Codes

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 92 | POST | `/admin/activation/generate` | ⚠️ | ActivationCode | 🟡 | يحتاج Entity + منطق |
| 93 | GET | `/admin/activation/codes` | ⚠️ | ActivationCode | 🟡 | يحتاج Entity + منطق |

---

## 1️⃣5️⃣ Marketer Management

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 94 | GET | `/admin/marketers` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 95 | GET | `/admin/marketers/:id` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 96 | POST | `/admin/marketers` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 97 | PATCH | `/admin/marketers/:id` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 98 | GET | `/admin/marketers/:id/performance` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 99 | GET | `/admin/marketers/:id/stores` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 100 | GET | `/admin/marketers/:id/commissions` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 101 | POST | `/admin/marketers/:id/activate` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 102 | POST | `/admin/marketers/:id/deactivate` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 103 | PATCH | `/admin/marketers/:id/adjust-commission` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 104 | GET | `/admin/marketers/statistics` | ⚠️ | use: Marketer ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 105 | GET | `/admin/marketers/export` | ⚠️ | use: Marketer ✅ | 🟡 | Entity موجود - يحتاج منطق |

---

## 1️⃣6️⃣ Onboarding Management

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 106 | GET | `/admin/onboarding/applications` | ⚠️ | use: Onboarding ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 107 | GET | `/admin/onboarding/:id/details` | ⚠️ | use: Onboarding ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 108 | PATCH | `/admin/onboarding/:id/approve` | ⚠️ | use: Onboarding ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 109 | PATCH | `/admin/onboarding/:id/reject` | ⚠️ | use: Onboarding ✅ | 🟠 | Entity موجود - يحتاج منطق |
| 110 | GET | `/admin/onboarding/statistics` | ⚠️ | use: Onboarding ✅ | 🟡 | Entity موجود - يحتاج منطق |

---

## 1️⃣7️⃣ Commission Plans

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 111 | GET | `/admin/commission-plans` | ⚠️ | use: CommissionPlan ✅ | 🟡 | Entity موجود - يحتاج منطق |
| 112 | POST | `/admin/commission-plans` | ⚠️ | use: CommissionPlan ✅ | 🟡 | Entity موجود - يحتاج منطق |
| 113 | PATCH | `/admin/commission-plans/:id` | ⚠️ | use: CommissionPlan ✅ | 🟡 | Entity موجود - يحتاج منطق |

---

## 1️⃣8️⃣ Admin Users

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 114 | GET | `/admin/admin-users` | ⚠️ | AdminUser or User | 🟡 | يمكن استخدام User + role |
| 115 | POST | `/admin/admin-users` | ⚠️ | AdminUser or User | 🟡 | يمكن استخدام User + role |
| 116 | PATCH | `/admin/admin-users/:id` | ⚠️ | AdminUser or User | 🟡 | يمكن استخدام User + role |
| 117 | POST | `/admin/admin-users/:id/reset-password` | ⚠️ | AdminUser or User | 🟡 | يمكن استخدام User + role |

---

## 1️⃣9️⃣ Audit Logs

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 118 | GET | `/admin/audit-logs` | ⚠️ | AuditLog | 🔴 | حرج للأمان والمراقبة |
| 119 | GET | `/admin/audit-logs/:id` | ⚠️ | AuditLog | 🔴 | حرج للأمان والمراقبة |

---

## 2️⃣0️⃣ System Health

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 120 | GET | `/admin/system/health` | ✅ | - | - | مكتمل |
| 121 | GET | `/admin/system/metrics` | ✅ | - | - | مكتمل |
| 122 | GET | `/admin/system/errors` | ⚠️ | ErrorLog | 🟡 | يحتاج نظام logging |

---

## 2️⃣1️⃣ Database Management

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 123 | GET | `/admin/database/stats` | ✅ | - | - | مكتمل |
| 124 | POST | `/admin/database/cleanup` | ❌ | - | - | خطير - يحتاج مراجعة |

---

## 2️⃣2️⃣ Payments

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 125 | GET | `/admin/payments` | ⚠️ | use: Transaction | 🟠 | استخدام finance module |
| 126 | GET | `/admin/payments/:id` | ⚠️ | use: Transaction | 🟠 | استخدام finance module |
| 127 | POST | `/admin/payments/:id/refund` | ⚠️ | use: Transaction | 🟠 | استخدام finance module |

---

## 2️⃣3️⃣ Promotions & Coupons

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 128 | GET | `/admin/promotions/active` | ⚠️ | use: Promotion ✅ | 🟡 | Entity موجود - يحتاج منطق |
| 129 | POST | `/admin/promotions/:id/pause` | ⚠️ | use: Promotion ✅ | 🟡 | Entity موجود - يحتاج منطق |
| 130 | POST | `/admin/promotions/:id/resume` | ⚠️ | use: Promotion ✅ | 🟡 | Entity موجود - يحتاج منطق |
| 131 | GET | `/admin/coupons/usage` | ⚠️ | Coupon | 🟡 | يحتاج aggregation |
| 132 | POST | `/admin/coupons/:code/deactivate` | ⚠️ | Coupon | 🟡 | يحتاج منطق |

---

## 2️⃣4️⃣ Orders Advanced

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 133 | GET | `/admin/orders/stats/by-city` | ✅ | - | - | مكتمل |
| 134 | GET | `/admin/orders/stats/by-payment-method` | ✅ | - | - | مكتمل |
| 135 | GET | `/admin/orders/disputed` | ⚠️ | - | 🟡 | يحتاج dispute field في Order |
| 136 | POST | `/admin/orders/:id/dispute/resolve` | ⚠️ | - | 🟡 | يحتاج dispute field في Order |

---

## 2️⃣5️⃣ Analytics Dashboard

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 137 | GET | `/admin/analytics/overview` | ⚠️ | - | 🟡 | يحتاج aggregations |
| 138 | GET | `/admin/analytics/trends` | ⚠️ | - | 🟡 | يحتاج aggregations |
| 139 | GET | `/admin/analytics/comparisons` | ⚠️ | - | 🟡 | يحتاج aggregations |

---

## 2️⃣6️⃣ Content Management (CMS)

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 140 | GET | `/admin/cms/pages` | ⚠️ | CMSPage | 🟡 | اختياري - يمكن استخدام حل خارجي |
| 141 | POST | `/admin/cms/pages` | ⚠️ | CMSPage | 🟡 | اختياري - يمكن استخدام حل خارجي |
| 142 | PATCH | `/admin/cms/pages/:id` | ⚠️ | CMSPage | 🟡 | اختياري - يمكن استخدام حل خارجي |

---

## 2️⃣7️⃣ Emergency Actions

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 143 | POST | `/admin/emergency/pause-system` | ❌ | - | - | خطير جداً - نقل لـ scripts |
| 144 | POST | `/admin/emergency/resume-system` | ❌ | - | - | خطير جداً - نقل لـ scripts |

---

## 2️⃣8️⃣ Export & Import

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 145 | GET | `/admin/export/all-data` | ❌ | - | - | خطير - تسريب بيانات |
| 146 | POST | `/admin/import/data` | ❌ | - | - | خطير - يفسد البيانات |

---

## 2️⃣9️⃣ Cache Management

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 147 | POST | `/admin/cache/clear` | ⚠️ | - | 🟡 | يحتاج Redis integration |
| 148 | GET | `/admin/cache/stats` | ⚠️ | - | 🟡 | يحتاج Redis integration |

---

## 3️⃣0️⃣ Roles & Permissions

| # | Method | Endpoint | الحالة | Entity مطلوب | الأولوية | ملاحظات |
|---|--------|----------|--------|--------------|----------|---------|
| 149 | GET | `/admin/roles` | ⚠️ | Role | 🟡 | يحتاج RBAC system |
| 150 | POST | `/admin/roles` | ⚠️ | Role | 🟡 | يحتاج RBAC system |
| 151 | PATCH | `/admin/roles/:id` | ⚠️ | Role | 🟡 | يحتاج RBAC system |

---

## 📊 الملخص الإحصائي

### حسب الحالة
- ✅ **مكتمل**: 35 endpoint (23%)
- ⚠️ **يحتاج إكمال**: 96 endpoint (64%)
- 🔄 **مكرر**: 15 endpoint (10%)
- ❌ **غير آمن**: 5 endpoint (3%)

### حسب الأولوية
- 🔴 **حرجة**: 16 endpoint
- 🟠 **عالية**: 42 endpoint
- 🟡 **متوسطة**: 38 endpoint

### Entities المطلوبة (جديدة)
1. WithdrawalRequest 🔴
2. SupportTicket 🔴
3. AuditLog 🔴
4. DataDeletionRequest 🔴
5. BackupRecord 🔴
6. DriverShift 🟠
7. AppSettings 🟠
8. FeatureFlag 🟠
9. LoginAttempt 🟠
10. DriverAsset 🟡
11. QualityReview 🟡
12. ActivationCode 🟡
13. ErrorLog 🟡
14. CMSPage 🟡
15. Role 🟡

### Entities موجودة يمكن استخدامها
1. ✅ Marketer
2. ✅ CommissionPlan
3. ✅ Onboarding
4. ✅ Promotion
5. ✅ Attendance (من er module)
6. ✅ LeaveRequest (من er module)
7. ✅ Transaction (من finance module)

---

**آخر تحديث**: 2025-10-15
**إجمالي Endpoints**: 151

