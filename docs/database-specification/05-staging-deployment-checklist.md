# مخطط الاكتمال لترحيل قاعدة البيانات على Staging

## نظرة عامة
يوثق هذا المخطط جميع الخطوات اللازمة لضمان ترحيل قاعدة البيانات بنجاح في بيئة الاختبار (Staging) دون فقدان البيانات أو تعطيل الخدمات.

## أهداف عملية الترحيل

### الأهداف الرئيسية
- ✅ **عدم فقدان البيانات**: ضمان سلامة جميع البيانات الموجودة
- ✅ **الحد الأدنى من التوقف**: تقليل وقت تعطل الخدمة قدر الإمكان
- ✅ **التحقق الشامل**: التأكد من صحة البيانات بعد الترحيل
- ✅ **التراجع السريع**: إمكانية العودة للحالة السابقة في حالة الفشل
- ✅ **التوثيق الكامل**: توثيق كل خطوة ونتيجتها

### مقاييس النجاح
- ⏱️ **زمن التنفيذ**: < 30 دقيقة
- 📊 **معدل النجاح**: 100%
- 🔄 **إمكانية التراجع**: < 5 دقائق
- ✅ **التحقق من البيانات**: 100% من البيانات المختبرة

---

## مرحلة التحضير (Preparation Phase)

### الخطوة 1: تقييم البيئة الحالية

#### 1.1 فحص حالة قاعدة البيانات الحالية
```bash
# التحقق من حجم قاعدة البيانات
db.stats()

# قائمة المجموعات وعدد الوثائق
db.getCollectionNames().forEach(collection => {
  print(collection + ": " + db[collection].countDocuments());
})

# التحقق من الفهارس الموجودة
db.getCollectionNames().forEach(collection => {
  print("=== " + collection + " ===");
  db[collection].indexes().forEach(index => {
    print(JSON.stringify(index));
  });
})
```

#### 1.2 فحص البيانات الحساسة
```javascript
// التحقق من وجود بيانات حقيقية في Staging
db.users.countDocuments({ "authProvider": { $ne: "test" } })
db.deliveryorders.countDocuments({ "status": { $ne: "test" } })
```

#### 1.3 التحقق من النسخ الاحتياطية
```bash
# التحقق من وجود نسخ احتياطية حديثة
ls -la /backups/staging/
# يجب أن تكون هناك نسخة احتياطية خلال آخر 24 ساعة
```

### الخطوة 2: إعداد بيئة الاختبار

#### 2.1 إنشاء قاعدة بيانات تجريبية
```bash
# إنشاء قاعدة بيانات منفصلة للاختبار
mongorestore --uri="mongodb://localhost:27017" \
  --db=bthwani_staging_migration_test \
  /backups/staging/latest/
```

#### 2.2 تشغيل الترحيلات في البيئة التجريبية
```bash
# تشغيل الترحيلات في البيئة التجريبية
MONGODB_URI="mongodb://localhost:27017/bthwani_staging_migration_test" \
npm run migration:up --dry-run

# إذا نجحت، تشغيل الترحيل الفعلي
MONGODB_URI="mongodb://localhost:27017/bthwani_staging_migration_test" \
npm run migration:up
```

#### 2.3 التحقق من نجاح الترحيل التجريبي
```javascript
// التحقق من تطبيق جميع الترحيلات
db.migrations.find({}).sort({executedAt: 1})

// التحقق من صحة البيانات بعد الترحيل
db.users.find({}).limit(5).forEach(user => {
  print("User: " + user.fullName + " - Email: " + user.email);
})

// التحقق من الفهارس الجديدة
db.users.indexes().forEach(index => {
  print("Index: " + index.name);
})
```

### الخطوة 3: إعداد خطة التراجع

#### 3.1 تحديد نقطة التراجع
```javascript
// حفظ حالة قاعدة البيانات الحالية
const currentState = {
  timestamp: new Date(),
  collections: db.getCollectionNames(),
  documentCounts: {},
  indexes: {}
};

// حفظ عدد الوثائق لكل مجموعة
db.getCollectionNames().forEach(collection => {
  currentState.documentCounts[collection] = db[collection].countDocuments();
});

// حفظ معلومات الفهارس
db.getCollectionNames().forEach(collection => {
  currentState.indexes[collection] = db[collection].indexes();
});
```

