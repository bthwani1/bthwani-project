# استراتيجية الترحيل والتهيئة (Migration & Seed Strategy)

## نظرة عامة
توثق هذه الوثيقة استراتيجية شاملة لإدارة ترحيل قاعدة البيانات (Migrations) وتهيئة البيانات الأولية (Seeds) في منصة بثواني. تشمل الاستراتيجية آليات الترحيل الآمن، إدارة الإصدارات، واستراتيجية النسخ الاحتياطي والاستعادة.

## فلسفة الترحيل

### مبادئ التصميم
1. **الأمان أولاً**: عدم فقدان البيانات تحت أي ظرف
2. **التراجع السهل**: إمكانية التراجع عن أي ترحيل
3. **التكرارية**: يمكن تشغيل نفس الترحيل عدة مرات بأمان
4. **التوثيق الشامل**: توثيق كل تغيير وحجته
5. **الاختبار المسبق**: اختبار جميع الترحيلات في بيئة التطوير

## هيكل نظام الترحيل

### مجلدات الترحيل
```
Backend/src/
├── migrations/
│   ├── current/           # الترحيلات الحالية
│   ├── archive/          # الترحيلات المكتملة
│   └── templates/        # قوالب الترحيل
├── seeds/                # بيانات التهيئة
│   ├── development/      # بيانات التطوير
│   ├── staging/         # بيانات الاختبار
│   └── production/      # بيانات الإنتاج
└── migration-runner.js   # مشغل الترحيل
```

### تسمية الترحيلات
```
YYYYMMDD_HHMMSS_description.js
```
**أمثلة:**
- `20241015_090000_add_user_verification_fields.js`
- `20241016_143000_create_driver_wallet_schema.js`
- `20241017_110000_add_order_tracking_fields.js`

## أنواع الترحيلات

### 1. ترحيلات البنية (Schema Migrations)

#### إضافة حقول جديدة
```javascript
// migrations/20241015_090000_add_user_verification_fields.js
module.exports = {
  async up(db) {
    await db.collection('users').updateMany(
      {},
      {
        $set: {
          emailVerificationToken: null,
          emailVerificationExpires: null,
          smsVerificationToken: null,
          smsVerificationExpires: null
        }
      }
    );

    // إضافة فهرس للحقول الجديدة
    await db.collection('users').createIndex(
      {
        emailVerificationToken: 1,
        emailVerificationExpires: 1
      },
      { sparse: true }
    );
  },

  async down(db) {
    await db.collection('users').updateMany(
      {},
      {
        $unset: {
          emailVerificationToken: "",
          emailVerificationExpires: "",
          smsVerificationToken: "",
          smsVerificationExpires: ""
        }
      }
    );
  }
};
```

#### إنشاء مجموعة جديدة
```javascript
// migrations/20241016_143000_create_driver_wallet_schema.js
module.exports = {
  async up(db) {
    await db.createCollection('driverwallets', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["driverId", "balance"],
          properties: {
            driverId: {
              bsonType: "objectId",
              description: "معرف السائق"
            },
            balance: {
              bsonType: "number",
              minimum: 0,
              description: "الرصيد الحالي"
            }
          }
        }
      }
    });

    // إنشاء الفهارس المطلوبة
    await db.collection('driverwallets').createIndex(
      { driverId: 1 },
      { unique: true }
    );
  },

  async down(db) {
    await db.collection('driverwallets').drop();
  }
};
```

### 2. ترحيلات البيانات (Data Migrations)

#### تحديث البيانات الموجودة
```javascript
// migrations/20241017_110000_update_order_status_enum.js
module.exports = {
  async up(db) {
    // تحديث حالات الطلبات القديمة
    await db.collection('deliveryorders').updateMany(
      { status: 'confirmed' },
      { $set: { status: 'under_review' } }
    );

    await db.collection('deliveryorders').updateMany(
      { status: 'preparation' },
      { $set: { status: 'preparing' } }
    );
  },

  async down(db) {
    // استرجاع الحالات القديمة
    await db.collection('deliveryorders').updateMany(
      { status: 'under_review' },
      { $set: { status: 'confirmed' } }
    );

    await db.collection('deliveryorders').updateMany(
      { status: 'preparing' },
      { $set: { status: 'preparation' } }
    );
  }
};
```

