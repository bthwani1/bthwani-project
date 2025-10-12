# وثيقة المعمارية الشاملة لمنصة بثواني (bThwani)

## نظرة عامة على المنظومة

منصة **بثواني** هي منظومة شاملة متعددة المنصات للتجارة الإلكترونية والخدمات اللوجستية في الشرق الأوسط. توفر المنصة حلول متكاملة تشمل التسوق عبر الإنترنت، خدمات التوصيل، إدارة التجار، إدارة السائقين، والتسويق الرقمي.

## سياق الأعمال

### المشكلة التي تحلها المنصة
- **تفتت الخدمات**: عدم وجود منصة موحدة تجمع بين التجار والعملاء والسائقين
- **صعوبة إدارة العمليات**: نقص في أدوات الإدارة المتكاملة للطلبات والمدفوعات والتتبع
- **تحديات التسويق**: عدم وجود أدوات فعالة للتسويق والترويج للتجار
- **مشاكل اللوجستيات**: صعوبة إدارة أسطول التوصيل والتتبع في الوقت الفعلي

### الجهات المعنية (Stakeholders)
- **العملاء**: مستخدمون يطلبون منتجات وخدمات
- **التجار**: أصحاب المتاجر الذين يبيعون منتجاتهم عبر المنصة
- **السائقين**: مقدمو خدمات التوصيل
- **مسوقي الميدان**: فريق التسويق الميداني
- **الإدارة**: مدراء المنصة والمشرفين
- **نظام ERP**: نظام إدارة الموارد المؤسسية للمحاسبة والمالية

## مخطط C4 - السياق (Context)

```mermaid
graph TB
    subgraph "نظام بثواني الرئيسي"
        subgraph "تطبيقات العملاء"
            CustomerApp[تطبيق العميل<br/>React Native]
            WebApp[الموقع الإلكتروني<br/>React/Vite]
        end

        subgraph "تطبيقات الشركاء"
            VendorApp[تطبيق التاجر<br/>React Native]
            DriverApp[تطبيق السائق<br/>React Native]
            MarketerApp[تطبيق المسوق الميداني<br/>React Native]
        end

        subgraph "أنظمة الإدارة"
            AdminDashboard[لوحة إدارة المشرفين<br/>React/Vite]
            ERP[نظام ERP للمحاسبة<br/>Web-based]
        end

        subgraph "الخدمات الخلفية"
            BackendAPI[خدمة API الرئيسية<br/>Node.js/Express]
            SocketServer[خدمة Socket.io<br/>للتتبع في الوقت الفعلي]
            NotificationService[خدمة الإشعارات<br/>Firebase/Expo]
        end

        subgraph "قواعد البيانات والتخزين"
            MongoDB[(قاعدة بيانات MongoDB)]
            Redis[(ذاكرة Redis التخزين المؤقت)]
            FileStorage[تخزين الملفات<br/>Cloud/Local]
        end

        subgraph "الخدمات الخارجية"
            PaymentGateway[بوابات الدفع<br/>PayPal/Stripe/محلية]
            SMSProvider[خدمات الرسائل النصية]
            EmailProvider[خدمات البريد الإلكتروني]
            MapsService[خدمات الخرائط<br/>Google Maps]
            CloudStorage[تخزين سحابي<br/>AWS S3/Cloudinary]
        end
    end

    %% العلاقات بين المكونات
    CustomerApp --> BackendAPI
    WebApp --> BackendAPI
    VendorApp --> BackendAPI
    DriverApp --> BackendAPI
    MarketerApp --> BackendAPI

    AdminDashboard --> BackendAPI
    ERP --> BackendAPI

    BackendAPI --> MongoDB
    BackendAPI --> Redis
    BackendAPI --> FileStorage

    BackendAPI --> PaymentGateway
    BackendAPI --> SMSProvider
    BackendAPI --> EmailProvider
    BackendAPI --> MapsService
    BackendAPI --> CloudStorage

    SocketServer --> CustomerApp
    SocketServer --> VendorApp
    SocketServer --> DriverApp
    SocketServer --> AdminDashboard

    NotificationService --> CustomerApp
    NotificationService --> VendorApp
    NotificationService --> DriverApp
    NotificationService --> MarketerApp

    %% جهات خارجية
    ExternalUsers[المستخدمون النهائيون] --> CustomerApp
    ExternalUsers --> WebApp

    Merchants[التجار] --> VendorApp
    Drivers[السائقين] --> DriverApp
    Marketers[مسوقو الميدان] --> MarketerApp

    Admins[المشرفين] --> AdminDashboard
    FinanceTeam[فريق المالية] --> ERP
```

