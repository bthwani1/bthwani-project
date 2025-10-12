# خرائط العلاقات (ERD) لمنصة بثواني

## نظرة عامة
توثق هذه الصفحة خرائط العلاقات بين الكيانات (Entity Relationship Diagrams) لقاعدة البيانات في منصة بثواني. تم تصميم هذه المخططات لتوضيح العلاقات بين الكيانات المختلفة والمساعدة في فهم بنية البيانات.

## أسطورة المخطط (Legend)

```
المستطيل: كيان رئيسي (Entity)
البيضاوي: خاصية (Attribute)
الماس: علاقة (Relationship)
السهم: اتجاه العلاقة
الرقم: عددية العلاقة (Cardinality)
```

## مخطط العلاقات الرئيسية

### 1. علاقات المستخدمين والطلبات

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER }o--|| DRIVER : assigned_to
    ORDER }o--|| STORE : contains_products_from
    ORDER }o--|| WALLET : uses_for_payment
    USER ||--o{ WALLET : owns
    USER ||--o{ RATING : gives
    ORDER ||--|| RATING : receives

    USER {
        ObjectId _id PK
        string fullName
        string email UK
        string phone UK
        GeoJSON location
        string role
        boolean isVerified
        date createdAt
    }

    ORDER {
        ObjectId _id PK
        ObjectId user_id FK
        ObjectId driver_id FK
        ObjectId store_id FK
        number price
        string status
        string paymentMethod
        GeoJSON address
        date createdAt
    }

    DRIVER {
        ObjectId _id PK
        string fullName
        string email UK
        string phone UK
        GeoJSON location
        string vehicleType
        boolean isAvailable
        date createdAt
    }

    STORE {
        ObjectId _id PK
        string name
        string category
        GeoJSON location
        boolean isActive
        date createdAt
    }

    WALLET {
        ObjectId _id PK
        ObjectId user_id FK
        number balance
        string currency
        boolean isActive
    }

    RATING {
        ObjectId _id PK
        ObjectId order_id FK
        ObjectId user_id FK
        ObjectId driver_id FK
        ObjectId store_id FK
        number company_rating
        number order_rating
        number driver_rating
        string comments
    }
```

### 2. علاقات المنتجات والمتاجر

```mermaid
erDiagram
    STORE ||--o{ PRODUCT : sells
    PRODUCT ||--o{ ORDER_ITEM : contains
    ORDER ||--o{ ORDER_ITEM : has
    PRODUCT_CATEGORY ||--o{ PRODUCT : belongs_to

    STORE {
        ObjectId _id PK
        string name
        string category
        GeoJSON location
        number deliveryRadius
        number minimumOrder
        boolean isActive
    }

    PRODUCT {
        ObjectId _id PK
        string name
        string description
        number price
        string category
        ObjectId store_id FK
        boolean isAvailable
        array images
        array ingredients
    }

    ORDER_ITEM {
        ObjectId _id PK
        ObjectId order_id FK
        ObjectId product_id FK
        number quantity
        number unitPrice
        string productName
    }

    PRODUCT_CATEGORY {
        string _id PK
        string name
        string nameAr
        string description
        string icon
    }
```

### 3. علاقات المعاملات المالية

```mermaid
erDiagram
    WALLET ||--o{ WALLET_TRANSACTION : has
    PAYMENT_GATEWAY ||--o{ WALLET_TRANSACTION : processes
    ORDER ||--o{ PAYMENT : has
    JOURNAL_ENTRY ||--o{ ACCOUNT : debits_credits

    WALLET {
        ObjectId _id PK
        ObjectId user_id FK
        number balance
        string currency
        date lastUpdated
    }

    WALLET_TRANSACTION {
        ObjectId _id PK
        ObjectId wallet_id FK
        ObjectId user_id FK
        number amount
        string type
        string method
        string status
        string reference UK
        date processedAt
    }

    PAYMENT_GATEWAY {
        ObjectId _id PK
        string name
        string provider UK
        boolean isActive
        object credentials
        array supportedCurrencies
    }

    ORDER {
        ObjectId _id PK
        number price
        number deliveryFee
        number walletUsed
        number cashDue
        string paymentMethod
    }

    JOURNAL_ENTRY {
        ObjectId _id PK
        date date
        string reference UK
        string description
        string type
        string status
        number totalDebit
        number totalCredit
    }

    ACCOUNT {
        ObjectId _id PK
        string code UK
        string name
        string nameAr
        string type
        string category
        number balance
    }
```

### 4. علاقات الإشعارات والتتبع

```mermaid
erDiagram
    USER ||--o{ NOTIFICATION : receives
    DRIVER ||--o{ NOTIFICATION : receives
    STORE ||--o{ NOTIFICATION : receives
    ORDER ||--o{ NOTIFICATION : related_to
    NOTIFICATION_TEMPLATE ||--|| NOTIFICATION : based_on

    USER {
        ObjectId _id PK
        string fullName
        string email
        string phone
        string pushToken
    }

    DRIVER {
        ObjectId _id PK
        string fullName
        string phone
        string pushToken
    }

    STORE {
        ObjectId _id PK
        string name
        string phone
        string email
    }

    ORDER {
        ObjectId _id PK
        string status
        ObjectId user_id FK
        ObjectId driver_id FK
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId recipient_id FK
        string recipientType
        string title
        string body
        string type
        string priority
        object data
        boolean isRead
        date sentAt
        date readAt
    }

    NOTIFICATION_TEMPLATE {
        ObjectId _id PK
        string name
        string type
        string title
        string body
        array variables
        boolean isActive
    }
```

### 5. علاقات السائقين والتتبع

```mermaid
erDiagram
    DRIVER ||--o{ DRIVER_LOCATION : tracks
    DRIVER ||--o{ ORDER : assigned_orders
    DRIVER ||--o{ DRIVER_SHIFT : has_shifts
    DRIVER ||--o{ DRIVER_RATING : receives_ratings

    DRIVER {
        ObjectId _id PK
        string fullName
        string phone
        GeoJSON location
        GeoJSON currentLocation
        boolean isAvailable
        string vehicleType
        object wallet
    }

    DRIVER_LOCATION {
        ObjectId _id PK
        ObjectId driver_id FK
        GeoJSON location
        number speed
        number heading
        number accuracy
        date timestamp
    }

    ORDER {
        ObjectId _id PK
        ObjectId driver_id FK
        string status
        GeoJSON address
        date assignedAt
        date deliveredAt
    }

    DRIVER_SHIFT {
        ObjectId _id PK
        ObjectId driver_id FK
        date startTime
        date endTime
        string status
        number totalDistance
        number totalEarnings
    }

    DRIVER_RATING {
        ObjectId _id PK
        ObjectId driver_id FK
        ObjectId order_id FK
        number rating
        string comments
        date createdAt
    }
```

## مخطط العلاقات المفصل - نموذج الطلبات

```mermaid
graph TB
    subgraph "الكيانات الرئيسية"
        User[المستخدم<br/>User]
        Order[الطلب<br/>Order]
        Driver[السائق<br/>Driver]
        Store[المتجر<br/>Store]
        Product[المنتج<br/>Product]
        Wallet[المحفظة<br/>Wallet]
    end

    subgraph "الكيانات الفرعية"
        OrderItem[عنصر الطلب<br/>OrderItem]
        SubOrder[الطلب الفرعي<br/>SubOrder]
        Address[العنوان<br/>Address]
        Rating[التقييم<br/>Rating]
        Note[الملاحظة<br/>Note]
    end

    subgraph "الكيانات المالية"
        Payment[الدفع<br/>Payment]
        WalletTransaction[معاملة المحفظة<br/>WalletTransaction]
    end

    User -->|1:N| Order
    User -->|1:1| Wallet
    User -->|1:N| Rating

    Order -->|1:N| OrderItem
    Order -->|1:N| SubOrder
    Order -->|1:1| Address
    Order -->|1:1| Rating
    Order -->|1:N| Note
    Order -->|1:N| Payment

    Driver -->|1:N| Order
    Driver -->|1:N| Rating

    Store -->|1:N| Product
    Store -->|1:N| SubOrder
    Store -->|1:N| Rating

    Product -->|1:N| OrderItem

    Wallet -->|1:N| WalletTransaction
    Payment -->|1:N| WalletTransaction

    Address -.->|N:1| User
    Note -.->|N:1| Order

    classDef primary fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef secondary fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef financial fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px

    class User,Order,Driver primary
    class Store,Product,Address secondary
    class Wallet,Payment,WalletTransaction financial
```

## مخطط تدفق البيانات - عملية طلب جديد

```mermaid
sequenceDiagram
    participant U as المستخدم
    participant A as التطبيق
    participant B as الخادم الخلفي
    participant DB as قاعدة البيانات
    participant D as السائق
    participant S as المتجر

    U->>A: اختيار منتجات وإنشاء طلب
    A->>B: إرسال بيانات الطلب
    B->>DB: حفظ الطلب في Orders
    B->>DB: تحديث رصيد المحفظة في Wallets
    B->>DB: إنشاء سجل مالي في WalletTransactions
    B->>S: إشعار المتجر بالطلب الجديد
    B->>B: البحث عن سائق متاح حسب الموقع
    B->>D: إرسال عرض التوصيل
    D-->>B: قبول/رفض العرض
    alt تم قبول العرض
        B->>DB: تحديث حالة الطلب في Orders
        B->>DB: إنشاء سجل تتبع في OrderStatusHistory
        B->>U: إشعار العميل ببدء التوصيل
        D->>S: استلام الطلب من المتجر
        D->>U: توصيل الطلب للعميل
        U-->>B: تأكيد استلام الطلب
        B->>DB: تحديث حالة الطلب إلى "تم التوصيل"
        B->>DB: إضافة تقييم في Ratings
        B->>DB: تحديث إحصائيات السائق في Drivers
    else تم رفض العرض
        B->>B: البحث عن سائق آخر متاح
    end
```

## مصفوفة العلاقات (Relationship Matrix)

| الكيان الرئيسي | Users | Drivers | Orders | Stores | Products | Wallets |
|----------------|-------|---------|--------|--------|----------|---------|
| **Users** | - | N:M | 1:N | N:M | N:M | 1:1 |
| **Drivers** | N:M | - | 1:N | 1:N | N:M | 1:1 |
| **Orders** | 1:N | 1:N | - | N:M | N:M | N:M |
| **Stores** | N:M | 1:N | N:M | - | 1:N | 1:1 |
| **Products** | N:M | N:M | N:M | 1:N | - | N:M |
| **Wallets** | 1:1 | 1:1 | N:M | 1:1 | N:M | - |

### تفسير المصفوفة:
- **1:1**: علاقة واحد لواحد
- **1:N**: علاقة واحد لمتعدد
- **N:M**: علاقة متعدد لمتعدد
- **N:M**: علاقة متعدد لمتعدد (تحتاج جدول وسطي)

## قيود التكامل المرجعي (Referential Integrity)

### قيود الحذف (Cascade Delete Rules)

1. **عند حذف مستخدم**:
   - حذف جميع طلباته (CASCADE)
   - حذف محفظته (CASCADE)
   - حذف تقييماته (CASCADE)
   - إبقاء سجلات التدقيق (RESTRICT)

2. **عند حذف سائق**:
   - إلغاء تكليفه من الطلبات (SET NULL)
   - حذف تقييماته (CASCADE)
   - إبقاء سجل التتبع (RESTRICT)

3. **عند حذف متجر**:
   - إلغاء توفر منتجاته (SET NULL)
   - إلغاء الطلبات الفرعية (SET NULL)
   - حذف منتجاته (CASCADE)

4. **عند حذف منتج**:
   - إزالته من الطلبات (CASCADE)
   - حذف تقييماته (CASCADE)

### قيود التحقق من الصحة (Validation Constraints)

1. **قيود على الطلبات**:
   - السعر يجب أن يكون أكبر من 0
   - حالة الطلب يجب أن تكون من القيم المحددة
   - عنوان التوصيل مطلوب

2. **قيود على المستخدمين**:
   - البريد الإلكتروني صيغته صحيحة
   - رقم الهاتف بالصيغة الصحيحة للبلد
   - كلمة المرور لا تقل عن 8 أحرف

3. **قيود على السائقين**:
   - الموقع مطلوب وصالح جغرافياً
   - نوع المركبة مطلوب
   - حالة التوفر منطقية

## استراتيجية النسخ المتماثل (Replication Strategy)

```mermaid
graph LR
    subgraph "مجموعة النسخ الأساسية (Primary Replica Set)"
        Primary[الخادم الأساسي<br/>Primary]
        Secondary1[الخادم الثانوي 1<br/>Secondary]
        Secondary2[الخادم الثانوي 2<br/>Secondary]
    end

    subgraph "مجموعة النسخ للقراءة (Read Replica Set)"
        ReadPrimary[خادم القراءة الأساسي<br/>Read Primary]
        ReadSecondary1[خادم القراءة الثانوي 1<br/>Read Secondary]
        ReadSecondary2[خادم القراءة الثانوي 2<br/>Read Secondary]
    end

    Primary -->|كتابة متزامنة| Secondary1
    Primary -->|كتابة متزامنة| Secondary2

    ReadPrimary -.->|قراءة فقط| Secondary1
    ReadPrimary -.->|قراءة فقط| Secondary2

    Secondary1 -.->|تزامن غير متزامن| ReadSecondary1
    Secondary2 -.->|تزامن غير متزامن| ReadSecondary2

    classDef primary fill:#ff9800,stroke:#e65100,stroke-width:2px
    classDef secondary fill:#2196f3,stroke:#0d47a1,stroke-width:2px

    class Primary primary
    class Secondary1,Secondary2,ReadPrimary,ReadSecondary1,ReadSecondary2 secondary
```

### إعدادات النسخ المتماثل:
- **نوع النسخ**: Replica Set مع Read Preference
- **عدد النسخ**: 5 خوادم (2 للكتابة، 3 للقراءة)
- **التأخير المسموح**: أقل من 1 ثانية
- **استراتيجية الفشل**: Automatic Failover

---

*آخر تحديث: أكتوبر 2025*
*الإصدار: 1.0.0*