#### نقل البيانات بين المجموعات
```javascript
// migrations/20241018_150000_migrate_user_wallets.js
module.exports = {
  async up(db) {
    const users = await db.collection('users').find({
      'wallet.balance': { $exists: true, $gt: 0 }
    }).toArray();

    for (const user of users) {
      await db.collection('wallets').insertOne({
        userId: user._id,
        balance: user.wallet.balance,
        currency: user.wallet.currency || 'YER',
        createdAt: new Date(),
        migratedFrom: 'user_wallet_field'
      });
    }
  },

  async down(db) {
    // حذف المحافظ المنقولة
    await db.collection('wallets').deleteMany({
      migratedFrom: 'user_wallet_field'
    });
  }
};
```

## استراتيجية التهيئة (Seeding)

### 1. بيانات النظام الأساسية

#### حسابات المدراء
```javascript
// seeds/system/admin-users.js
module.exports = [
  {
    fullName: "مدير النظام الرئيسي",
    email: "admin@bthwani.com",
    phone: "+967-1-000000",
    role: "super_admin",
    isVerified: true,
    password: "$2a$10$...", // hashed password
    permissions: ["*"],
    createdAt: new Date()
  },
  {
    fullName: "مدير الدعم الفني",
    email: "support@bthwani.com",
    phone: "+967-1-000001",
    role: "admin",
    isVerified: true,
    password: "$2a$10$...",
    permissions: [
      "users.view",
      "users.edit",
      "orders.view",
      "orders.edit",
      "support.manage"
    ],
    createdAt: new Date()
  }
];
```

#### إعدادات النظام الأولية
```javascript
// seeds/system/system-settings.js
module.exports = [
  {
    _id: "app.name",
    value: "بثواني",
    type: "string",
    category: "general",
    description: "اسم التطبيق المعروض للمستخدمين"
  },
  {
    _id: "payment.currency",
    value: "YER",
    type: "string",
    category: "payment",
    description: "العملة الافتراضية للمدفوعات"
  },
  {
    _id: "notification.sms_enabled",
    value: true,
    type: "boolean",
    category: "notification",
    description: "تفعيل الرسائل النصية"
  }
];
```

### 2. بيانات التطوير والاختبار

#### مستخدمين تجريبيين
```javascript
// seeds/development/sample-users.js
module.exports = [
  {
    fullName: "أحمد محمد علي",
    email: "ahmed@example.com",
    phone: "+967-1-234567",
    role: "user",
    isVerified: true,
    addresses: [{
      label: "المنزل",
      street: "شارع التحرير",
      city: "صنعاء",
      location: { lat: 15.3694, lng: 44.1910 }
    }],
    wallet: {
      balance: 10000,
      currency: "YER"
    },
    createdAt: new Date()
  }
];
```

#### متاجر تجريبية
```javascript
// seeds/development/sample-stores.js
module.exports = [
  {
    name: "مطعم الرياض التجريبي",
    description: "مطعم متخصص في المأكولات العربية التقليدية",
    phone: "+967-1-765432",
    email: "riyadh@restaurant.com",
    category: "restaurant",
    subcategory: "traditional",
    location: {
      type: "Point",
      coordinates: [44.1910, 15.3694]
    },
    address: {
      street: "شارع الزبيري",
      city: "صنعاء",
      country: "اليمن",
      location: { lat: 15.3694, lng: 44.1910 }
    },
    deliveryRadius: 5,
    minimumOrder: 500,
    deliveryFee: 200,
    isActive: true,
    isVerified: true,
    isOpen: true,
    createdAt: new Date()
  }
];
```

