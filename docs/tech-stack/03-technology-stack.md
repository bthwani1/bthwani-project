# تقنيات وأدوات منصة بثواني

## نظرة عامة تقنية

توثق هذه الوثيقة جميع التقنيات والأدوات المستخدمة في تطوير وتشغيل منصة بثواني، مع التركيز على الغرض من كل تقنية وكيفية استخدامها.

## تقنيات الخلفية (Backend)

### لغات البرمجة والأطر
- **Node.js v18+** - بيئة تشغيل JavaScript على الخادم
- **TypeScript v5.9+** - لغة برمجة للكتابة الثابتة
- **Express.js v4.21+** - إطار عمل ويب سريع ومرن

### قواعد البيانات والتخزين
- **MongoDB v8.15+** - قاعدة بيانات NoSQL للبيانات الرئيسية
- **Mongoose v8.15+** - ODM للتفاعل مع MongoDB
- **Redis v6.0+** - تخزين مؤقت وذاكرة مشتركة للجلسات والمهام
- **BullMQ v5.58+** - نظام إدارة قوائم المهام مع Redis

### المصادقة والأمان
- **JWT (JSON Web Tokens)** - للمصادقة والترخيص
- **bcrypt v6.0+** - لتشفير كلمات المرور
- **helmet v8.1+** - حماية من الثغرات الأمنية الشائعة
- **express-rate-limit v7.5+** - حماية من الهجمات المكثفة
- **cors v2.8+** - إدارة طلبات CORS

### الاتصال في الوقت الفعلي
- **Socket.io v4.8+** - للاتصال ثنائي الاتجاه في الوقت الفعلي
- **Firebase Admin SDK v13.4+** - للإشعارات والمصادقة

### خدمات خارجية
- **nodemailer v7.0+** - إرسال البريد الإلكتروني
- **firebase-admin v13.4+** - إدارة Firebase من الخادم
- **expo-server-sdk v4.0+** - إرسال إشعارات لتطبيقات Expo
- **geolib v3.3+** - حساب المسافات والمواقع الجغرافية

### أدوات التطوير والاختبار
- **ts-node-dev v2.0+** - تطوير مع إعادة التحميل التلقائي
- **typescript v5.9+** - كتابة ثابتة للكود
- **swagger-jsdoc v6.2+** - إنشاء توثيق API تلقائياً
- **swagger-ui-express v5.0+** - عرض توثيق API

## تقنيات الواجهات الأمامية

### تطبيقات الويب
- **React v18.2+** - مكتبة بناء واجهات المستخدم
- **React v19.1+** (للتطبيقات الجديدة) - أحدث إصدار مستقر
- **Vite v6.3+** - أداة بناء سريعة ومحدثة
- **TypeScript v5.8+** - كتابة ثابتة

### إدارة الحالة والبيانات
- **TanStack Query (React Query) v5.85+** - إدارة البيانات والتخزين المؤقت
- **Zustand v5.0+** - إدارة الحالة الخفيفة
- **React Hook Form v7.63+** - إدارة النماذج والتحقق من الصحة

### مكتبات التصميم والواجهة
- **Material-UI (MUI) v7.3+** - مكونات React متقدمة
- **Ant Design v5.26+** - نظام تصميم شامل
- **Tailwind CSS v4.1+** - إطار عمل CSS للتصميم السريع
- **Emotion v11.14+** - كتابة CSS في JavaScript
- **Framer Motion v12.18+** - رسوم متحركة متقدمة

### الخرائط والموقع
- **Google Maps JavaScript API** - عرض الخرائط وخدمات الموقع
- **React Google Maps v2.20+** - تكامل React مع Google Maps
- **Leaflet v1.9+** - بديل مفتوح المصدر للخرائط
- **React Leaflet v4.2+** - تكامل React مع Leaflet

### أدوات إضافية
- **i18next v25.5+** - التدويل واللغات المتعددة
- **React i18next v16.0+** - تكامل i18next مع React
- **React Router v6.22+** - التنقل بين صفحات التطبيق
- **React Helmet Async v2.0+** - إدارة عناوين الصفحات
- **File Saver v2.0+** - حفظ الملفات في المتصفح
- **React Toastify v11.0+** - إشعارات التطبيق
- **Recharts v2.15+** - رسوم بيانية تفاعلية
- **React to Print v3.1+** - طباعة محتوى التطبيق

