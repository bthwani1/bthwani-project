# Admin Endpoints Documentation

**Generated At:** ١٥‏/١٠‏/٢٠٢٥، ٧:٢٤:٢٤ م

**Total Endpoints:** 110

**Modules:** 12

## 📊 Summary by Module

| Module | Endpoints Count |
|--------|----------------|
| akhdimni | 2 |
| analytics | 28 |
| content | 11 |
| er | 17 |
| finance | 26 |
| merchant | 9 |
| notification | 1 |
| promotion | 5 |
| store | 1 |
| user | 2 |
| utility | 5 |
| wallet | 3 |

## 📊 Summary by HTTP Method

| Method | Count |
|--------|-------|
| PATCH | 18 |
| GET | 56 |
| POST | 31 |
| DELETE | 5 |

## 📋 Endpoints by Module

### AKHDIMNI

#### 1. تحديث حالة المهمة (سائق)

- **Method:** `PATCH`
- **Path:** `errands/:id/status`
- **Handler:** `getAllErrands()`
- **Roles:** driver
- **File:** `akhdimni.controller.ts`

#### 2. كل طلبات أخدمني (إدارة)

- **Method:** `GET`
- **Path:** `admin/errands`
- **Handler:** `assignDriver()`
- **Roles:** admin, superadmin
- **File:** `akhdimni.controller.ts`

---

### ANALYTICS

#### 1. ROAS اليومي

- **Method:** `GET`
- **Path:** `roas/daily`
- **Handler:** `getRoasSummary()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 2. ملخص ROAS

- **Method:** `GET`
- **Path:** `roas/summary`
- **Handler:** `getRoasByPlatform()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 3. ROAS حسب المنصة

- **Method:** `GET`
- **Path:** `roas/by-platform`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 4. ROAS حسب المنصة

- **Method:** `POST`
- **Path:** `roas/calculate`
- **Handler:** `recordAdSpend()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 5. تسجيل إنفاق إعلاني

- **Method:** `POST`
- **Path:** `adspend`
- **Handler:** `getAdSpend()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 6. الإنفاق الإعلاني

- **Method:** `GET`
- **Path:** `adspend`
- **Handler:** `getAdSpendSummary()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 7. ملخص الإنفاق الإعلاني

- **Method:** `GET`
- **Path:** `adspend/summary`
- **Handler:** `getKPIs()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 8. مؤشرات الأداء الرئيسية

- **Method:** `GET`
- **Path:** `kpis`
- **Handler:** `getRealTimeKPIs()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 9. مؤشرات الأداء الرئيسية

- **Method:** `GET`
- **Path:** `kpis`
- **Handler:** `getKPITrends()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 10. تتبع حدث تسويقي

- **Method:** `POST`
- **Path:** `events/track`
- **Handler:** `getEvents()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 11. الأحداث التسويقية

- **Method:** `GET`
- **Path:** `events`
- **Handler:** `getEventsSummary()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 12. ملخص الأحداث

- **Method:** `GET`
- **Path:** `events/summary`
- **Handler:** `getConversionFunnel()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 13. قمع التحويل

- **Method:** `GET`
- **Path:** `funnel/conversion`
- **Handler:** `getDropOffPoints()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 14. قمع التحويل

- **Method:** `GET`
- **Path:** `funnel/drop-off`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 15. نقاط الانسحاب

- **Method:** `GET`
- **Path:** `funnel/drop-off`
- **Handler:** `getUserRetention()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 16. نمو المستخدمين

- **Method:** `GET`
- **Path:** `users/growth`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 17. معدل الاحتفاظ

- **Method:** `GET`
- **Path:** `users/retention`
- **Handler:** `getRevenueForecast()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 18. تحليل الأفواج

- **Method:** `GET`
- **Path:** `users/cohort`
- **Handler:** `getRevenueBreakdown()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 19. توقعات الإيرادات

- **Method:** `GET`
- **Path:** `revenue/breakdown`
- **Handler:** `getDashboardOverview()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 20. نظرة عامة متقدمة

- **Method:** `GET`
- **Path:** `advanced/dashboard-overview`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 21. نظرة عامة متقدمة