### 3. بيانات الإنتاج الأولية

#### فئات المنتجات الأساسية
```javascript
// seeds/production/product-categories.js
module.exports = [
  {
    _id: "food",
    name: "طعام",
    nameAr: "طعام",
    icon: "restaurant",
    subcategories: [
      { _id: "burgers", name: "برجر", nameAr: "برجر" },
      { _id: "pizza", name: "بيتزا", nameAr: "بيتزا" },
      { _id: "traditional", name: "تقليدي", nameAr: "تقليدي" }
    ]
  },
  {
    _id: "groceries",
    name: "بقالة",
    nameAr: "بقالة",
    icon: "shopping_cart",
    subcategories: [
      { _id: "fruits", name: "فواكه", nameAr: "فواكه" },
      { _id: "vegetables", name: "خضروات", nameAr: "خضروات" }
    ]
  }
];
```

## آلية تشغيل الترحيل

### 1. مشغل الترحيل الرئيسي

```javascript
// migration-runner.js
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

class MigrationRunner {
  constructor(connectionString, databaseName) {
    this.connectionString = connectionString;
    this.databaseName = databaseName;
    this.client = new MongoClient(connectionString);
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db(this.databaseName);
    await this.ensureMigrationCollection();
  }

  async ensureMigrationCollection() {
    const collections = await this.db.listCollections({ name: 'migrations' }).toArray();
    if (collections.length === 0) {
      await this.db.createCollection('migrations');
      await this.db.collection('migrations').createIndex({ filename: 1 }, { unique: true });
    }
  }

  async getExecutedMigrations() {
    const executed = await this.db.collection('migrations').find({}).toArray();
    return executed.map(m => m.filename);
  }

  async markMigrationAsExecuted(filename) {
    await this.db.collection('migrations').insertOne({
      filename,
      executedAt: new Date(),
      success: true
    });
  }

  async runMigrations(direction = 'up') {
    await this.connect();

    const migrationsDir = path.join(__dirname, 'migrations', 'current');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    const executedMigrations = await this.getExecutedMigrations();

    for (const file of files) {
      if (!executedMigrations.includes(file)) {
        console.log(`Running migration: ${file}`);

        try {
          const migration = require(path.join(migrationsDir, file));

          if (direction === 'up' && migration.up) {
            await migration.up(this.db);
          } else if (direction === 'down' && migration.down) {
            await migration.down(this.db);
          }

          await this.markMigrationAsExecuted(file);
          console.log(`✅ Migration ${file} completed successfully`);
        } catch (error) {
          console.error(`❌ Migration ${file} failed:`, error);
          throw error;
        }
      }
    }
  }

  async rollbackLastMigration() {
    await this.connect();

    const lastMigration = await this.db.collection('migrations')
      .findOne({}, { sort: { executedAt: -1 } });

    if (lastMigration) {
      const migration = require(path.join(__dirname, 'migrations', 'current', lastMigration.filename));

      try {
        if (migration.down) {
          await migration.down(this.db);
          await this.db.collection('migrations').deleteOne({ filename: lastMigration.filename });
          console.log(`✅ Rolled back migration: ${lastMigration.filename}`);
        }
      } catch (error) {
        console.error(`❌ Rollback failed:`, error);
        throw error;
      }
    }
  }
}

module.exports = MigrationRunner;
```

### 2. أوامر الترحيل

```bash
# تشغيل جميع الترحيلات المعلقة
npm run migration:up

# التراجع عن آخر ترحيل
npm run migration:rollback

# التراجع عن جميع الترحيلات
npm run migration:rollback:all

# تشغيل الترحيلات في اتجاه معين
npm run migration:run -- up
npm run migration:run -- down

# عرض حالة الترحيلات
npm run migration:status
```

## استراتيجية النسخ الاحتياطي والاستعادة