#### 3.2 إعداد سكريبت التراجع التلقائي
```javascript
// rollback-script.js
const { MongoClient } = require('mongodb');

async function rollbackToPreviousState() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    // حذف الترحيلات المُنفذة مؤخراً
    const recentMigrations = await db.collection('migrations')
      .find({ executedAt: { $gte: new Date('2024-10-15T00:00:00Z') } })
      .sort({ executedAt: -1 })
      .toArray();

    for (const migration of recentMigrations) {
      console.log(`Rolling back: ${migration.filename}`);

      // استدعاء دالة التراجع
      const migrationFile = require(`./migrations/current/${migration.filename}`);
      await migrationFile.down(db);

      // حذف سجل الترحيل
      await db.collection('migrations').deleteOne({ filename: migration.filename });
    }

    console.log('✅ Rollback completed successfully');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}
```

---

## مرحلة التنفيذ (Execution Phase)

### الخطوة 4: النسخ الاحتياطي قبل الترحيل

#### 4.1 إنشاء نسخة احتياطية شاملة
```bash
#!/bin/bash
# pre-migration-backup.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/staging/pre_migration_$TIMESTAMP"

echo "🚀 Creating pre-migration backup..."

# إنشاء مجلد النسخة الاحتياطية
mkdir -p $BACKUP_DIR

# نسخ قاعدة البيانات كاملة
mongodump \
  --uri="$MONGODB_URI" \
  --out="$BACKUP_DIR" \
  --oplog \
  --gzip

# حفظ معلومات النظام
echo "Database size: $(du -sh $BACKUP_DIR | cut -f1)" > "$BACKUP_DIR/backup_info.txt"
echo "Backup created at: $(date)" >> "$BACKUP_DIR/backup_info.txt"
echo "MongoDB version: $(mongod --version | head -1)" >> "$BACKUP_DIR/backup_info.txt"

echo "✅ Pre-migration backup completed: $BACKUP_DIR"
```

#### 4.2 التحقق من سلامة النسخة الاحتياطية
```bash
#!/bin/bash
# verify-backup.sh

BACKUP_DIR=$1

if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ Backup directory not found: $BACKUP_DIR"
  exit 1
fi

echo "🔍 Verifying backup integrity..."

# التحقق من وجود ملفات النسخة الاحتياطية
COLLECTIONS=("users" "drivers" "deliveryorders" "products" "wallets")
for collection in "${COLLECTIONS[@]}"; do
  if [ ! -f "$BACKUP_DIR/bthwani_staging/$collection.bson.gz" ]; then
    echo "❌ Missing collection: $collection"
    exit 1
  fi
done

echo "✅ Backup verification completed successfully"
```

### الخطوة 5: تنفيذ الترحيل

#### 5.1 تشغيل الترحيلات بالتسلسل
```bash
#!/bin/bash
# execute-migrations.sh

echo "🚀 Starting database migration..."

# تشغيل الترحيلات
MONGODB_URI="$MONGODB_URI" npm run migration:up

# التحقق من نجاح الترحيلات
if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"

  # تشغيل التهيئة
  echo "🌱 Running seeds..."
  MONGODB_URI="$MONGODB_URI" npm run seed:staging

  if [ $? -eq 0 ]; then
    echo "✅ Seeds completed successfully"
  else
    echo "❌ Seeds failed"
    exit 1
  fi
else
  echo "❌ Migrations failed"
  exit 1
fi
```