## تطبيقات الهواتف المحمولة

### إطار العمل الأساسي
- **React Native v0.81+** - تطوير تطبيقات الهواتف المتعددة المنصات
- **Expo SDK v54.0+** - منصة تطوير مبسطة لـ React Native

### التنقل والواجهة
- **React Navigation v7.3+** - نظام التنقل بين الشاشات
  - Bottom Tabs v7.3+
  - Native Stack v7.3+
  - Drawer v7.3+
  - Material Top Tabs v7.2+
- **React Native Paper v5.14+** - مكونات الواجهة الأساسية
- **React Native Elements** - مكونات إضافية

### الخدمات والأدوات
- **Expo Router v6.0+** - نظام التوجيه المبسط
- **AsyncStorage v2.2+** - تخزين البيانات المحلية
- **Expo Notifications v0.32+** - إدارة الإشعارات
- **Expo Location v19.0+** - خدمات تحديد الموقع
- **Expo Image Picker v17.0+** - اختيار الصور من الهاتف
- **Expo File System v19.0+** - التعامل مع نظام الملفات
- **Expo Crypto v15.0+** - خدمات التشفير
- **Expo Clipboard v8.0+** - التعامل مع الحافظة

### الرسوم المتحركة والمرئيات
- **React Native Reanimated v4.1+** - رسوم متحركة عالية الأداء
- **React Native Gesture Handler v2.28+** - معالجة الإيماءات
- **React Native SVG v15.12+** - رسوم SVG متجهة
- **Lottie React Native v7.3+** - رسوم متحركة Lottie
- **React Native Animatable v1.4+** - رسوم متحركة بسيطة

### الخرائط والموقع
- **React Native Maps v1.20+** - عرض الخرائط في التطبيقات
- **Expo Location v19.0+** - خدمات الموقع الجغرافي

### أدوات إضافية
- **React Native Safe Area Context v5.6+** - التعامل مع المناطق الآمنة
- **React Native Screens v4.16+** - تحسين أداء الشاشات
- **React Native Vector Icons v15.0+** - أيقونات متجهة
- **React Native Web v0.21+** - تشغيل التطبيق في المتصفح

## أدوات التطوير والجودة

### فحص وتنسيق الكود
- **ESLint v9.25+** - فحص جودة الكود
- **TypeScript ESLint v8.30+** - قواعد TypeScript لـ ESLint
- **Prettier** - تنسيق الكود التلقائي

### الاختبار
- **Vitest v2.1+** - إطار عمل اختبار سريع
- **Testing Library v16.1+** - أدوات اختبار React
- **Jest v29.7+** - إطار عمل اختبار JavaScript
- **React Testing Library v13.3+** - اختبار مكونات React

### مراقبة الأداء والأخطاء
- **Sentry v10.19+** - مراقبة الأخطاء وتتبع الأداء
- **PostHog v1.275+** - تحليلات المنتج وسلوك المستخدمين

### أدوات البناء والنشر
- **Vite v6.3+** - أداة بناء سريعة للويب
- **Expo CLI v54.0+** - أدوات سطر الأوامر لـ Expo
- **EAS Build** - خدمة بناء التطبيقات من Expo

### تحسين الصور والأصول
- **Sharp v0.32+** - معالجة الصور عالية الأداء
- **Imagemin v8.0+** - ضغط الصور
- **Vite Imagemin Plugin v0.6+** - تحسين الصور أثناء البناء

## خدمات البنية التحتية

### الخدمات السحابية
- **AWS S3** - تخزين الملفات والصور
- **Cloudinary** - خدمة معالجة وتخزين الصور
- **Firebase** - خدمات المصادقة والإشعارات وقاعدة البيانات اللحظية

### بوابات الدفع
- **Stripe** - معالجة الدفعات الإلكترونية
- **PayPal** - بوابة دفع دولية
- **محلي/محدد للمنطقة** - بوابات دفع محلية

### خدمات التواصل
- **Twilio** - خدمات الرسائل النصية والمكالمات
- **SendGrid/Mailgun** - خدمات البريد الإلكتروني
- **Firebase Cloud Messaging** - إشعارات الدفع

### خدمات الخرائط والموقع
- **Google Maps Platform** - خدمات الخرائط والتوجيه
- **Mapbox** (اختياري) - بديل لخدمات الخرائط

## قواعد البيانات والنماذج