## مخطط C4 - الحاويات (Containers)

```mermaid
graph TB
    %% تطبيقات العملاء
    subgraph "تطبيقات العملاء"
        CustomerMobile[تطبيق العميل للهواتف<br/>React Native/Expo]
        CustomerWeb[الموقع الإلكتروني<br/>React/Vite + Tailwind]

        CustomerMobileDB[(AsyncStorage<br/>لتخزين البيانات المحلية)]
        CustomerWebDB[(LocalStorage<br/>للحالة المحلية)]
    end

    %% تطبيقات الشركاء
    subgraph "تطبيقات الشركاء"
        VendorApp[تطبيق التاجر<br/>React Native/Expo]
        DriverApp[تطبيق السائق<br/>React Native/Expo]
        MarketerApp[تطبيق المسوق<br/>React Native/Expo]

        VendorLocalDB[(AsyncStorage<br/>البيانات المحلية)]
        DriverLocalDB[(AsyncStorage<br/>البيانات المحلية)]
        MarketerLocalDB[(AsyncStorage<br/>البيانات المحلية)]
    end

    %% أنظمة الإدارة
    subgraph "أنظمة الإدارة"
        AdminDashboard[لوحة إدارة المشرفين<br/>React/Vite + Material-UI]
        ERPSys[نظام ERP<br/>Web-based Application]

        AdminDB[(Browser Storage<br/>للحالة المحلية)]
    end

    %% خدمات الخلفية
    subgraph "خدمات الخلفية"
        subgraph "خدمة API الرئيسية"
            AuthService[خدمة المصادقة<br/>JWT + Firebase]
            UserService[إدارة المستخدمين]
            OrderService[إدارة الطلبات]
            PaymentService[خدمات الدفع]
            VendorService[إدارة التجار]
            DriverService[إدارة السائقين]
            MarketingService[خدمات التسويق]
            NotificationService[خدمة الإشعارات]
        end

        subgraph "خدمات الوقت الفعلي"
            SocketService[خدمة Socket.io<br/>للتتبع في الوقت الفعلي]
            LocationService[خدمة تتبع الموقع]
        end

        subgraph "خدمات الخلفية"
            QueueService[خدمة المهام<br/>BullMQ + Redis]
            CronService[المهام المجدولة<br/>Node-cron]
            EmailService[خدمة البريد الإلكتروني]
            SMSService[خدمة الرسائل النصية]
        end
    end

    %% قواعد البيانات
    subgraph "قواعد البيانات والتخزين"
        PrimaryDB[(قاعدة البيانات الرئيسية<br/>MongoDB)]
        CacheDB[(Redis Cache<br/>للتخزين المؤقت)]
        FileStorage[تخزين الملفات<br/>محلي/سحابي]
        BackupDB[(نسخ احتياطية<br/>MongoDB Backup)]
    end

    %% الاتصالات
    CustomerMobile --> CustomerMobileDB
    CustomerWeb --> CustomerWebDB

    VendorApp --> VendorLocalDB
    DriverApp --> DriverLocalDB
    MarketerApp --> MarketerLocalDB

    AdminDashboard --> AdminDB

    %% اتصال التطبيقات بالخدمات الخلفية
    CustomerMobile --> BackendAPI
    CustomerWeb --> BackendAPI
    VendorApp --> BackendAPI
    DriverApp --> BackendAPI
    MarketerApp --> BackendAPI
    AdminDashboard --> BackendAPI
    ERPSys --> BackendAPI

    %% الخدمات الخلفية وقواعد البيانات
    AuthService --> PrimaryDB
    UserService --> PrimaryDB
    OrderService --> PrimaryDB
    PaymentService --> PrimaryDB
    VendorService --> PrimaryDB
    DriverService --> PrimaryDB
    MarketingService --> PrimaryDB
    NotificationService --> PrimaryDB

    QueueService --> CacheDB
    LocationService --> CacheDB

    EmailService --> PrimaryDB
    SMSService --> PrimaryDB

    CronService --> PrimaryDB

    FileStorage --> BackendAPI

    %% خدمات النسخ الاحتياطي
    BackupDB --> PrimaryDB
```

## مخطط C4 - المكونات (Components) - الباك إند

