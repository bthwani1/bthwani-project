# 📋 خطة إكمال الاختبارات - bThwaniApp

## 🎯 نظرة عامة على الخطة

### الهدف الرئيسي

رفع تغطية الاختبارات من **31.96%** إلى **70%+** من خلال إضافة الاختبارات المفقودة وتحسين الاختبارات الموجودة.

### المدة المتوقعة

- **المرحلة الأولى**: 2-3 أسابيع
- **المرحلة الثانية**: 1-2 أسبوع
- **المرحلة الثالثة**: 1 أسبوع
- **إجمالي المدة**: 4-6 أسابيع

---

## 📊 تحليل الفجوات الحالية

### 1. الملفات غير المختبرة (0% تغطية)

#### 🔧 المكونات

- `src/components/delivery/DeliveryWorkingHours.tsx` - ملف فارغ
- `src/components/DynamicFAB.tsx` - مكون FAB ديناميكي

#### 📱 الشاشات

- `src/screens/wallet/Topup/GamePackagesScreen.tsx` - شاشة باقات الألعاب
- `src/screens/wallet/Topup/LogsScreen.tsx` - شاشة السجلات
- `src/screens/wallet/Topup/MyTransactionsScreen.tsx` - شاشة معاملاتي
- `src/screens/wallet/Topup/PayBillScreen.tsx` - شاشة دفع الفواتير

#### 🛠️ الأدوات المساعدة

- `src/utils/api/token.ts` - إدارة التوكن
- `src/utils/api/uploadFileToBunny.ts` - رفع الملفات
- `src/utils/lib/track.ts` - تتبع الأحداث
- `src/utils/lib/utm.ts` - إدارة UTM

### 2. الملفات منخفضة التغطية (<30%)

#### 📱 شاشات المصادقة (4.08%)

- `LoginScreen.tsx` - 5.14%
- `RegisterScreen.tsx` - 3.29%
- `ForgotPasswordScreen.tsx` - 8.69%
- `OTPVerificationScreen.tsx` - 1.86%

#### 🚚 شاشات التوصيل (18.98%)

- `CartScreen.tsx` - 7.69%
- `CategoryDetailsScreen.tsx` - 2.06%
- `ProductDetailsScreen.tsx` - 10%
- `InvoiceScreen.tsx` - 4.08%

#### 💰 شاشات المحفظة (8.69%)

- `WalletScreen.tsx` - 9.52%
- `CouponListScreen.tsx` - 8.57%
- `LoyaltyScreen.tsx` - 4.34%

---

## 🚀 المرحلة الأولى: الاختبارات الأساسية (الأسبوع 1-3)

### الأسبوع الأول: اختبارات المكونات

#### 1. اختبار DynamicFAB

```typescript
// src/__tests__/components/DynamicFAB.test.tsx
describe("DynamicFAB", () => {
  test("should render FAB on DeliveryHome screen", () => {
    // اختبار ظهور FAB في شاشة التوصيل الرئيسية
  });

  test("should navigate to CartScreen when pressed", () => {
    // اختبار التنقل إلى شاشة السلة
  });

  test("should be draggable", () => {
    // اختبار إمكانية السحب
  });

  test("should not render on other screens", () => {
    // اختبار عدم الظهور في شاشات أخرى
  });
});
```

#### 2. اختبار DeliveryWorkingHours

```typescript
// src/__tests__/components/delivery/DeliveryWorkingHours.test.tsx
describe("DeliveryWorkingHours", () => {
  test("should render working hours component", () => {
    // اختبار عرض ساعات العمل
  });

  test("should show open/closed status", () => {
    // اختبار حالة الفتح/الإغلاق
  });

  test("should display business hours", () => {
    // اختبار عرض ساعات العمل
  });
});
```

### الأسبوع الثاني: اختبارات شاشات المحفظة

#### 1. اختبار GamePackagesScreen