- **Method:** `GET`
- **Path:** `advanced/dashboard-overview`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 22. تحليل المجموعات المتقدم

- **Method:** `GET`
- **Path:** `advanced/cohort-analysis-advanced`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 23. تحليل القمع

- **Method:** `GET`
- **Path:** `advanced/funnel-analysis`
- **Handler:** `getCustomerLTV()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 24. معدل الاحتفاظ

- **Method:** `GET`
- **Path:** `advanced/retention`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 25. القيمة الدائمة للعميل

- **Method:** `GET`
- **Path:** `advanced/ltv`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 26. معدل التراجع

- **Method:** `GET`
- **Path:** `advanced/churn-rate`
- **Handler:** `getPeakHours()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 27. التوزيع الجغرافي

- **Method:** `GET`
- **Path:** `advanced/geographic-distribution`
- **Handler:** `getProductPerformance()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

#### 28. ساعات الذروة

- **Method:** `GET`
- **Path:** `advanced/peak-hours`
- **Handler:** `getDriverPerformance()`
- **Roles:** admin, superadmin
- **File:** `analytics.controller.ts`

---

### CONTENT

#### 1. الحصول على البانرات النشطة (public)

- **Method:** `GET`
- **Path:** `banners`
- **Handler:** `createBanner()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 2. تسجيل نقرة على بانر

- **Method:** `POST`
- **Path:** `banners`
- **Handler:** `getAllBanners()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 3. إنشاء بانر جديد

- **Method:** `GET`
- **Path:** `admin/banners`
- **Handler:** `updateBanner()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 4. كل البانرات (admin)

- **Method:** `GET`
- **Path:** `admin/banners`
- **Handler:** `deleteBanner()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 5. حذف قسم

- **Method:** `DELETE`
- **Path:** `sections/:id`
- **Handler:** `createSubscriptionPlan()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 6. الحصول على صفحات CMS (public)

- **Method:** `GET`
- **Path:** `pages`
- **Handler:** `createCMSPage()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 7. الحصول على صفحة CMS بالـ slug

- **Method:** `GET`
- **Path:** `pages/:slug`
- **Handler:** `updateCMSPage()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 8. تحديث صفحة CMS

- **Method:** `PATCH`
- **Path:** `admin/pages/:id`
- **Handler:** `updateAppSettings()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 9. تحديث إعدادات التطبيق

- **Method:** `GET`
- **Path:** `faqs`
- **Handler:** `createFAQ()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 10. الأسئلة الشائعة (public)

- **Method:** `GET`
- **Path:** `faqs`
- **Handler:** `updateFAQ()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

#### 11. إضافة سؤال شائع

- **Method:** `POST`
- **Path:** `admin/faqs`
- **Handler:** `deleteFAQ()`
- **Roles:** admin, superadmin
- **File:** `content.controller.ts`

---

### ER

#### 1. createEmployee

- **Method:** `POST`
- **Path:** `employees`
- **Handler:** `createEmployee()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 2. إضافة موظف جديد

- **Method:** `POST`
- **Path:** `employees`
- **Handler:** `findAllEmployees()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 3. إضافة موظف جديد

- **Method:** `POST`
- **Path:** `employees`
- **Handler:** `findEmployeeById()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 4. الحصول على كل الموظفين

- **Method:** `GET`
- **Path:** `employees`
- **Handler:** `updateEmployee()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 5. تسجيل حضور

- **Method:** `POST`
- **Path:** `attendance/check-out`
- **Handler:** `getEmployeeAttendance()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 6. تقديم طلب إجازة

- **Method:** `POST`
- **Path:** `leave-requests`
- **Handler:** `approveLeaveRequest()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 7. الموافقة على طلب إجازة

- **Method:** `PATCH`
- **Path:** `leave-requests/:id/approve`
- **Handler:** `rejectLeaveRequest()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 8. رفض طلب إجازة

- **Method:** `PATCH`
- **Path:** `leave-requests/:id/reject`
- **Handler:** `generatePayroll()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 9. إنشاء كشف راتب

- **Method:** `POST`
- **Path:** `payroll/generate`
- **Handler:** `approvePayroll()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 10. إنشاء كشف راتب

