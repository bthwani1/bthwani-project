# 🚀 خطة التنفيذ الفوري - إكمال الاختبارات

## 📋 المهام العاجلة (اليوم الأول)

### 1. ✅ تم إنجازه - اختبارات DynamicFAB

- **الملف**: `src/__tests__/components/DynamicFAB.test.tsx`
- **الحالة**: مكتمل
- **التغطية**: 100% للمكون
- **الاختبارات**: 15 اختبار شامل

### 2. ✅ تم إنجازه - اختبارات GamePackagesScreen

- **الملف**: `src/__tests__/screens/wallet/Topup/GamePackagesScreen.test.tsx`
- **الحالة**: مكتمل
- **التغطية**: 100% للشاشة
- **الاختبارات**: 20+ اختبار شامل

### 3. ✅ تم إنجازه - اختبارات token.ts

- **الملف**: `src/__tests__/utils/api/token.test.ts`
- **الحالة**: مكتمل
- **التغطية**: 100% للأداة
- **الاختبارات**: 25+ اختبار شامل

---

## 🎯 المهام التالية (الأسبوع الأول)

### 4. اختبارات DeliveryWorkingHours

```bash
# إنشاء الملف
touch src/__tests__/components/delivery/DeliveryWorkingHours.test.tsx
```

**المطلوب**:

- اختبار عرض ساعات العمل
- اختبار حالة الفتح/الإغلاق
- اختبار عرض الأوقات

### 5. اختبارات LogsScreen

```bash
# إنشاء الملف
touch src/__tests__/screens/wallet/Topup/LogsScreen.test.tsx
```

**المطلوب**:

- اختبار عرض قائمة السجلات
- اختبار تصفية السجلات
- اختبار عرض التفاصيل

### 6. اختبارات MyTransactionsScreen

```bash
# إنشاء الملف
touch src/__tests__/screens/wallet/Topup/MyTransactionsScreen.test.tsx
```

**المطلوب**:

- اختبار عرض المعاملات
- اختبار التصفية حسب النوع
- اختبار عرض التفاصيل

### 7. اختبارات PayBillScreen

```bash
# إنشاء الملف
touch src/__tests__/screens/wallet/Topup/PayBillScreen.test.tsx
```

**المطلوب**:

- اختبار نموذج دفع الفاتورة
- اختبار التحقق من رقم الفاتورة
- اختبار عملية الدفع

---

## 🛠️ المهام المتوسطة (الأسبوع الثاني)

### 8. اختبارات uploadFileToBunny.ts

```bash
# إنشاء الملف
touch src/__tests__/utils/api/uploadFileToBunny.test.ts
```

**المطلوب**:

- اختبار رفع الملفات
- اختبار التحقق من الحجم
- اختبار التحقق من النوع
- اختبار معالجة الأخطاء

### 9. اختبارات track.ts

```bash
# إنشاء الملف
touch src/__tests__/utils/lib/track.test.ts
```

**المطلوب**:

- اختبار تتبع الأحداث
- اختبار تجميع الأحداث
- اختبار معالجة الأخطاء

### 10. اختبارات utm.ts

```bash
# إنشاء الملف
touch src/__tests__/utils/lib/utm.test.ts
```

**المطلوب**:

- اختبار تحليل معاملات UTM
- اختبار تخزين البيانات
- اختبار استرجاع البيانات

---

## 📈 المهام المتقدمة (الأسبوع الثالث)

### 11. تحسين اختبارات LoginScreen

**الهدف**: رفع التغطية من 5.14% إلى 70%+

**الاختبارات المطلوبة**:

- اختبار صحة تنسيق البريد الإلكتروني
- اختبار متطلبات كلمة المرور
- اختبار تسجيل الدخول ببيانات صحيحة
- اختبار تسجيل الدخول ببيانات خاطئة
- اختبار حالة التحميل
- اختبار التنقل إلى نسيان كلمة المرور
- اختبار التنقل إلى التسجيل

### 12. تحسين اختبارات RegisterScreen

**الهدف**: رفع التغطية من 3.29% إلى 70%+

**الاختبارات المطلوبة**:

- اختبار التحقق من جميع حقول النموذج
- اختبار التسجيل الناجح
- اختبار أخطاء التسجيل
- اختبار صحة تنسيق رقم الهاتف
- اختبار قبول الشروط والأحكام

### 13. تحسين اختبارات CartScreen

**الهدف**: رفع التغطية من 7.69% إلى 70%+

**الاختبارات المطلوبة**:

- اختبار عرض عناصر السلة
- اختبار تحديث كميات العناصر
- اختبار إزالة العناصر من السلة
- اختبار حساب السعر الإجمالي
- اختبار تطبيق الخصومات
- اختبار المتابعة إلى الدفع