### هيكل قاعدة البيانات
```javascript
// مثال على نموذج مستخدم
const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, sparse: true },
  name: { type: String, required: true },
  avatar: { type: String }, // رابط الصورة
  role: {
    type: String,
    enum: ['customer', 'driver', 'vendor', 'marketer', 'admin'],
    default: 'customer'
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'users'
});

// فهرسة جغرافية للبحث عن المستخدمين بالقرب
UserSchema.index({ location: '2dsphere' });
```

### جداول البيانات الرئيسية
- **users** - بيانات المستخدمين
- **orders** - الطلبات والمعاملات
- **products** - منتجات التجار
- **drivers** - بيانات السائقين والمركبات
- **vendors** - بيانات التجار والمتاجر
- **notifications** - الإشعارات والتنبيهات
- **payments** - سجلات المدفوعات
- **reviews** - تقييمات العملاء
- **audit_logs** - سجل العمليات للمراجعة

## خدمات الجدولة والمهام الخلفية

### المهام المجدولة (Cron Jobs)
```javascript
// مثال على مهمة يومية لتنظيف الحسابات غير النشطة
const accountCleanupJob = schedule.scheduleJob('0 2 * * *', async () => {
  // تنظيف الحسابات غير النشطة لمدة 6 أشهر
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  await User.updateMany(
    { lastLogin: { $lt: sixMonthsAgo }, isActive: true },
    { $set: { isActive: false } }
  );
});
```

### قوائم المهام (Queues)
```javascript
// مثال على مهمة إرسال إشعارات الطلبات
const notificationQueue = new Queue('notifications', {
  redis: { host: 'localhost', port: 6379 }
});

await notificationQueue.add('send-order-notification', {
  userId: 'user123',
  orderId: 'order456',
  type: 'order_confirmed'
});
```

## متطلبات التشغيل والنشر

### متطلبات النظام
```bash
# Node.js
node --version # v18.17.0 أو أحدث

# npm أو yarn
npm --version # 9.0.0 أو أحدث

# MongoDB
mongod --version # v5.0 أو أحدث

# Redis
redis-cli --version # v6.0 أو أحدث
```

### متغيرات البيئة المطلوبة
```bash
# قاعدة البيانات
MONGO_URI=mongodb://localhost:27017/bthwani
REDIS_URL=redis://localhost:6379

# المصادقة
JWT_SECRET=your-super-secret-jwt-key
FIREBASE_PROJECT_ID=your-firebase-project

# الخدمات الخارجية
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# بوابات الدفع
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your-paypal-client-id

# تخزين الملفات
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# خدمات الخرائط
GOOGLE_MAPS_API_KEY=your-google-maps-key

# مراقبة الأداء
SENTRY_DSN=https://your-sentry-dsn
```

## استراتيجية الاختبار

### أنواع الاختبارات
1. **اختبار الوحدات** (Unit Tests) - اختبار الوظائف الفردية
2. **اختبار التكامل** (Integration Tests) - اختبار تفاعل المكونات
3. **اختبار النهاية للنهاية** (E2E Tests) - اختبار سير العمل الكامل
4. **اختبار الأداء** (Performance Tests) - قياس سرعة الاستجابة
5. **اختبار الأمان** (Security Tests) - فحص الثغرات الأمنية

### أدوات الاختبار المستخدمة
- **Jest** - إطار عمل اختبار شامل
- **React Testing Library** - اختبار مكونات React
- **Supertest** - اختبار endpoints API
- **Cypress** - اختبار E2E للويب
- **Maestro** - اختبار E2E للهواتف المحمولة

## استراتيجية الصيانة والتحديث

### جدولة التحديثات
- **تحديثات أمنية**: أسبوعياً أو عند الحاجة
- **تحديثات التبعيات**: شهرياً
- **تحديثات المزايا**: حسب خطة التطوير
- **تحديثات البنية التحتية**: كل 3-6 أشهر

### مراقبة الصحة
- **مراقبة الخوادم**: 24/7 عبر أدوات مثل PM2 أو Docker
- **مراقبة قواعد البيانات**: فحص الأداء والمساحة المستخدمة
- **مراقبة الشبكة**: مراقبة وقت الاستجابة والأخطاء
- **مراقبة الأمان**: كشف الهجمات والثغرات

هذا التوثيق يُحدث بانتظام مع إضافة تقنيات جديدة أو تحديث الإصدارات الحالية.