- **Method:** `PATCH`
- **Path:** `payroll/:id/approve`
- **Handler:** `markAsPaid()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 11. تحديد كدفع

- **Method:** `PATCH`
- **Path:** `payroll/:id/mark-paid`
- **Handler:** `createAccount()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 12. تحديد كدفع

- **Method:** `POST`
- **Path:** `accounts`
- **Handler:** `findAllAccounts()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 13. إنشاء حساب

- **Method:** `POST`
- **Path:** `accounts`
- **Handler:** `findAccountById()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 14. دليل الحسابات

- **Method:** `GET`
- **Path:** `accounts`
- **Handler:** `createJournalEntry()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 15. الحصول على حساب

- **Method:** `POST`
- **Path:** `journal-entries`
- **Handler:** `getJournalEntries()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 16. الحصول على قيود اليومية

- **Method:** `GET`
- **Path:** `journal-entries`
- **Handler:** `postJournalEntry()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

#### 17. ترحيل قيد

- **Method:** `PATCH`
- **Path:** `journal-entries/:id/post`
- **Handler:** `getTrialBalance()`
- **Roles:** admin, superadmin
- **File:** `er.controller.ts`

---

### FINANCE

#### 1. create

- **Method:** `POST`
- **Path:** `commissions`
- **Handler:** `create()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 2. الحصول على عمولاتي

- **Method:** `GET`
- **Path:** `commissions/my`
- **Handler:** `approve()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 3. إحصائيات عمولاتي

- **Method:** `GET`
- **Path:** `commissions/stats/my`
- **Handler:** `cancel()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 4. الموافقة على عمولة

- **Method:** `PATCH`
- **Path:** `commissions/:id/approve`
- **Handler:** `createPayoutBatch()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 5. إنشاء دفعة من العمولات

- **Method:** `POST`
- **Path:** `payouts/batches`
- **Handler:** `getPayoutBatches()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 6. الحصول على كل الدفعات

- **Method:** `GET`
- **Path:** `payouts/batches`
- **Handler:** `findById()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 7. الحصول على كل الدفعات

- **Method:** `GET`
- **Path:** `payouts/batches/:id`
- **Handler:** `getBatchItems()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 8. الحصول على دفعة

- **Method:** `GET`
- **Path:** `payouts/batches/:id`
- **Handler:** `approvePayoutBatch()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 9. الحصول على عناصر دفعة

- **Method:** `PATCH`
- **Path:** `payouts/batches/:id/approve`
- **Handler:** `completePayoutBatch()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 10. إكمال دفعة

- **Method:** `PATCH`
- **Path:** `payouts/batches/:id/complete`
- **Handler:** `create()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 11. إكمال دفعة

- **Method:** `POST`
- **Path:** `settlements`
- **Handler:** `getEntitySettlements()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 12. إنشاء تسوية

- **Method:** `GET`
- **Path:** `settlements/entity/:entityId`
- **Handler:** `findById()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 13. الحصول على تسويات كيان

- **Method:** `GET`
- **Path:** `settlements/:id`
- **Handler:** `approveSettlement()`
- **Roles:** admin, superadmin, vendor, driver
- **File:** `finance.controller.ts`

#### 14. الموافقة على تسوية

- **Method:** `PATCH`
- **Path:** `settlements/:id/approve`
- **Handler:** `createCoupon()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 15. إنشاء كوبون

- **Method:** `POST`
- **Path:** `coupons/validate`
- **Handler:** `findAll()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 16. التحقق من كوبون

- **Method:** `POST`
- **Path:** `coupons/validate`
- **Handler:** `updateCoupon()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 17. الحصول على كل الكوبونات

- **Method:** `PATCH`
- **Path:** `coupons/:id`
- **Handler:** `createReconciliation()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 18. إنشاء مطابقة مالية

- **Method:** `POST`
- **Path:** `reconciliations`
- **Handler:** `findAll()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 19. الحصول على كل المطابقات