#### 5.2 مراقبة عملية الترحيل
```javascript
// migration-monitor.js
const { MongoClient } = require('mongodb');

class MigrationMonitor {
  constructor(mongodbUri) {
    this.mongodbUri = mongodbUri;
    this.metrics = {
      startTime: new Date(),
      migrations: [],
      errors: []
    };
  }

  async monitorMigration() {
    const client = new MongoClient(this.mongodbUri);

    try {
      await client.connect();
      const db = client.db();

      // مراقبة حالة الترحيلات كل 10 ثوانٍ
      const monitorInterval = setInterval(async () => {
        const executedMigrations = await db.collection('migrations')
          .find({})
          .sort({ executedAt: 1 })
          .toArray();

        console.log(`📊 Migration Progress: ${executedMigrations.length} completed`);

        executedMigrations.forEach(migration => {
          console.log(`  ✅ ${migration.filename} - ${migration.executedAt}`);
        });
      }, 10000);

      // انتظار انتهاء جميع الترحيلات
      while (true) {
        const pendingMigrations = await this.getPendingMigrations(db);
        if (pendingMigrations.length === 0) break;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      clearInterval(monitorInterval);
      console.log('🎉 All migrations completed successfully');

    } catch (error) {
      this.metrics.errors.push(error);
      console.error('❌ Migration monitoring failed:', error);
      throw error;
    } finally {
      await client.close();
    }
  }

  async getPendingMigrations(db) {
    // منطق الحصول على الترحيلات المعلقة
    return [];
  }
}
```

### الخطوة 6: التحقق من النجاح

#### 6.1 فحص سجلات الترحيل
```bash
# التحقق من سجلات الترحيل
tail -f logs/migrations.log | grep -E "(✅|❌|🚀|🔧)"

# التحقق من حالة الترحيلات في قاعدة البيانات
mongo --eval "
db.migrations.find({}).forEach(migration => {
  print(migration.filename + ': ' + migration.success);
})
"
```

#### 6.2 فحص البيانات بعد الترحيل
```javascript
// post-migration-verification.js
const verifications = [
  {
    name: "Users collection",
    test: async (db) => {
      const count = await db.collection('users').countDocuments();
      const sampleUsers = await db.collection('users').find({}).limit(3).toArray();

      return {
        passed: count > 0 && sampleUsers.length === 3,
        count,
        message: `Found ${count} users`
      };
    }
  },
  {
    name: "New indexes",
    test: async (db) => {
      const indexes = await db.collection('users').indexes();
      const hasNewIndex = indexes.some(idx => idx.name.includes('verification'));

      return {
        passed: hasNewIndex,
        message: `Found ${indexes.length} indexes`
      };
    }
  },
  {
    name: "Data integrity",
    test: async (db) => {
      // التحقق من عدم وجود بيانات تالفة
      const corruptedUsers = await db.collection('users').countDocuments({
        $or: [
          { email: { $exists: false } },
          { fullName: { $exists: false } },
          { createdAt: { $exists: false } }
        ]
      });

      return {
        passed: corruptedUsers === 0,
        message: `Found ${corruptedUsers} corrupted records`
      };
    }
  }
];

async function runVerifications(db) {
  console.log('🔍 Running post-migration verifications...\n');

  for (const verification of verifications) {
    try {
      const result = await verification.test(db);
      const status = result.passed ? '✅' : '❌';

      console.log(`${status} ${verification.name}: ${result.message}`);

      if (!result.passed) {
        throw new Error(`Verification failed: ${verification.name}`);
      }
    } catch (error) {
      console.error(`❌ Verification failed: ${verification.name}`);
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }

  console.log('\n🎉 All verifications passed successfully!');
}
```

---

## مرحلة التراجع (Rollback Phase)

### الخطوة 7: إجراءات التراجع في حالة الفشل

#### 7.1 الكشف عن الفشل
```javascript
// failure-detection.js
class FailureDetector {
  async detectFailure(db) {
    const issues = [];

    // فحص عدد الوثائق بعد الترحيل
    const postMigrationCounts = await this.getCollectionCounts(db);
    const preMigrationCounts = this.getPreMigrationCounts();

    for (const [collection, count] of Object.entries(postMigrationCounts)) {
      const originalCount = preMigrationCounts[collection] || 0;
      const difference = Math.abs(count - originalCount);

      if (difference > originalCount * 0.1) { // فرق أكثر من 10%
        issues.push({
          type: 'data_loss',
          collection,
          expected: originalCount,
          actual: count,
          difference
        });
      }
    }

    // فحص حالة الترحيلات
    const failedMigrations = await db.collection('migrations')
      .find({ success: false })
      .toArray();

    if (failedMigrations.length > 0) {
      issues.push({
        type: 'migration_failure',
        failedMigrations: failedMigrations.map(m => m.filename)
      });
    }

    return issues;
  }
}
```

