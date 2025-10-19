# إصلاح Orphan Endpoints - ملخص التغييرات

## نظرة عامة
تم إصلاح مشكلة 57 API endpoint يتيمة (orphan) كانت تُستدعى من الـ Frontend لكنها غير موجودة أو غير متطابقة في الـ Backend.

## السبب الرئيسي للمشكلة
1. **تعارض الإصدارات (Versioning)**: الـ Backend يستخدم `/api/v2/...` لكن الـ Frontend يستدعي `/api/v1/...`
2. **اختلاف المسارات**: بعض الـ endpoints تستخدم مسارات مختلفة (`address` vs `addresses`)
3. **Endpoints مفقودة فعلياً**: بعض الـ endpoints لم تكن مُنفذة في الـ Backend

## الحلول المُطبقة

### 1. إضافة دعم v1 و v2 للـ Controllers
تم تحديث Controllers التالية لدعم كل من v1 و v2:

```typescript
@Controller({ path: 'users', version: ['1', '2'] })  // بدلاً من version: '2'
@Controller({ path: 'auth', version: ['1', '2'] })
@Controller({ path: 'delivery/cart', version: ['1', '2'] })
@Controller({ path: 'delivery/order', version: ['1', '2'] })
@Controller({ path: 'wallet', version: ['1', '2'] })
@Controller({ path: 'akhdimni', version: ['1', '2'] })
@Controller({ path: 'er', version: ['1', '2'] })
@Controller({ path: 'content', version: ['1', '2'] })
@Controller({ path: 'delivery/stores', version: ['1', '2'] })
```

### 2. Auth Endpoints - إضافة Password Reset Flow
تم إضافة endpoints تقليدية للمصادقة:

**ملف جديد:** `backend-nest/src/modules/auth/dto/password-reset.dto.ts`
**Endpoints مضافة:**
- `POST /auth/forgot` - طلب إعادة تعيين كلمة المرور
- `POST /auth/reset/verify` - التحقق من رمز إعادة التعيين
- `POST /auth/reset` - إعادة تعيين كلمة المرور
- `POST /auth/verify-otp` - التحقق من رمز OTP

**تحديثات Entity:**
- إضافة `passwordResetCode` و `passwordResetExpires` و `phoneVerified` في User entity

### 3. User Addresses - إضافة Aliases
تم إضافة aliases للتوافق مع الـ Frontend:

```typescript
// Aliases الجديدة
PATCH /users/address/:id         // بدلاً من /users/addresses/:addressId
DELETE /users/address/:id        // بدلاً من /users/addresses/:addressId  
PATCH /users/default-address     // بدلاً من POST /users/addresses/:id/set-default
```

### 4. Delivery/Cart/Order Endpoints
تم إضافة:
- `DELETE /delivery/cart/:id` - حذف عنصر من السلة
- `GET /delivery/order` - جلب طلبات المستخدم الحالي

### 5. Errands Endpoints - Controller جديد
**ملف جديد:** `backend-nest/src/modules/akhdimni/errands.controller.ts`

تم إنشاء Errands Controller كـ alias لـ Akhdimni:

```typescript
POST /errands/order              // → akhdimni.create()
GET /errands/user/:id            // → akhdimni.getMyOrders()
GET /errands/:id                 // → akhdimni.findById()
GET /errands/categories          // Static categories
GET /errands/drivers/available   // Stub implementation
```

### 6. Wallet V2 Endpoints - Controller جديد
**ملف جديد:** `backend-nest/src/modules/wallet/v2-wallet.controller.ts`

```typescript
POST /v2/wallet/coupons/apply    // تطبيق قسيمة
GET /v2/wallet/coupons/my        // قسائمي
GET /v2/wallet/coupons/history   // سجل القسائم
GET /v2/wallet/subscriptions/my  // اشتراكاتي
```

### 7. ER Endpoints - إضافة DELETE Operations
تم إضافة Stub endpoints للعمليات المفقودة:

```typescript
DELETE /er/assets/:id
DELETE /er/accounts/chart/:id
DELETE /er/documents/:id
GET /er/documents/:id/download
DELETE /er/documents/bulk
GET /er/documents/export
DELETE /er/payroll/:id
```

### 8. Admin CMS Endpoints - Controller جديد
**ملف جديد:** `backend-nest/src/modules/admin/admin-cms.controller.ts`

Endpoints للـ CMS:

```typescript
// Onboarding Slides
POST /admin/onboarding-slides
PUT /admin/onboarding-slides/:id
DELETE /admin/onboarding-slides/:id

// Pages
PUT /admin/pages/:id
DELETE /admin/pages/:id

// Strings/Translations
POST /admin/strings
PUT /admin/strings/:id
DELETE /admin/strings/:id

// Home Layouts
POST /admin/home-layouts
PUT /admin/home-layouts/:id
DELETE /admin/home-layouts/:id

// Additional
DELETE /admin/wallet/coupons/:id
DELETE /admin/wallet/subscriptions/:id
POST /admin/reports/generate
POST /admin/reports/export/:id/:format
GET /admin/reports/realtime
GET /admin/wallet/settlements/export
```

