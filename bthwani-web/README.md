# بثواني - تطبيق ويب للتوصيل السريع

تطبيق ويب كامل مبني بـ React 19 و TypeScript لخدمة التوصيل السريع، يحاكي تطبيق React Native الأصلي.

## 🚀 المميزات

- ✅ **React 19** مع TypeScript
- ✅ **Tailwind CSS** للتصميم
- ✅ **React Router** للتنقل
- ✅ **Zustand** لإدارة الحالة
- ✅ **Firebase Authentication** للمصادقة
- ✅ **i18next** للترجمة (عربي/إنجليزي)
- ✅ **Axios** للتعامل مع API
- ✅ **React Hot Toast** للإشعارات
- ✅ **Swiper** للسلايدرات
- ✅ **Lucide React** للأيقونات
- ✅ دعم RTL كامل

## 📁 البنية

### ملفات SEO وتحسين محركات البحث
```
public/
├── .htaccess              # إعدادات خادم Apache لـ SPA وSEO
├── browserconfig.xml      # إعدادات متصفح Microsoft Edge
├── manifest.json          # ملف PWA مع دعم اللغة العربية واليمن
├── robots.txt            # تعليمات محركات البحث
└── sitemap.xml           # خريطة الموقع للفهرسة
```

## 🔍 تحسين محركات البحث (SEO)

تم تحسين التطبيق بشكل شامل لمحركات البحث مع دعم خاص للسوق اليمني:

### ✅ Meta Tags محسنة
- **العنوان الرئيسي**: محدث ليشمل "اليمن" بدلاً من "السعودية"
- **الوصف**: مُحسن للكلمات المفتاحية اليمنية (صنعاء، عدن، تعز، إلخ)
- **الكلمات المفتاحية**: محدثة لتشمل المدن اليمنية الرئيسية

### ✅ Open Graph & Twitter Cards
- صور مشاركة محدثة لوسائل التواصل الاجتماعي
- دعم اللغة العربية مع locale `ar_YE`
- وصف محدث للسوق اليمني

### ✅ Schema.org Markup
- بيانات هيكلية محدثة للسوق اليمني
- معلومات المنظمة محدثة لليمن (`YE`)
- نوع الخدمات محدث للخدمات اليمنية

### ✅ ملفات SEO إضافية
- **`.htaccess`**: إعدادات خادم محسنة لـ SPA وأمان
- **`browserconfig.xml`**: دعم متصفح Microsoft Edge
- **`robots.txt`**: تعليمات محركات البحث
- **`sitemap.xml`**: خريطة موقع محدثة

### ✅ دعم اللغة العربية واليمن
- دعم كامل لـ RTL
- ترجمة شاملة للعربية اليمنية
- أيقونات وألوان مناسبة للسوق اليمني

```
src/
├── api/                    # API Services
│   ├── axios-instance.ts   # Axios configuration
│   ├── auth.ts            # Authentication API
│   ├── user.ts            # User API
│   ├── delivery.ts        # Delivery API
│   └── favorites.ts       # Favorites API
├── components/            # React Components
│   ├── common/           # Shared components
│   ├── layout/           # Layout components
│   └── delivery/         # Delivery components
├── contexts/             # React Contexts
│   └── AuthContext.tsx   # Authentication context
├── pages/                # Page components
│   ├── auth/            # Authentication pages
│   ├── delivery/        # Delivery pages
│   ├── cart/            # Cart page
│   ├── orders/          # Orders page
│   ├── favorites/       # Favorites page
│   ├── profile/         # Profile page
│   └── search/          # Search page
├── store/               # Zustand stores
│   └── cartStore.ts     # Cart state management
├── types/               # TypeScript types
│   └── index.ts         # Type definitions
├── utils/               # Utilities
│   ├── i18n.ts         # i18n configuration
│   ├── storage.ts      # Local storage utilities
│   └── firebase.ts     # Firebase configuration
└── App.tsx             # Main app component
```

## 🛠️ التثبيت

```bash
# تثبيت المكتبات
npm install

# نسخ ملف البيئة
cp .env.example .env

# تشغيل خادم التطوير
npm run dev
```

## 📝 نقاط النهاية (API Endpoints)

### Authentication
- `POST /accounts:signUp` - تسجيل مستخدم جديد
- `POST /accounts:signInWithPassword` - تسجيل الدخول
- `POST /token` - تحديث التوكن

### User
- `GET /users/me` - الحصول على بيانات المستخدم
- `PATCH /users/profile` - تحديث الملف الشخصي
- `POST /users/address` - إضافة عنوان
- `PATCH /users/address/:id` - تحديث عنوان
- `DELETE /users/address/:id` - حذف عنوان

### Delivery
- `GET /delivery/categories` - الحصول على الفئات
- `GET /delivery/banners` - الحصول على البانرات
- `GET /delivery/stores` - الحصول على المتاجر
- `GET /delivery/stores/:id` - تفاصيل المتجر
- `GET /delivery/stores/search` - البحث عن متاجر
- `GET /delivery/products` - الحصول على المنتجات
- `GET /delivery/products/:id` - تفاصيل المنتج
- `GET /delivery/products/daily-offers` - العروض اليومية
- `POST /delivery/order` - إنشاء طلب
- `GET /delivery/order/user/:userId` - طلبات المستخدم
- `GET /delivery/order/:id` - تفاصيل الطلب