#### 7.2 تنفيذ التراجع التلقائي
```bash
#!/bin/bash
# auto-rollback.sh

echo "🔄 Starting automatic rollback..."

# إيقاف التطبيق مؤقتاً
pm2 stop bthwani-staging

# تنفيذ التراجع
node scripts/rollback-migrations.js

# التحقق من نجاح التراجع
if [ $? -eq 0 ]; then
  echo "✅ Rollback completed successfully"

  # إعادة تشغيل التطبيق
  pm2 start bthwani-staging

  # إرسال إشعار للفريق
  node scripts/send-rollback-notification.js

  echo "📢 Team notified of rollback"
else
  echo "❌ Rollback failed - manual intervention required"

  # إرسال إشعار طوارئ
  node scripts/send-emergency-notification.js

  exit 1
fi
```

#### 7.3 التحقق من نجاح التراجع
```javascript
// verify-rollback.js
async function verifyRollback(db) {
  console.log('🔍 Verifying rollback success...');

  // التحقق من عودة البيانات للحالة السابقة
  const currentCounts = await getCollectionCounts(db);
  const originalCounts = getOriginalCounts();

  for (const [collection, count] of Object.entries(currentCounts)) {
    const originalCount = originalCounts[collection] || 0;

    if (count !== originalCount) {
      throw new Error(
        `Data mismatch in ${collection}: expected ${originalCount}, got ${count}`
      );
    }
  }

  // التحقق من حذف الترحيلات المُنفذة مؤخراً
  const recentMigrations = await db.collection('migrations')
    .find({ executedAt: { $gte: rollbackPoint } })
    .toArray();

  if (recentMigrations.length > 0) {
    throw new Error('Recent migrations not rolled back');
  }

  console.log('✅ Rollback verification completed successfully');
}
```

---

## مرحلة ما بعد الترحيل (Post-Migration Phase)

### الخطوة 8: التنظيف والتحسين

#### 8.1 تنظيف السجلات المؤقتة
```javascript
// cleanup-temp-data.js
async function cleanupTempData(db) {
  // حذف السجلات المؤقتة التي تم إنشاؤها أثناء الترحيل
  await db.collection('temp_migration_data').drop();

  // حذف السجلات القديمة للاختبار
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await db.collection('test_data').deleteMany({
    createdAt: { $lt: thirtyDaysAgo }
  });

  console.log('🧹 Cleanup completed');
}
```

#### 8.2 إعادة بناء الفهارس
```bash
#!/bin/bash
# rebuild-indexes.sh

echo "🔧 Rebuilding indexes for optimal performance..."

# إعادة بناء الفهارس للمجموعات الرئيسية
collections=("users" "drivers" "deliveryorders" "products")

for collection in "${collections[@]}"; do
  echo "Rebuilding indexes for: $collection"
  mongo --eval "
    db.$collection.reIndex()
  "
done

echo "✅ Index rebuild completed"
```

#### 8.3 تحديث إحصائيات قاعدة البيانات
```javascript
// update-database-stats.js
async function updateDatabaseStats(db) {
  // تحديث إحصائيات المجموعات
  const collections = await db.listCollections().toArray();

  for (const collection of collections) {
    await db.command({
      collStats: collection.name,
      scale: 1024 * 1024 // تحويل إلى ميجابايت
    });
  }

  // حفظ الإحصائيات في جدول منفصل للمراقبة
  const stats = await db.stats();
  await db.collection('database_stats').insertOne({
    ...stats,
    recordedAt: new Date()
  });

  console.log('📊 Database statistics updated');
}
```