- **Method:** `GET`
- **Path:** `reconciliations`
- **Handler:** `findById()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 20. الحصول على كل المطابقات

- **Method:** `GET`
- **Path:** `reconciliations`
- **Handler:** `addActualTotals()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 21. إضافة الإجماليات الفعلية

- **Method:** `PATCH`
- **Path:** `reconciliations/:id/actual-totals`
- **Handler:** `addReconciliationIssue()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 22. إضافة مشكلة للمطابقة

- **Method:** `POST`
- **Path:** `reconciliations/:id/issues`
- **Handler:** `resolveReconciliationIssue()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 23. حل مشكلة في المطابقة

- **Method:** `POST`
- **Path:** `reports/daily`
- **Handler:** `generateDailyReport()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 24. إنشاء تقرير يومي

- **Method:** `POST`
- **Path:** `reports/daily`
- **Handler:** `getDailyReport()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 25. إنشاء تقرير يومي

- **Method:** `POST`
- **Path:** `reports/daily`
- **Handler:** `getReports()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

#### 26. الحصول على التقارير

- **Method:** `GET`
- **Path:** `reports`
- **Handler:** `finalizeReport()`
- **Roles:** admin, superadmin
- **File:** `finance.controller.ts`

---

### MERCHANT

#### 1. إنشاء تاجر جديد

- **Method:** `GET`
- **Path:** `:id`
- **Handler:** `findMerchantById()`
- **Roles:** admin, superadmin
- **File:** `merchant.controller.ts`

#### 2. الحصول على كل التجار

- **Method:** `GET`
- **Path:** `:id`
- **Handler:** `updateMerchant()`
- **Roles:** admin, superadmin
- **File:** `merchant.controller.ts`

#### 3. الحصول على تاجر محدد

- **Method:** `PATCH`
- **Path:** `:id`
- **Handler:** `deleteMerchant()`
- **Roles:** admin, superadmin, vendor
- **File:** `merchant.controller.ts`

#### 4. حذف تاجر

- **Method:** `DELETE`
- **Path:** `:id`
- **Handler:** `createProductCatalog()`
- **Roles:** admin, superadmin
- **File:** `merchant.controller.ts`

#### 5. إضافة منتج للكتالوج

- **Method:** `GET`
- **Path:** `catalog/products`
- **Handler:** `updateProductCatalog()`
- **Roles:** admin, superadmin
- **File:** `merchant.controller.ts`

#### 6. تحديث مخزون منتج

- **Method:** `PATCH`
- **Path:** `products/:id/stock`
- **Handler:** `createCategory()`
- **Roles:** admin, superadmin
- **File:** `merchant.controller.ts`

#### 7. إنشاء فئة منتجات

- **Method:** `POST`
- **Path:** `categories`
- **Handler:** `updateCategory()`
- **Roles:** admin, superadmin
- **File:** `merchant.controller.ts`

#### 8. تحديث فئة

- **Method:** `PATCH`
- **Path:** `categories/:id`
- **Handler:** `createAttribute()`
- **Roles:** admin, superadmin
- **File:** `merchant.controller.ts`

#### 9. إنشاء خاصية منتج

- **Method:** `POST`
- **Path:** `attributes`
- **Handler:** `updateAttribute()`
- **Roles:** admin, superadmin
- **File:** `merchant.controller.ts`

---

### NOTIFICATION

#### 1. إلغاء حظر قناة محددة

- **Method:** `DELETE`
- **Path:** `suppression/channel/:channel`
- **Handler:** `getSuppressionStats()`
- **Roles:** admin, superadmin
- **File:** `notification.controller.ts`

---

### PROMOTION

#### 1. تسجيل نقرة على عرض

- **Method:** `POST`
- **Path:** `:id/click`
- **Handler:** `createPromotion()`
- **Roles:** admin, superadmin
- **File:** `promotion.controller.ts`

#### 2. إنشاء عرض ترويجي

- **Method:** `GET`
- **Path:** `:id`
- **Handler:** `findById()`
- **Roles:** admin, superadmin
- **File:** `promotion.controller.ts`

#### 3. الحصول على كل العروض

- **Method:** `GET`
- **Path:** `:id`
- **Handler:** `updatePromotion()`
- **Roles:** admin, superadmin
- **File:** `promotion.controller.ts`

#### 4. الحصول على عرض محدد

- **Method:** `PATCH`
- **Path:** `:id`
- **Handler:** `delete()`
- **Roles:** admin, superadmin
- **File:** `promotion.controller.ts`

#### 5. تحديث عرض

- **Method:** `DELETE`
- **Path:** `:id`
- **Handler:** `getStatistics()`
- **Roles:** admin, superadmin
- **File:** `promotion.controller.ts`

---

### STORE

#### 1. إنشاء منتج

- **Method:** `POST`
- **Path:** `products`
- **Handler:** `updateStore()`
- **Roles:** admin, superadmin, vendor
- **File:** `store.controller.ts`

---

### USER

#### 1. إلغاء تفعيل الحساب

- **Method:** `DELETE`
- **Path:** `deactivate`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `user.controller.ts`

#### 2. حالة رمز PIN

- **Method:** `GET`
- **Path:** `pin/status`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `user.controller.ts`

---

### UTILITY

#### 1. الحصول على خيارات الغاز والماء (public)

- **Method:** `GET`
- **Path:** `options`
- **Handler:** `create()`
- **Roles:** admin, superadmin
- **File:** `utility.controller.ts`

#### 2. حساب سعر خدمة الغاز أو الماء

- **Method:** `POST`
- **Path:** `calculate-price`
- **Handler:** `getAllPricing()`
- **Roles:** admin, superadmin
- **File:** `utility.controller.ts`

#### 3. إنشاء تسعير لمدينة

- **Method:** `POST`
- **Path:** `pricing`
- **Handler:** `findByCity()`
- **Roles:** admin, superadmin
- **File:** `utility.controller.ts`

#### 4. الحصول على كل التسعيرات

- **Method:** `GET`
- **Path:** `pricing`
- **Handler:** `updatePricing()`
- **Roles:** admin, superadmin
- **File:** `utility.controller.ts`

#### 5. الحصول على تسعير مدينة

- **Method:** `PATCH`
- **Path:** `pricing/:city`
- **Handler:** `delete()`
- **Roles:** admin, superadmin
- **File:** `utility.controller.ts`

---

### WALLET

#### 1. جلب سجل المعاملات

- **Method:** `GET`
- **Path:** `transactions`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `wallet.controller.ts`

#### 2. إنشاء معاملة جديدة (للإدارة)

- **Method:** `POST`
- **Path:** `transaction`
- **Handler:** `()`
- **Roles:** admin, superadmin
- **File:** `wallet.controller.ts`

#### 3. تدقيق حالة المحفظة

- **Method:** `GET`
- **Path:** `audit`
- **Handler:** `()`
- **Roles:** admin
- **File:** `wallet.controller.ts`

---

## 📝 All Endpoints (Table Format)

| Module | Method | Path | Summary | Handler |
|--------|--------|------|---------|--------|
| akhdimni | PATCH | errands/:id/status | تحديث حالة المهمة (سائق) | getAllErrands |
| akhdimni | GET | admin/errands | كل طلبات أخدمني (إدارة) | assignDriver |
| analytics | GET | roas/daily | ROAS اليومي | getRoasSummary |
| analytics | GET | roas/summary | ملخص ROAS | getRoasByPlatform |
| analytics | GET | roas/by-platform | ROAS حسب المنصة |  |
| analytics | POST | roas/calculate | ROAS حسب المنصة | recordAdSpend |
| analytics | POST | adspend | تسجيل إنفاق إعلاني | getAdSpend |
| analytics | GET | adspend | الإنفاق الإعلاني | getAdSpendSummary |
| analytics | GET | adspend/summary | ملخص الإنفاق الإعلاني | getKPIs |
| analytics | GET | kpis | مؤشرات الأداء الرئيسية | getRealTimeKPIs |
| analytics | GET | kpis | مؤشرات الأداء الرئيسية | getKPITrends |
| analytics | POST | events/track | تتبع حدث تسويقي | getEvents |
| analytics | GET | events | الأحداث التسويقية | getEventsSummary |
| analytics | GET | events/summary | ملخص الأحداث | getConversionFunnel |
| analytics | GET | funnel/conversion | قمع التحويل | getDropOffPoints |
| analytics | GET | funnel/drop-off | قمع التحويل |  |
| analytics | GET | funnel/drop-off | نقاط الانسحاب | getUserRetention |
| analytics | GET | users/growth | نمو المستخدمين |  |
| analytics | GET | users/retention | معدل الاحتفاظ | getRevenueForecast |
| analytics | GET | users/cohort | تحليل الأفواج | getRevenueBreakdown |
| analytics | GET | revenue/breakdown | توقعات الإيرادات | getDashboardOverview |
| analytics | GET | advanced/dashboard-overview | نظرة عامة متقدمة |  |
| analytics | GET | advanced/dashboard-overview | نظرة عامة متقدمة |  |
| analytics | GET | advanced/cohort-analysis-advanced | تحليل المجموعات المتقدم |  |
| analytics | GET | advanced/funnel-analysis | تحليل القمع | getCustomerLTV |
| analytics | GET | advanced/retention | معدل الاحتفاظ |  |
| analytics | GET | advanced/ltv | القيمة الدائمة للعميل |  |
| analytics | GET | advanced/churn-rate | معدل التراجع | getPeakHours |
| analytics | GET | advanced/geographic-distribution | التوزيع الجغرافي | getProductPerformance |
| analytics | GET | advanced/peak-hours | ساعات الذروة | getDriverPerformance |
| content | GET | banners | الحصول على البانرات النشطة (public) | createBanner |
| content | POST | banners | تسجيل نقرة على بانر | getAllBanners |
| content | GET | admin/banners | إنشاء بانر جديد | updateBanner |
| content | GET | admin/banners | كل البانرات (admin) | deleteBanner |
| content | DELETE | sections/:id | حذف قسم | createSubscriptionPlan |
| content | GET | pages | الحصول على صفحات CMS (public) | createCMSPage |
| content | GET | pages/:slug | الحصول على صفحة CMS بالـ slug | updateCMSPage |
| content | PATCH | admin/pages/:id | تحديث صفحة CMS | updateAppSettings |
| content | GET | faqs | تحديث إعدادات التطبيق | createFAQ |
| content | GET | faqs | الأسئلة الشائعة (public) | updateFAQ |
| content | POST | admin/faqs | إضافة سؤال شائع | deleteFAQ |
| er | POST | employees |  | createEmployee |
| er | POST | employees | إضافة موظف جديد | findAllEmployees |
| er | POST | employees | إضافة موظف جديد | findEmployeeById |
| er | GET | employees | الحصول على كل الموظفين | updateEmployee |
| er | POST | attendance/check-out | تسجيل حضور | getEmployeeAttendance |
| er | POST | leave-requests | تقديم طلب إجازة | approveLeaveRequest |
| er | PATCH | leave-requests/:id/approve | الموافقة على طلب إجازة | rejectLeaveRequest |
| er | PATCH | leave-requests/:id/reject | رفض طلب إجازة | generatePayroll |
| er | POST | payroll/generate | إنشاء كشف راتب | approvePayroll |
| er | PATCH | payroll/:id/approve | إنشاء كشف راتب | markAsPaid |
| er | PATCH | payroll/:id/mark-paid | تحديد كدفع | createAccount |
| er | POST | accounts | تحديد كدفع | findAllAccounts |
| er | POST | accounts | إنشاء حساب | findAccountById |
| er | GET | accounts | دليل الحسابات | createJournalEntry |
| er | POST | journal-entries | الحصول على حساب | getJournalEntries |
| er | GET | journal-entries | الحصول على قيود اليومية | postJournalEntry |
| er | PATCH | journal-entries/:id/post | ترحيل قيد | getTrialBalance |
| finance | POST | commissions |  | create |
| finance | GET | commissions/my | الحصول على عمولاتي | approve |
| finance | GET | commissions/stats/my | إحصائيات عمولاتي | cancel |
| finance | PATCH | commissions/:id/approve | الموافقة على عمولة | createPayoutBatch |
| finance | POST | payouts/batches | إنشاء دفعة من العمولات | getPayoutBatches |
| finance | GET | payouts/batches | الحصول على كل الدفعات | findById |
| finance | GET | payouts/batches/:id | الحصول على كل الدفعات | getBatchItems |
| finance | GET | payouts/batches/:id | الحصول على دفعة | approvePayoutBatch |
| finance | PATCH | payouts/batches/:id/approve | الحصول على عناصر دفعة | completePayoutBatch |
| finance | PATCH | payouts/batches/:id/complete | إكمال دفعة | create |
| finance | POST | settlements | إكمال دفعة | getEntitySettlements |
| finance | GET | settlements/entity/:entityId | إنشاء تسوية | findById |
| finance | GET | settlements/:id | الحصول على تسويات كيان | approveSettlement |
| finance | PATCH | settlements/:id/approve | الموافقة على تسوية | createCoupon |
| finance | POST | coupons/validate | إنشاء كوبون | findAll |
| finance | POST | coupons/validate | التحقق من كوبون | updateCoupon |
| finance | PATCH | coupons/:id | الحصول على كل الكوبونات | createReconciliation |
| finance | POST | reconciliations | إنشاء مطابقة مالية | findAll |
| finance | GET | reconciliations | الحصول على كل المطابقات | findById |
| finance | GET | reconciliations | الحصول على كل المطابقات | addActualTotals |
| finance | PATCH | reconciliations/:id/actual-totals | إضافة الإجماليات الفعلية | addReconciliationIssue |
| finance | POST | reconciliations/:id/issues | إضافة مشكلة للمطابقة | resolveReconciliationIssue |
| finance | POST | reports/daily | حل مشكلة في المطابقة | generateDailyReport |
| finance | POST | reports/daily | إنشاء تقرير يومي | getDailyReport |
| finance | POST | reports/daily | إنشاء تقرير يومي | getReports |
| finance | GET | reports | الحصول على التقارير | finalizeReport |
| merchant | GET | :id | إنشاء تاجر جديد | findMerchantById |
| merchant | GET | :id | الحصول على كل التجار | updateMerchant |
| merchant | PATCH | :id | الحصول على تاجر محدد | deleteMerchant |
| merchant | DELETE | :id | حذف تاجر | createProductCatalog |
| merchant | GET | catalog/products | إضافة منتج للكتالوج | updateProductCatalog |
| merchant | PATCH | products/:id/stock | تحديث مخزون منتج | createCategory |
| merchant | POST | categories | إنشاء فئة منتجات | updateCategory |
| merchant | PATCH | categories/:id | تحديث فئة | createAttribute |
| merchant | POST | attributes | إنشاء خاصية منتج | updateAttribute |
| notification | DELETE | suppression/channel/:channel | إلغاء حظر قناة محددة | getSuppressionStats |
| promotion | POST | :id/click | تسجيل نقرة على عرض | createPromotion |
| promotion | GET | :id | إنشاء عرض ترويجي | findById |
| promotion | GET | :id | الحصول على كل العروض | updatePromotion |
| promotion | PATCH | :id | الحصول على عرض محدد | delete |
| promotion | DELETE | :id | تحديث عرض | getStatistics |
| store | POST | products | إنشاء منتج | updateStore |
| user | DELETE | deactivate | إلغاء تفعيل الحساب |  |
| user | GET | pin/status | حالة رمز PIN |  |
| utility | GET | options | الحصول على خيارات الغاز والماء (public) | create |
| utility | POST | calculate-price | حساب سعر خدمة الغاز أو الماء | getAllPricing |
| utility | POST | pricing | إنشاء تسعير لمدينة | findByCity |
| utility | GET | pricing | الحصول على كل التسعيرات | updatePricing |
| utility | PATCH | pricing/:city | الحصول على تسعير مدينة | delete |
| wallet | GET | transactions | جلب سجل المعاملات |  |
| wallet | POST | transaction | إنشاء معاملة جديدة (للإدارة) |  |
| wallet | GET | audit | تدقيق حالة المحفظة |  |