### 1. النسخ الاحتياطي قبل الترحيل

```javascript
// backup-before-migration.js
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

class BackupManager {
  async createPreMigrationBackup(db, migrationName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(__dirname, 'backups', `${timestamp}_${migrationName}`);

    // إنشاء مجلد النسخة الاحتياطية
    fs.mkdirSync(backupPath, { recursive: true });

    // حفظ هيكل قاعدة البيانات
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      const documents = await db.collection(collection.name).find({}).toArray();
      const filePath = path.join(backupPath, `${collection.name}.json`);

      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
    }

    // حفظ الفهارس
    const indexesPath = path.join(backupPath, 'indexes.json');
    const indexes = {};

    for (const collection of collections) {
      const indexStats = await db.collection(collection.name).indexes();
      indexes[collection.name] = indexStats;
    }

    fs.writeFileSync(indexesPath, JSON.stringify(indexes, null, 2));

    console.log(`✅ Pre-migration backup created: ${backupPath}`);
    return backupPath;
  }

  async restoreFromBackup(backupPath, db) {
    const collections = fs.readdirSync(backupPath)
      .filter(f => f.endsWith('.json') && f !== 'indexes.json');

    for (const file of collections) {
      const collectionName = file.replace('.json', '');
      const documents = JSON.parse(
        fs.readFileSync(path.join(backupPath, file), 'utf8')
      );

      // حذف البيانات الحالية
      await db.collection(collectionName).deleteMany({});

      // استعادة البيانات
      if (documents.length > 0) {
        await db.collection(collectionName).insertMany(documents);
      }
    }

    console.log(`✅ Database restored from: ${backupPath}`);
  }
}
```

### 2. خطة الاستعادة من الفشل

#### مستويات الاستعادة
1. **المستوى 1**: إعادة تشغيل الترحيل مع إصلاح الخطأ
2. **المستوى 2**: التراجع عن آخر ترحيل واحد
3. **المستوى 3**: التراجع عن جميع الترحيلات المتأثرة
4. **المستوى 4**: استعادة كاملة من النسخة الاحتياطية

#### إجراءات الاستعادة التلقائية
```javascript
// auto-recovery.js
class AutoRecovery {
  async attemptAutoRecovery(error, migrationName) {
    // محاولة إصلاح الخطأ الشائع
    if (error.code === 11000) { // Duplicate key error
      return await this.handleDuplicateKeyError(error, migrationName);
    }

    if (error.message.includes('validation failed')) {
      return await this.handleValidationError(error, migrationName);
    }

    // إذا لم نتمكن من الإصلاح التلقائي، نلقي الخطأ
    throw error;
  }

  async handleDuplicateKeyError(error, migrationName) {
    // محاولة إصلاح تضارب المفاتيح
    console.log('🔧 Attempting to fix duplicate key error...');

    // تنفيذ إجراء تصحيحي حسب نوع الخطأ
    return true; // تم الإصلاح بنجاح
  }
}
```

## اختبار الترحيلات

### 1. بيئة الاختبار

```javascript
// test-migration.js
const MigrationRunner = require('./migration-runner');
const { MongoMemoryServer } = require('mongodb-memory-server');

class MigrationTester {
  async runMigrationTests() {
    const mongoServer = await MongoMemoryServer.create();
    const testDb = mongoServer.getUri();

    const runner = new MigrationRunner(testDb, 'test_db');

    try {
      // اختبار كل ترحيل على حدة
      await this.testIndividualMigrations(runner);

      // اختبار تسلسل الترحيلات
      await this.testMigrationSequence(runner);

      // اختبار التراجع
      await this.testRollback(runner);

      console.log('✅ All migration tests passed');
    } catch (error) {
      console.error('❌ Migration tests failed:', error);
      throw error;
    } finally {
      await mongoServer.stop();
    }
  }
}
```

### 2. اختبارات الترحيل