### الخطوة 9: اختبار شامل للتطبيق

#### 9.1 اختبار الوظائف الأساسية
```javascript
// application-smoke-tests.js
const tests = [
  {
    name: "User registration",
    test: async () => {
      // اختبار إنشاء مستخدم جديد
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+967123456789',
          password: 'password123'
        });

      return response.status === 201;
    }
  },
  {
    name: "Order placement",
    test: async () => {
      // اختبار إنشاء طلب جديد
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId: 'test-product', quantity: 1 }],
          address: { /* address data */ }
        });

      return response.status === 201;
    }
  },
  {
    name: "Driver assignment",
    test: async () => {
      // اختبار تعيين سائق للطلب
      const response = await request(app)
        .patch(`/api/orders/${orderId}/assign-driver`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ driverId: 'test-driver' });

      return response.status === 200;
    }
  }
];

async function runSmokeTests() {
  console.log('🧪 Running application smoke tests...\n');

  for (const test of tests) {
    try {
      const passed = await test.test();
      const status = passed ? '✅' : '❌';

      console.log(`${status} ${test.name}`);

      if (!passed) {
        throw new Error(`Smoke test failed: ${test.name}`);
      }
    } catch (error) {
      console.error(`❌ Smoke test failed: ${test.name}`);
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }

  console.log('\n🎉 All smoke tests passed successfully!');
}
```

#### 9.2 اختبار الأداء
```javascript
// performance-tests.js
async function runPerformanceTests() {
  console.log('⚡ Running performance tests...\n');

  const testCases = [
    {
      name: "User search",
      operation: async () => {
        return await request(app)
          .get('/api/users/search?q=test')
          .set('Authorization', `Bearer ${token}`);
      }
    },
    {
      name: "Nearby drivers",
      operation: async () => {
        return await request(app)
          .get('/api/drivers/nearby?lat=15.3694&lng=44.1910&radius=5')
          .set('Authorization', `Bearer ${token}`);
      }
    },
    {
      name: "Order history",
      operation: async () => {
        return await request(app)
          .get('/api/orders/history')
          .set('Authorization', `Bearer ${token}`);
      }
    }
  ];

  for (const testCase of testCases) {
    const startTime = Date.now();

    try {
      const response = await testCase.operation();
      const duration = Date.now() - startTime;

      const status = response.status === 200 && duration < 1000 ? '✅' : '⚠️';

      console.log(`${status} ${testCase.name}: ${duration}ms`);

      if (duration > 2000) {
        console.warn(`⚠️  Slow response detected: ${testCase.name} took ${duration}ms`);
      }
    } catch (error) {
      console.error(`❌ Performance test failed: ${testCase.name}`);
      console.error(`Error: ${error.message}`);
    }
  }
}
```

### الخطوة 10: التوثيق والتقرير

#### 10.1 إنشاء تقرير الترحيل
```javascript
// migration-report.js
async function generateMigrationReport(db) {
  const report = {
    migration: {
      startedAt: new Date(),
      completedAt: new Date(),
      duration: 0,
      success: true,
      totalMigrations: 0,
      successfulMigrations: 0,
      failedMigrations: 0
    },
    database: {
      before: {},
      after: {},
      growth: {}
    },
    performance: {
      averageQueryTime: 0,
      slowestQuery: null,
      fastestQuery: null
    }
  };

  // جمع بيانات الترحيل
  const migrations = await db.collection('migrations')
    .find({})
    .sort({ executedAt: 1 })
    .toArray();

  report.migration.totalMigrations = migrations.length;
  report.migration.successfulMigrations = migrations.filter(m => m.success).length;
  report.migration.failedMigrations = migrations.filter(m => !m.success).length;

  // جمع إحصائيات قاعدة البيانات
  const currentStats = await db.stats();
  report.database.after = currentStats;

  // حفظ التقرير
  await db.collection('migration_reports').insertOne({
    ...report,
    createdAt: new Date()
  });

  console.log('📋 Migration report generated successfully');
  return report;
}
```