```typescript
// src/__tests__/screens/wallet/Topup/GamePackagesScreen.test.tsx
describe("GamePackagesScreen", () => {
  test("should render game packages grid", () => {
    // اختبار عرض شبكة باقات الألعاب
  });

  test("should select package when tapped", () => {
    // اختبار اختيار الباقة
  });

  test("should validate player ID input", () => {
    // اختبار التحقق من معرف اللاعب
  });

  test("should handle purchase successfully", () => {
    // اختبار عملية الشراء الناجحة
  });

  test("should handle purchase errors", () => {
    // اختبار أخطاء الشراء
  });
});
```

#### 2. اختبار LogsScreen

```typescript
// src/__tests__/screens/wallet/Topup/LogsScreen.test.tsx
describe("LogsScreen", () => {
  test("should render logs list", () => {
    // اختبار عرض قائمة السجلات
  });

  test("should filter logs by date", () => {
    // اختبار تصفية السجلات حسب التاريخ
  });

  test("should show log details", () => {
    // اختبار عرض تفاصيل السجل
  });
});
```

#### 3. اختبار MyTransactionsScreen

```typescript
// src/__tests__/screens/wallet/Topup/MyTransactionsScreen.test.tsx
describe("MyTransactionsScreen", () => {
  test("should render transactions list", () => {
    // اختبار عرض قائمة المعاملات
  });

  test("should filter transactions by type", () => {
    // اختبار تصفية المعاملات حسب النوع
  });

  test("should show transaction details", () => {
    // اختبار عرض تفاصيل المعاملة
  });
});
```

#### 4. اختبار PayBillScreen

```typescript
// src/__tests__/screens/wallet/Topup/PayBillScreen.test.tsx
describe("PayBillScreen", () => {
  test("should render bill payment form", () => {
    // اختبار عرض نموذج دفع الفاتورة
  });

  test("should validate bill number", () => {
    // اختبار التحقق من رقم الفاتورة
  });

  test("should handle payment successfully", () => {
    // اختبار عملية الدفع الناجحة
  });

  test("should handle payment errors", () => {
    // اختبار أخطاء الدفع
  });
});
```

### الأسبوع الثالث: اختبارات الأدوات المساعدة

#### 1. اختبار token.ts

```typescript
// src/__tests__/utils/api/token.test.ts
describe("Token Management", () => {
  test("should get token from storage", () => {
    // اختبار جلب التوكن من التخزين
  });

  test("should set token to storage", () => {
    // اختبار حفظ التوكن في التخزين
  });

  test("should clear token", () => {
    // اختبار مسح التوكن
  });

  test("should validate token format", () => {
    // اختبار صحة تنسيق التوكن
  });
});
```

#### 2. اختبار uploadFileToBunny.ts

```typescript
// src/__tests__/utils/api/uploadFileToBunny.test.ts
describe("File Upload to Bunny", () => {
  test("should upload file successfully", () => {
    // اختبار رفع الملف بنجاح
  });

  test("should handle upload errors", () => {
    // اختبار أخطاء الرفع
  });

  test("should validate file size", () => {
    // اختبار التحقق من حجم الملف
  });

  test("should validate file type", () => {
    // اختبار التحقق من نوع الملف
  });
});
```

#### 3. اختبار track.ts

```typescript
// src/__tests__/utils/lib/track.test.ts
describe("Event Tracking", () => {
  test("should track user events", () => {
    // اختبار تتبع أحداث المستخدم
  });

  test("should handle tracking errors", () => {
    // اختبار أخطاء التتبع
  });

  test("should batch events", () => {
    // اختبار تجميع الأحداث
  });
});
```

#### 4. اختبار utm.ts

```typescript
// src/__tests__/utils/lib/utm.test.ts
describe("UTM Management", () => {
  test("should parse UTM parameters", () => {
    // اختبار تحليل معاملات UTM
  });

  test("should store UTM data", () => {
    // اختبار تخزين بيانات UTM
  });

  test("should retrieve UTM data", () => {
    // اختبار استرجاع بيانات UTM
  });
});
```

---