```javascript
// migrations/test/20241015_090000_add_user_verification_fields.test.js
const { expect } = require('chai');

describe('Add User Verification Fields Migration', () => {
  it('should add verification fields to all users', async () => {
    // إعداد بيانات الاختبار
    await db.collection('users').insertMany([
      { fullName: 'Test User 1', email: 'test1@example.com' },
      { fullName: 'Test User 2', email: 'test2@example.com' }
    ]);

    // تشغيل الترحيل
    await migration.up(db);

    // التحقق من النتائج
    const users = await db.collection('users').find({}).toArray();
    users.forEach(user => {
      expect(user).to.have.property('emailVerificationToken');
      expect(user).to.have.property('emailVerificationExpires');
      expect(user).to.have.property('smsVerificationToken');
      expect(user).to.have.property('smsVerificationExpires');
    });
  });

  it('should rollback changes correctly', async () => {
    await migration.down(db);

    const users = await db.collection('users').find({}).toArray();
    users.forEach(user => {
      expect(user).to.not.have.property('emailVerificationToken');
      expect(user).to.not.have.property('emailVerificationExpires');
    });
  });
});
```

## جدولة الترحيلات

### 1. الترحيلات في بيئة التطوير

```yaml
# .github/workflows/migration-dev.yml
name: Database Migration (Development)

on:
  push:
    paths:
      - 'Backend/src/migrations/**'
      - 'Backend/src/seeds/**'

jobs:
  test-migrations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run migration tests
        run: npm run test:migrations

      - name: Deploy to development database
        run: npm run migration:up
        env:
          MONGODB_URI: ${{ secrets.DEV_MONGODB_URI }}
```

### 2. الترحيلات في بيئة الإنتاج

```yaml
# .github/workflows/migration-prod.yml
name: Database Migration (Production)

on:
  release:
    types: [published]

jobs:
  pre-migration-backup:
    runs-on: ubuntu-latest
    steps:
      - name: Create production backup
        run: npm run backup:create
        env:
          MONGODB_URI: ${{ secrets.PROD_MONGODB_URI }}

  run-migrations:
    runs-on: ubuntu-latest
    needs: pre-migration-backup
    steps:
      - name: Run migrations
        run: npm run migration:up
        env:
          MONGODB_URI: ${{ secrets.PROD_MONGODB_URI }}

      - name: Verify migration success
        run: npm run migration:verify

      - name: Seed production data
        run: npm run seed:production
```

## مراقبة وتسجيل الترحيلات

### 1. نظام التسجيل

```javascript
// migration-logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/migrations.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class MigrationLogger {
  static logMigrationStart(filename, direction) {
    logger.info('Migration started', {
      filename,
      direction,
      timestamp: new Date().toISOString()
    });
  }

  static logMigrationSuccess(filename, duration) {
    logger.info('Migration completed successfully', {
      filename,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  static logMigrationError(filename, error) {
    logger.error('Migration failed', {
      filename,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
```

### 2. مقاييس الأداء

```javascript
// migration-metrics.js
class MigrationMetrics {
  static async recordMigrationMetrics(filename, startTime, endTime, success) {
    const duration = endTime - startTime;
    const metrics = {
      filename,
      duration,
      success,
      timestamp: new Date(),
      memoryUsage: process.memoryUsage(),
      databaseStats: await this.getDatabaseStats()
    };

    // حفظ المقاييس في قاعدة البيانات
    await db.collection('migration_metrics').insertOne(metrics);
  }

  static async getDatabaseStats() {
    const stats = await db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      indexSize: stats.indexSize,
      totalSize: stats.totalSize
    };
  }
}
```

## استراتيجية الترحيل التدريجي

### 1. الترحيل في بيئة الاختبار (Staging)

#### خطوات الترحيل في Staging
1. **النسخ الاحتياطي**: إنشاء نسخة احتياطية كاملة
2. **اختبار الترحيل**: تشغيل الترحيل في بيئة معزولة
3. **التحقق من البيانات**: فحص التكامل والصحة
4. **اختبار التطبيق**: التأكد من عدم وجود أخطاء
5. **موافقة الجودة**: مراجعة من فريق الجودة