```mermaid
graph TB
    %% طبقة العرض (Routes/Controllers)
    subgraph "طبقة العرض"
        subgraph "مسارات المصادقة"
            AuthRoutes[مسارات المصادقة<br/>JWT + Firebase]
            PasswordRoutes[إعادة تعيين كلمة المرور]
            OTPRoutes[التحقق بالرمز المؤقت]
        end

        subgraph "مسارات العملاء"
            UserRoutes[مسارات المستخدمين]
            FavoritesRoutes[المفضلة]
            ProfileRoutes[الملف الشخصي]
        end

        subgraph "مسارات التجار"
            VendorRoutes[مسارات التجار]
            VendorSettlementRoutes[التسويات المالية]
            VendorProductRoutes[إدارة المنتجات]
        end

        subgraph "مسارات السائقين"
            DriverRoutes[مسارات السائقين]
            DriverWithdrawalRoutes[طلبات السحب]
            DriverVacationRoutes[الإجازات]
        end

        subgraph "مسارات الطلبات"
            OrderRoutes[إدارة الطلبات]
            CartRoutes[سلة التسوق]
            DeliveryRoutes[خدمات التوصيل]
        end

        subgraph "مسارات الإدارة"
            AdminRoutes[مسارات المشرفين]
            AdminUserRoutes[إدارة المستخدمين]
            AdminDriverRoutes[إدارة السائقين]
            AdminVendorRoutes[إدارة التجار]
        end
    end

    %% طبقة الأعمال (Services)
    subgraph "طبقة الأعمال"
        subgraph "خدمات المستخدمين"
            UserService[خدمة المستخدمين]
            AuthService[خدمة المصادقة]
            NotificationService[خدمة الإشعارات]
        end

        subgraph "خدمات التجارة"
            OrderService[خدمة الطلبات]
            PaymentService[خدمة المدفوعات]
            WalletService[خدمة المحفظة]
            VendorService[خدمة التجار]
        end

        subgraph "خدمات اللوجستيات"
            DriverService[خدمة السائقين]
            LocationService[خدمة الموقع]
            DispatchService[خدمة التوزيع]
        end

        subgraph "خدمات التسويق"
            MarketingService[خدمة التسويق]
            CampaignService[خدمة الحملات]
            SegmentService[خدمة التجزئة]
        end

        subgraph "خدمات المالية"
            FinanceService[خدمة المالية]
            AccountingService[خدمة المحاسبة]
            WalletService[خدمة المحفظة]
        end
    end

    %% طبقة البيانات (Models/Repositories)
    subgraph "طبقة البيانات"
        subgraph "نماذج المستخدمين"
            UserModel[نموذج المستخدم]
            DriverModel[نموذج السائق]
            VendorModel[نموذج التاجر]
            MarketerModel[نموذج المسوق]
        end

        subgraph "نماذج الأعمال"
            OrderModel[نموذج الطلب]
            ProductModel[نموذج المنتج]
            CartModel[نموذج سلة التسوق]
            PaymentModel[نموذج الدفع]
        end

        subgraph "نماذج النظام"
            NotificationModel[نموذج الإشعارات]
            AuditModel[نموذج التدقيق]
            SettingsModel[نموذج الإعدادات]
        end
    end

    %% قواعد البيانات
    subgraph "قواعد البيانات"
        MongoDB[(MongoDB<br/>قاعدة البيانات الرئيسية)]
        RedisDB[(Redis<br/>التخزين المؤقت)]
        FileSystem[نظام الملفات<br/>للصور والملفات]
    end

    %% وسطاء الطلبات (Middleware)
    subgraph "وسطاء الطلبات"
        AuthMiddleware[التحقق من المصادقة]
        RoleMiddleware[التحقق من الصلاحيات]
        ValidationMiddleware[التحقق من صحة البيانات]
        SecurityMiddleware[الحماية الأمنية]
        RateLimitMiddleware[تحديد معدل الطلبات]
    end

    %% الاتصالات بين الطبقات
    AuthRoutes --> AuthMiddleware
    UserRoutes --> AuthMiddleware
    VendorRoutes --> AuthMiddleware
    DriverRoutes --> AuthMiddleware
    OrderRoutes --> AuthMiddleware
    AdminRoutes --> AuthMiddleware

    AuthMiddleware --> RoleMiddleware
    RoleMiddleware --> ValidationMiddleware
    ValidationMiddleware --> SecurityMiddleware
    SecurityMiddleware --> RateLimitMiddleware

    AuthRoutes --> AuthService
    UserRoutes --> UserService
    VendorRoutes --> VendorService
    DriverRoutes --> DriverService
    OrderRoutes --> OrderService
    AdminRoutes --> AdminService

    AuthService --> UserModel
    UserService --> UserModel
    VendorService --> VendorModel
    DriverService --> DriverModel
    OrderService --> OrderModel

    UserModel --> MongoDB
    DriverModel --> MongoDB
    VendorModel --> MongoDB
    OrderModel --> MongoDB
    ProductModel --> MongoDB
    PaymentModel --> MongoDB
    NotificationModel --> MongoDB

    LocationService --> RedisDB
    DispatchService --> RedisDB

    FileSystem --> VendorService
    FileSystem --> UserService
```