## 🔧 المرحلة الثانية: تحسين الاختبارات الموجودة (الأسبوع 4-5)

### الأسبوع الرابع: تحسين شاشات المصادقة

#### 1. تحسين LoginScreen (الهدف: 70%+)

```typescript
// تحسينات لـ src/__tests__/screens/Auth/LoginScreen.test.tsx
describe("LoginScreen Enhanced", () => {
  test("should validate email format", () => {
    // اختبار صحة تنسيق البريد الإلكتروني
  });

  test("should validate password requirements", () => {
    // اختبار متطلبات كلمة المرور
  });

  test("should handle login with valid credentials", () => {
    // اختبار تسجيل الدخول ببيانات صحيحة
  });

  test("should handle login with invalid credentials", () => {
    // اختبار تسجيل الدخول ببيانات خاطئة
  });

  test("should show loading state", () => {
    // اختبار حالة التحميل
  });

  test("should navigate to forgot password", () => {
    // اختبار التنقل إلى نسيان كلمة المرور
  });

  test("should navigate to register", () => {
    // اختبار التنقل إلى التسجيل
  });
});
```

#### 2. تحسين RegisterScreen (الهدف: 70%+)

```typescript
// تحسينات لـ src/__tests__/screens/Auth/RegisterScreen.test.tsx
describe("RegisterScreen Enhanced", () => {
  test("should validate all form fields", () => {
    // اختبار التحقق من جميع حقول النموذج
  });

  test("should handle registration successfully", () => {
    // اختبار التسجيل الناجح
  });

  test("should handle registration errors", () => {
    // اختبار أخطاء التسجيل
  });

  test("should validate phone number format", () => {
    // اختبار صحة تنسيق رقم الهاتف
  });

  test("should accept terms and conditions", () => {
    // اختبار قبول الشروط والأحكام
  });
});
```

### الأسبوع الخامس: تحسين شاشات التوصيل

#### 1. تحسين CartScreen (الهدف: 70%+)

```typescript
// تحسينات لـ src/__tests__/screens/delivery/CartScreen.test.tsx
describe("CartScreen Enhanced", () => {
  test("should display cart items", () => {
    // اختبار عرض عناصر السلة
  });

  test("should update item quantities", () => {
    // اختبار تحديث كميات العناصر
  });

  test("should remove items from cart", () => {
    // اختبار إزالة العناصر من السلة
  });

  test("should calculate total price", () => {
    // اختبار حساب السعر الإجمالي
  });

  test("should apply discounts", () => {
    // اختبار تطبيق الخصومات
  });

  test("should proceed to checkout", () => {
    // اختبار المتابعة إلى الدفع
  });
});
```

#### 2. تحسين ProductDetailsScreen (الهدف: 70%+)

```typescript
// تحسينات لـ src/__tests__/screens/delivery/ProductDetailsScreen.test.tsx
describe("ProductDetailsScreen Enhanced", () => {
  test("should display product information", () => {
    // اختبار عرض معلومات المنتج
  });

  test("should show product images", () => {
    // اختبار عرض صور المنتج
  });

  test("should add product to cart", () => {
    // اختبار إضافة المنتج إلى السلة
  });

  test("should add product to favorites", () => {
    // اختبار إضافة المنتج إلى المفضلة
  });

  test("should show product reviews", () => {
    // اختبار عرض تقييمات المنتج
  });

  test("should handle quantity selection", () => {
    // اختبار اختيار الكمية
  });
});
```

---

## ⚡ المرحلة الثالثة: اختبارات متقدمة (الأسبوع 6)

### اختبارات E2E (End-to-End)

#### 1. اختبار مسار التسوق الكامل

```typescript
// src/__tests__/e2e/shopping-flow.test.ts
describe("Complete Shopping Flow", () => {
  test("should complete full shopping process", async () => {
    // 1. تسجيل الدخول
    // 2. تصفح المنتجات
    // 3. إضافة منتج إلى السلة
    // 4. إتمام الطلب
    // 5. الدفع
    // 6. تأكيد الطلب
  });
});
```