---

## 🔧 الأدوات المطلوبة

### 1. تحسين ملف test-utils

```typescript
// src/test-utils/renderWithProviders.tsx
import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { CartProvider } from "../../context/CartContext";
import { ThemeProvider } from "../../context/ThemeContext";

export const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      <ThemeProvider>
        <CartProvider>
          {component}
        </CartProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
};
```

### 2. إنشاء بيانات وهمية

```typescript
// src/test-utils/mockData.ts
export const mockUser = {
  _id: "user123",
  fullName: "أحمد محمد",
  email: "ahmed@example.com",
  phone: "+967712345678",
  role: "user",
};

export const mockProduct = {
  _id: "product123",
  name: "منتج تجريبي",
  price: 100,
  description: "وصف المنتج",
  images: ["image1.jpg"],
  category: "category1",
};

export const mockCartItem = {
  _id: "item123",
  product: mockProduct,
  quantity: 2,
  price: 100,
};
```

### 3. إنشاء دوال مساعدة

```typescript
// src/test-utils/testHelpers.ts
export const waitForElement = (callback: () => any, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error("Element not found within timeout"));
        } else {
          setTimeout(check, 50);
        }
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 50);
        }
      }
    };

    check();
  });
};
```

---

## 📊 تتبع التقدم

### جدول التقدم الأسبوعي

| الأسبوع   | المهام المستهدفة                                                      | التغطية المتوقعة | الحالة         |
| --------- | --------------------------------------------------------------------- | ---------------- | -------------- |
| الأسبوع 1 | DynamicFAB, GamePackagesScreen, token.ts                              | +5%              | ✅ مكتمل       |
| الأسبوع 2 | DeliveryWorkingHours, LogsScreen, MyTransactionsScreen, PayBillScreen | +8%              | 🔄 قيد التنفيذ |
| الأسبوع 3 | uploadFileToBunny, track, utm                                         | +5%              | ⏳ قادم        |
| الأسبوع 4 | تحسين LoginScreen, RegisterScreen                                     | +10%             | ⏳ قادم        |
| الأسبوع 5 | تحسين CartScreen, ProductDetailsScreen                                | +8%              | ⏳ قادم        |
| الأسبوع 6 | اختبارات E2E والأداء                                                  | +4%              | ⏳ قادم        |

### الأهداف النهائية

- **التغطية الإجمالية**: 70%+
- **البيانات (Statements)**: 70%+
- **الفروع (Branches)**: 70%+
- **الدوال (Functions)**: 70%+
- **الأسطر (Lines)**: 70%+

---

## 🚀 أوامر التنفيذ

### تشغيل الاختبارات الجديدة

```bash
# تشغيل اختبارات DynamicFAB
npm test -- --testPathPattern=DynamicFAB

# تشغيل اختبارات GamePackagesScreen
npm test -- --testPathPattern=GamePackagesScreen

# تشغيل اختبارات token
npm test -- --testPathPattern=token.test

# تشغيل جميع الاختبارات مع التغطية
npm test -- --coverage --watchAll=false
```

### مراقبة التغطية

```bash
# عرض تقرير التغطية
npm run test:cov

# تشغيل الاختبارات في وضع المراقبة
npm run test:watch
```

---

## ⚡ نصائح للتنفيذ السريع

### 1. استخدم القوالب الجاهزة

- استخدم اختبارات DynamicFAB و GamePackagesScreen كقوالب
- انسخ الهيكل الأساسي وعدل المحتوى

### 2. ركز على الاختبارات الأساسية أولاً

- اختبارات العرض (Render)
- اختبارات التفاعل (User Interaction)
- اختبارات الأخطاء (Error Handling)

### 3. استخدم Mocking بكفاءة

- Mock جميع التبعيات الخارجية
- استخدم بيانات وهمية واقعية
- اختبر حالات النجاح والفشل

### 4. اتبع نمط AAA

- **Arrange**: إعداد البيانات والـ mocks
- **Act**: تنفيذ الإجراء المطلوب
- **Assert**: التحقق من النتائج

---

## 🎯 الخلاصة

**البدء فوراً** بتنفيذ المهام العاجلة في الأسبوع الأول لتحقيق:

- ✅ رفع التغطية بـ 5% فوراً
- ✅ إكمال اختبارات المكونات الأساسية
- ✅ إكمال اختبارات شاشات المحفظة
- ✅ إكمال اختبارات الأدوات المساعدة

**الهدف النهائي**: الوصول إلى 70%+ تغطية خلال 6 أسابيع.

---

_تم إنشاء هذه الخطة في: ${new Date().toLocaleDateString('ar-SA')}_
_الحالة: جاهز للتنفيذ الفوري_