#### 10.2 إرسال التقرير للفريق
```javascript
// send-migration-notification.js
const nodemailer = require('nodemailer');

async function sendMigrationNotification(report) {
  const transporter = nodemailer.createTransporter({
    // إعدادات البريد الإلكتروني
  });

  const emailContent = {
    subject: `✅ Database Migration Completed Successfully - ${new Date().toISOString()}`,
    html: `
      <h2>Database Migration Report</h2>
      <p><strong>Status:</strong> ✅ Successful</p>
      <p><strong>Total Migrations:</strong> ${report.migration.totalMigrations}</p>
      <p><strong>Duration:</strong> ${report.migration.duration}ms</p>
      <p><strong>Database Size:</strong> ${report.database.after.dataSize}MB</p>

      <h3>Performance Metrics</h3>
      <p><strong>Average Query Time:</strong> ${report.performance.averageQueryTime}ms</p>

      <h3>Next Steps</h3>
      <ul>
        <li>Monitor application performance for 24 hours</li>
        <li>Run full test suite if needed</li>
        <li>Update production deployment checklist</li>
      </ul>

      <p><em>This is an automated message from the Bthwani Platform</em></p>
    `
  };

  await transporter.sendMail({
    from: 'migration@bthwani.com',
    to: 'dev-team@bthwani.com',
    ...emailContent
  });

  console.log('📧 Migration notification sent to team');
}
```

---

## قائمة التحقق النهائية (Final Checklist)

### ✅ التحقق من اكتمال جميع الخطوات

- [ ] تم إنشاء نسخة احتياطية قبل الترحيل
- [ ] تم اختبار الترحيل في البيئة التجريبية
- [ ] تم تنفيذ الترحيل بنجاح في Staging
- [ ] تم التحقق من سلامة البيانات بعد الترحيل
- [ ] تم اختبار جميع الوظائف الأساسية للتطبيق
- [ ] تم قياس الأداء وتأكد من تحسنه
- [ ] تم إنشاء تقرير شامل للترحيل
- [ ] تم إخطار الفريق بانتهاء الترحيل بنجاح

### 🚨 نقاط الاهتمام الخاصة

1. **مراقبة الأداء لمدة 24 ساعة** بعد الترحيل
2. **التأكد من عدم وجود أخطاء في السجلات** (logs)
3. **اختبار جميع حالات الاستخدام الرئيسية** للتطبيق
4. **التحقق من صحة النسخ الاحتياطية** الجديدة
5. **تحديث وثائق قاعدة البيانات** إذا لزم الأمر

### 📞 معلومات الاتصال في حالات الطوارئ

- **مدير التقنية**: tech.manager@bthwani.com | +967-1-000000
- **فريق قاعدة البيانات**: db-team@bthwani.com | +967-1-000001
- **دعم الطوارئ**: emergency@bthwani.com | +967-1-000002

---

## ملخص التنفيذ

### الجدول الزمني المتوقع
| المرحلة | المدة المتوقعة | المسؤول |
|---------|----------------|---------|
| التحضير | 2 ساعات | فريق قاعدة البيانات |
| النسخ الاحتياطي | 15 دقيقة | نظام تلقائي |
| الترحيل | 10 دقائق | نظام تلقائي |
| التحقق | 30 دقيقة | فريق الجودة |
| الاختبار | 1 ساعة | فريق التطوير |
| التنظيف | 15 دقيقة | نظام تلقائي |
| **المجموع** | **< 4 ساعات** | |

### المخاطر والتخفيف
| المخاطر | احتمالية الحدوث | طريقة التخفيف |
|---------|------------------|---------------|
| فشل الترحيل | منخفضة (5%) | اختبار مسبق + تراجع تلقائي |
| فقدان البيانات | منخفضة جداً (1%) | نسخ احتياطي متعدد |
| تعطل التطبيق | متوسطة (20%) | نافذة صيانة محددة |
| مشاكل الأداء | متوسطة (30%) | مراقبة مستمرة + تحسين |

---

*آخر تحديث: أكتوبر 2025*
*الإصدار: 1.0.0*