## خرائط التدفقات الأساسية

### تدفق طلب جديد

```mermaid
sequenceDiagram
    participant C as العميل
    participant CA as تطبيق العميل
    participant B as الباك إند
    participant V as التاجر
    participant D as السائق
    participant P as بوابة الدفع

    C->>CA: اختيار منتجات وإضافة للسلة
    CA->>B: إرسال طلب إنشاء سلة تسوق
    B-->>CA: تأكيد إنشاء السلة

    C->>CA: تأكيد الطلب واختيار طريقة الدفع
    CA->>P: معالجة الدفع
    P-->>CA: تأكيد الدفع
    CA->>B: إرسال طلب إنشاء طلب جديد

    B->>V: إشعار التاجر بالطلب الجديد
    B->>B: البحث عن سائق متاح
    B->>D: إرسال عرض توصيل للسائق

    alt السائق يقبل العرض
        D-->>B: قبول عرض التوصيل
        B->>V: إرسال تأكيد للتاجر
        B->>C: إشعار العميل ببدء التوصيل
        D->>V: استلام الطلب من التاجر
        D->>C: توصيل الطلب للعميل
        C-->>B: تأكيد استلام الطلب
        B->>D: إشعار السائق بإتمام التوصيل
        B->>V: إشعار التاجر بإتمام الطلب
    else السائق يرفض العرض
        B->>B: البحث عن سائق آخر
    end
```

### تدفق التسجيل والمصادقة

```mermaid
graph TD
    A[بدء التسجيل] --> B{اختيار نوع المستخدم}
    B -->|عميل| C[إدخال البيانات الأساسية]
    B -->|تاجر| D[إدخال بيانات المتجر]
    B -->|سائق| E[إدخال بيانات المركبة والترخيص]
    B -->|مسوق ميداني| F[إدخال بيانات التسويق]

    C --> G[التحقق من رقم الهاتف عبر OTP]
    D --> H[مراجعة المستندات والموافقة]
    E --> I[مراجعة التراخيص والموافقة]
    F --> J[تفعيل حساب المسوق]

    G --> K[إنشاء حساب وإصدار JWT]
    H --> L[إنشاء حساب التاجر]
    I --> M[إنشاء حساب السائق]
    J --> N[إنشاء حساب المسوق]

    K --> O[تسجيل دخول ناجح]
    L --> P[تسجيل دخول ناجح]
    M --> Q[تسجيل دخول ناجح]
    N --> R[تسجيل دخول ناجح]
```

## التكنولوجيات المستخدمة

### الخدمات الخلفية (Backend)
- **Node.js** مع **TypeScript** لتطوير الخدمات
- **Express.js** كإطار عمل للويب
- **MongoDB** مع **Mongoose** لقاعدة البيانات
- **Socket.io** للاتصال في الوقت الفعلي
- **Redis** للتخزين المؤقت والمهام
- **BullMQ** لإدارة قوائم المهام
- **Firebase Admin** للإشعارات والمصادقة
- **JWT** للمصادقة والترخيص

### تطبيقات الويب
- **React 18/19** مع **TypeScript**
- **Vite** لبناء وتطوير التطبيقات
- **Material-UI (MUI)** لمكونات الواجهة
- **Ant Design** لمكونات إضافية
- **Tailwind CSS** للتصميم المخصص
- **React Query/TanStack Query** لإدارة البيانات
- **Zustand** لإدارة الحالة
- **React Router** للتنقل
- **React Hook Form** لإدارة النماذج
- **i18next** للتدويل

### تطبيقات الهواتف المحمولة
- **React Native** مع **Expo** للتطوير السريع
- **React Navigation** للتنقل بين الشاشات
- **AsyncStorage** للتخزين المحلي
- **Expo Notifications** للإشعارات
- **Expo Location** لخدمات الموقع
- **React Native Maps** للخرائط
- **React Native Paper** لمكونات الواجهة
- **Lottie React Native** للرسوم المتحركة