#### 2. اختبار مسار المحفظة الكامل

```typescript
// src/__tests__/e2e/wallet-flow.test.ts
describe("Complete Wallet Flow", () => {
  test("should complete wallet operations", async () => {
    // 1. عرض الرصيد
    // 2. شحن المحفظة
    // 3. شراء باقة ألعاب
    // 4. عرض المعاملات
  });
});
```

### اختبارات الأداء

#### 1. اختبارات تحميل الشاشات

```typescript
// src/__tests__/performance/screen-loading.test.ts
describe("Screen Loading Performance", () => {
  test("should load DeliveryHome within 2 seconds", () => {
    // اختبار تحميل شاشة التوصيل الرئيسية
  });

  test("should load ProductDetails within 1.5 seconds", () => {
    // اختبار تحميل تفاصيل المنتج
  });
});
```

#### 2. اختبارات استهلاك الذاكرة

```typescript
// src/__tests__/performance/memory-usage.test.ts
describe("Memory Usage", () => {
  test("should not exceed memory limit", () => {
    // اختبار عدم تجاوز حد الذاكرة
  });
});
```

---

## 📊 معايير النجاح

### المرحلة الأولى

- ✅ إضافة اختبارات لجميع الملفات غير المختبرة
- ✅ رفع تغطية الشاشات إلى 50%+
- ✅ رفع تغطية المكونات إلى 80%+

### المرحلة الثانية

- ✅ رفع تغطية شاشات المصادقة إلى 70%+
- ✅ رفع تغطية شاشات التوصيل إلى 70%+
- ✅ رفع تغطية شاشات المحفظة إلى 70%+

### المرحلة الثالثة

- ✅ إضافة اختبارات E2E شاملة
- ✅ إضافة اختبارات الأداء
- ✅ رفع التغطية الإجمالية إلى 70%+

---

## 🛠️ الأدوات والموارد المطلوبة

### الأدوات

- **Jest**: إطار الاختبار الرئيسي
- **React Native Testing Library**: لاختبار المكونات
- **@testing-library/jest-native**: لاختبارات إضافية
- **Detox**: لاختبارات E2E (اختياري)

### الملفات المطلوبة

- `src/test-utils/renderWithProviders.tsx`: مساعد اختبار محسن
- `src/test-utils/mockData.ts`: بيانات وهمية للاختبارات
- `src/test-utils/testHelpers.ts`: دوال مساعدة للاختبارات

### الممارسات المطلوبة

- **TDD**: تطوير محرك بالاختبارات
- **AAA Pattern**: Arrange, Act, Assert
- **Mocking**: استخدام البيانات الوهمية
- **Coverage Reports**: تقارير التغطية المنتظمة

---

## 📈 خطة المتابعة والتقييم

### أسبوعياً

- مراجعة التقدم في الاختبارات
- تحديث تقارير التغطية
- حل المشاكل والتحديات

### شهرياً

- تقييم شامل للتغطية
- تحسين استراتيجية الاختبارات
- تحديث خطة العمل

### النتائج المتوقعة

- **تغطية إجمالية**: 70%+
- **جودة الكود**: محسنة بشكل كبير
- **استقرار التطبيق**: أعلى بكثير
- **وقت التطوير**: أسرع مع الاختبارات

---

## 🎯 الخلاصة

هذه الخطة ستضمن:

1. **اكتمال الاختبارات** لجميع الملفات المهمة
2. **تحسين الجودة** من خلال تغطية شاملة
3. **تقليل الأخطاء** في الإنتاج
4. **تسريع التطوير** المستقبلي
5. **زيادة الثقة** في الكود

**البدء فوراً** بتنفيذ المرحلة الأولى لتحقيق الأهداف المطلوبة في الوقت المحدد.

---

_تم إنشاء هذه الخطة في: ${new Date().toLocaleDateString('ar-SA')}_
_المدة المتوقعة: 4-6 أسابيع_
_الهدف: رفع التغطية إلى 70%+_