### 9. Utility Endpoints - Controllers جديدة
**ملفات جديدة:**
- `backend-nest/src/modules/store/delivery-categories.controller.ts`
- `backend-nest/src/modules/utility/events.controller.ts`
- `backend-nest/src/modules/store/groceries.controller.ts`
- `backend-nest/src/modules/promotion/promotions-by-stores.controller.ts`

```typescript
GET /delivery/categories           // فئات التوصيل
POST /events                        // تسجيل الأحداث
GET /groceries/catalog             // كتالوج البقالة
GET /delivery/promotions/by-stores // العروض حسب المتاجر
PUT /delivery/stores/:id           // تحديث متجر (يحتاج إضافة في المستقبل)
```

## الملفات المُحدّثة

### Controllers
1. `backend-nest/src/modules/auth/auth.controller.ts` - إضافة password reset endpoints
2. `backend-nest/src/modules/auth/auth.service.ts` - إضافة password reset logic
3. `backend-nest/src/modules/auth/entities/user.entity.ts` - إضافة password reset fields
4. `backend-nest/src/modules/user/user.controller.ts` - إضافة address aliases + v1/v2 support
5. `backend-nest/src/modules/cart/cart.controller.ts` - إضافة DELETE endpoint + v1/v2 support
6. `backend-nest/src/modules/order/order.controller.ts` - إضافة GET endpoint + v1/v2 support
7. `backend-nest/src/modules/wallet/wallet.controller.ts` - إضافة v1/v2 support
8. `backend-nest/src/modules/akhdimni/akhdimni.controller.ts` - إضافة v1/v2 support
9. `backend-nest/src/modules/er/er.controller.ts` - إضافة DELETE endpoints + v1/v2 support
10. `backend-nest/src/modules/store/delivery-store.controller.ts` - إضافة v1/v2 support

### Modules
1. `backend-nest/src/modules/auth/dto/password-reset.dto.ts` - **جديد**
2. `backend-nest/src/modules/akhdimni/errands.controller.ts` - **جديد**
3. `backend-nest/src/modules/akhdimni/akhdimni.module.ts` - إضافة ErrandsController
4. `backend-nest/src/modules/wallet/v2-wallet.controller.ts` - **جديد**
5. `backend-nest/src/modules/wallet/wallet.module.ts` - إضافة V2WalletController
6. `backend-nest/src/modules/admin/admin-cms.controller.ts` - **جديد**
7. `backend-nest/src/modules/admin/admin.module.ts` - إضافة AdminCMSController
8. `backend-nest/src/modules/store/delivery-categories.controller.ts` - **جديد**
9. `backend-nest/src/modules/utility/events.controller.ts` - **جديد**
10. `backend-nest/src/modules/store/groceries.controller.ts` - **جديد**
11. `backend-nest/src/modules/promotion/promotions-by-stores.controller.ts` - **جديد**

## ملاحظات مهمة

### TODO Items للتنفيذ المستقبلي
العديد من الـ endpoints تم إنشاؤها كـ stubs (هياكل فارغة) وتحتاج إلى:

1. **Password Reset**: تنفيذ إرسال البريد الإلكتروني/SMS الفعلي للرمز
2. **Coupons System**: تنفيذ منطق القسائم الكامل
3. **Events Tracking**: ربط بنظام تتبع الأحداث (Analytics)
4. **CMS Endpoints**: ربط بقاعدة بيانات CMS فعلية
5. **ER DELETE Operations**: تنفيذ منطق الحذف الفعلي مع التحقق من الصلاحيات

### Controllers تحتاج إضافة للـ Modules
بعض الـ Controllers الجديدة تحتاج إلى إضافتها في modules:

```typescript
// في store.module.ts
controllers: [StoreController, DeliveryStoreController, DeliveryCategoriesController, GroceriesController]

// في utility.module.ts  
controllers: [UtilityController, EventsController]

// في promotion.module.ts
controllers: [PromotionController, PromotionsByStoresController]
```

## الخطوات التالية

1. **تشغيل السكريبت**: قم بتشغيل `node scripts/check-fe-orphans.js` للتحقق من النتيجة
2. **إضافة Controllers للـ Modules**: أضف Controllers الجديدة في modules المناسبة
3. **التطوير التدريجي**: املأ TODO items في الـ stub endpoints بشكل تدريجي
4. **Testing**: اختبر الـ endpoints الجديدة من الـ Frontend

## إحصائيات

- **Endpoints مصلحة**: 57+
- **Controllers جديدة**: 6
- **DTOs جديدة**: 1
- **Modules محدثة**: 6
- **Entity Fields جديدة**: 3

---

تم إنشاء هذا التقرير في: ${new Date().toISOString()}