### أدوات التطوير والنشر
- **TypeScript** للكتابة الثابتة
- **ESLint** لفحص جودة الكود
- **Vitest/Jest** للاختبارات
- **Docker** للحاوية
- **Swagger** لتوثيق API
- **Postman** لاختبار API

## متطلبات التشغيل

### متطلبات النظام
- **Node.js** v18+
- **MongoDB** v5.0+
- **Redis** v6.0+
- **Nginx** (اختياري) للخادم الوكيل

### متغيرات البيئة المطلوبة
```bash
# قاعدة البيانات
MONGO_URI=mongodb://localhost:27017/bthwani
REDIS_URL=redis://localhost:6379

# المصادقة والأمان
JWT_SECRET=your-secret-key
FIREBASE_PROJECT_ID=your-project-id

# الخدمات الخارجية
SMTP_HOST=smtp.gmail.com
SMS_API_KEY=your-sms-api-key

# بوابات الدفع
STRIPE_SECRET_KEY=your-stripe-secret
PAYPAL_CLIENT_ID=your-paypal-client-id

# تخزين الملفات
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
AWS_S3_BUCKET=your-s3-bucket
```

## استراتيجية الأمان

### طبقات الحماية
1. **التحقق من المصادقة** (JWT + Firebase)
2. **التحقق من الصلاحيات** (RBAC - Role Based Access Control)
3. **حماية من الهجمات** (Rate Limiting, CORS, Helmet)
4. **تشفير البيانات** (bcrypt لكلمات المرور)
5. **تسجيل العمليات** (Audit Trail)

### نقاط الضعف المحتملة وطرق الحماية
- **SQL Injection**: استخدام MongoDB بدلاً من SQL
- **XSS Attacks**: تعقيم البيانات المدخلة
- **CSRF**: استخدام JWT بدلاً من الكوكيز
- **Rate Limiting**: حماية من الهجمات المكثفة
- **Input Validation**: التحقق من صحة جميع البيانات المدخلة

## استراتيجية قابلية التطوير

### قواعد التطوير
1. **فصل المسؤوليات** (Separation of Concerns)
2. **الاعتمادية العكسية** (Dependency Inversion)
3. **الواجهات الموحدة** (Consistent APIs)
4. **اختبار الوحدات** (Unit Testing)
5. **التكامل المستمر** (CI/CD)

### خطة التطوير المستقبلية
- [ ] فصل قاعدة البيانات حسب الخدمة (Microservices)
- [ ] إضافة خدمة مراقبة الأداء (Monitoring Service)
- [ ] تطبيق استراتيجية التخزين المؤقت المتقدم (Advanced Caching)
- [ ] إضافة خدمة معالجة الصور (Image Processing Service)
- [ ] تطوير خدمة الذكاء الاصطناعي للتوصيات (AI Recommendation Engine)

## الروابط والمستودعات

### المستودعات الرئيسية
- **الباك إند**: `Backend/` - خدمة API الرئيسية
- **لوحة الإدارة**: `admin-dashboard/` - لوحة تحكم المشرفين
- **الموقع الإلكتروني**: `bthwani-web/` - واجهة العملاء
- **تطبيق العميل**: `bThwaniApp/` - تطبيق الهاتف للعملاء
- **تطبيق السائق**: `rider-app/` - تطبيق الهاتف للسائقين
- **تطبيق التاجر**: `vendor-app/` - تطبيق الهاتف للتجار
- **تطبيق المسوق الميداني**: `field-marketers/` - تطبيق الهاتف للمسوقين

### الوثائق التقنية
- **توثيق API**: `/api-docs` (متوفر عبر Swagger UI)
- **دليل التشغيل**: `docs/`
- **كتب التشغيل**: `ops/runbooks/`

## مؤشرات الأداء الرئيسية (KPIs)

### مؤشرات الأعمال
- **عدد الطلبات اليومية** (Daily Orders)
- **قيمة الطلب المتوسطة** (Average Order Value)
- **معدل الاحتفاظ بالعملاء** (Customer Retention Rate)
- **وقت التوصيل المتوسط** (Average Delivery Time)

### مؤشرات تقنية
- **وقت استجابة الخادم** (Response Time < 200ms)
- **معدل توفر الخدمة** (Uptime > 99.9%)
- **معدل الخطأ** (Error Rate < 0.1%)
- **وقت التحميل** (Page Load Time < 3s)

---

هذه الوثيقة تُحدث بانتظام مع تطور المنصة وإضافة المزايا الجديدة.