#### معايير الانتقال إلى الإنتاج
- ✅ جميع الاختبارات تمر بنجاح
- ✅ زمن الترحيل < 5 دقائق
- ✅ لا توجد أخطاء في السجلات
- ✅ التطبيق يعمل بشكل طبيعي
- ✅ موافقة مدير التقنية

### 2. الترحيل في بيئة الإنتاج

#### نافذة الصيانة
- **الوقت المفضل**: 2:00 - 6:00 صباحاً
- **المدة المتوقعة**: < 30 دقيقة
- **استراتيجية الفشل**: إلغاء تلقائي بعد 15 دقيقة

#### خطة التواصل
```markdown
# إشعار الصيانة المجدولة

**التاريخ**: [التاريخ]
**الوقت**: 2:00 - 6:00 صباحاً
**التأثير**: التطبيق سيكون غير متاح مؤقتاً

## ما يحدث:
- ترقية قاعدة البيانات
- تحسينات في الأداء
- إضافة مزايا جديدة

## المدة المتوقعة:
- 30 دقيقة كحد أقصى
- سيتم إشعاركم فور انتهاء الصيانة
```

## إدارة الإصدارات

### 1. تتبع إصدارات قاعدة البيانات

```javascript
// database-version-manager.js
class DatabaseVersionManager {
  async getCurrentVersion() {
    const version = await db.collection('system_settings')
      .findOne({ _id: 'database.version' });

    return version ? version.value : '1.0.0';
  }

  async updateVersion(newVersion) {
    await db.collection('system_settings').updateOne(
      { _id: 'database.version' },
      {
        $set: {
          value: newVersion,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  async getMigrationHistory() {
    return await db.collection('migrations')
      .find({})
      .sort({ executedAt: 1 })
      .toArray();
  }
}
```

### 2. ملف إصدارات قاعدة البيانات

```json
// database-versions.json
{
  "versions": [
    {
      "version": "1.0.0",
      "date": "2024-10-15",
      "migrations": [
        "20241015_090000_initial_schema.js",
        "20241015_100000_add_indexes.js"
      ],
      "seeds": [
        "admin_users.js",
        "system_settings.js"
      ],
      "description": "الإصدار الأولي لقاعدة البيانات"
    },
    {
      "version": "1.1.0",
      "date": "2024-10-20",
      "migrations": [
        "20241016_143000_add_user_verification.js",
        "20241017_110000_update_order_status.js"
      ],
      "seeds": [
        "sample_data.js"
      ],
      "description": "إضافة نظام التحقق من المستخدمين"
    }
  ]
}
```

## ملخص الاستراتيجية

### نقاط القوة الرئيسية
- ✅ **الأمان الكامل**: نسخ احتياطي قبل كل ترحيل
- ✅ **التراجع السهل**: إمكانية التراجع في أي وقت
- ✅ **الاختبار الشامل**: اختبار جميع الترحيلات مسبقاً
- ✅ **التوثيق المفصل**: توثيق كل تغيير وحجته
- ✅ **المراقبة المستمرة**: مراقبة الأداء والأخطاء

### المخاطر والتخفيف
| المخاطر | طريقة التخفيف | احتمالية الحدوث |
|---------|---------------|-------------------|
| فشل الترحيل | اختبار مسبق + نسخ احتياطي | منخفضة |
| فقدان البيانات | نسخ احتياطي متعدد + اختبار الاستعادة | منخفضة جداً |
| تعطل التطبيق | نافذة صيانة محددة + اختبار شامل | متوسطة |
| أداء بطيء | تحسين الفهارس + مراقبة الأداء | متوسطة |

---

*آخر تحديث: أكتوبر 2025*
*الإصدار: 1.0.0*