### Favorites
- `GET /favorites` - الحصول على المفضلة
- `POST /favorites` - إضافة للمفضلة
- `DELETE /favorites/:id` - حذف من المفضلة

## 🎨 الصفحات

### صفحات المصادقة
- `/login` - تسجيل الدخول
- `/register` - إنشاء حساب
- `/forgot-password` - استعادة كلمة المرور
- `/otp-verification` - التحقق من OTP
- `/reset-password` - إعادة تعيين كلمة المرور

### الصفحات الرئيسية (متاحة للجميع)
- `/` - الصفحة الرئيسية
- `/stores` - قائمة المتاجر
- `/categories` - تصنيفات المنتجات
- `/business/:storeId` - تفاصيل المتجر
- `/product/:productId` - تفاصيل المنتج
- `/cart` - سلة التسوق
- `/search` - البحث
- `/akhdimni` - خدمة أخدمني
- `/gas` - طلب دبة الغاز
- `/water` - طلب وايت الماء
- `/select-location` - اختيار الموقع

### الصفحات المحمية (تتطلب تسجيل دخول)
- `/checkout` - إتمام الطلب
- `/payment` - الدفع
- `/orders` - طلباتي
- `/orders/:orderId` - تفاصيل الطلب
- `/profile/edit` - تعديل الملف الشخصي
- `/profile/addresses` - إدارة العناوين
- `/profile/addresses/add` - إضافة عنوان جديد

### الصفحات العامة (مع رسائل تسجيل دخول)
- `/favorites` - المفضلة
- `/notifications` - الإشعارات
- `/profile` - الملف الشخصي

## 🔧 التكوين

### متغيرات البيئة (.env)
قم بتحديث ملف `.env` بالمعلومات التالية:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

# API Configuration
VITE_API_URL=http://your-api-url.com/api/v1

# SEO Configuration (اختياري)
VITE_SITE_URL=https://bthwani.com
VITE_SITE_NAME=بثواني
VITE_SITE_DESCRIPTION=خدمة التوصيل والشحن السريع في اليمن
VITE_SITE_KEYWORDS=توصيل, شحن, دبة الغاز, وايت الماء, خدمة أخدمني, اليمن
```

### ملفات SEO المهمة
- **`index.html`**: يحتوي على جميع Meta tags و Schema markup محسنة لليمن
- **`manifest.json`**: ملف PWA مع دعم اللغة العربية واليمن
- **`.htaccess`**: إعدادات خادم محسنة لـ SPA وSEO
- **`sitemap.xml`**: خريطة موقع محدثة للفهرسة
- **`robots.txt`**: تعليمات محركات البحث

### تحديث الأيقونات لليمن
لاستخدام أيقونة مخصصة لليمن:
1. احفظ الأيقونة المطلوبة كملف PNG
2. استخدم خدمة عبر الإنترنت مثل [favicon.io](https://favicon.io/)
3. حمل المجموعة الكاملة واستبدل الملفات في `public/icons/`

## 📱 المكونات الرئيسية

### Authentication Context
يوفر حالة المصادقة ووظائف تسجيل الدخول/الخروج في جميع أنحاء التطبيق.

### Cart Store
إدارة حالة سلة التسوق باستخدام Zustand مع التخزين المحلي.

### Protected Routes
حماية الصفحات التي تتطلب تسجيل الدخول.

## 🌐 الترجمة

التطبيق يدعم اللغتين العربية والإنجليزية. يمكن التبديل بين اللغات من:
- Header (الزر في الأعلى)
- Profile (صفحة الملف الشخصي)

## 🚀 البناء للإنتاج

```bash
npm run build
```

### نشر الموقع مع تحسينات SEO

بعد البناء، تأكد من:

1. **نسخ جميع ملفات SEO** إلى خادم الويب:
   ```
   ├── .htaccess              # إعدادات الخادم
   ├── browserconfig.xml      # إعدادات Edge
   ├── manifest.json          # ملف PWA
   ├── robots.txt            # تعليمات محركات البحث
   ├── sitemap.xml           # خريطة الموقع
   └── icons/                # جميع الأيقونات
   ```

2. **تأكد من تفعيل mod_rewrite** في خادم Apache
3. **تحقق من صحة الملفات** في Google Search Console
4. **أرسل sitemap.xml** إلى محركات البحث عبر:
   - Google Search Console
   - Bing Webmaster Tools
   - Yandex Webmaster

### فحص SEO
يمكنك فحص تحسينات SEO باستخدام:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Schema Markup Validator](https://validator.schema.org/)

## 📄 الترخيص

MIT License

## 👨‍💻 المطور

تم تطويره بواسطة Manus AI مع تحسينات شاملة للسوق اليمني

### التحديثات الأخيرة:
- ✅ **تحسين SEO شامل** لمحركات البحث اليمنية والعربية
- ✅ **دعم كامل للغة العربية** مع locale `ar_YE`
- ✅ **تحديث جميع المراجع** من السعودية إلى اليمن
- ✅ **إضافة جميع المسارات المطلوبة** للتطبيق الكامل
- ✅ **تحسين الأيقونات والـ PWA** للسوق اليمني
- ✅ **إعداد ملفات SEO متقدمة** (sitemap, robots.txt, manifest)

### المسارات المدعومة:
جميع المسارات محدثة ومحسنة للسوق اليمني مع دعم كامل للـ SEO ومحركات البحث.
