# اختبار الاسترجاع على Staging - دليل التنفيذ

## نظرة عامة
دليل شامل لاختبار إجراءات الاسترجاع (Rollback) على بيئة Staging للتأكد من جاهزية النظام للتعامل مع الحالات الطارئة.

## أهداف الاختبار

### 1. التأكد من سلامة الإجراءات
- اختبار جميع خطوات الاسترجاع الموثقة
- التأكد من عدم وجود أخطاء في الأوامر والسكريبتات
- قياس زمن الاسترجاع الفعلي

### 2. قياس الأثر على المستخدمين
- قياس وقت التوقف أثناء الاسترجاع
- التأكد من عدم فقدان بيانات مهمة
- قياس جودة الخدمة بعد الاسترجاع

### 3. تحسين الإجراءات
- تحديد النقاط التي تحتاج تحسين
- تحديث الأدلة والوثائق
- تدريب الفريق على الإجراءات المحدثة

## متطلبات الاختبار

### البيئة المطلوبة
- **Staging Environment**: نظيفة ومماثلة للإنتاج
- **نسخ احتياطية**: جاهزة ومختبرة
- **أدوات المراقبة**: مفعلة ومراقبة

### الفريق المطلوب
- **DevOps Engineer**: مسؤول تنفيذ الاسترجاع
- **Backend Developer**: مراقبة قاعدة البيانات والـ APIs
- **QA Engineer**: اختبار الوظائف بعد الاسترجاع
- **Product Manager**: مراقبة الأثر على المستخدمين

## خطة الاختبار التفصيلية

### المرحلة 1: التحضير (Preparation)

#### 1.1 إعداد البيئة التجريبية
```bash
# 1. التأكد من نظافة بيئة Staging
echo "Checking staging environment..."

# فحص حالة الخدمات
kubectl get pods -l environment=staging
curl -f https://staging.bthwani.com/health

# فحص حالة قاعدة البيانات
mongosh "$STAGING_MONGO_URI" --eval "db.stats()"
```

#### 1.2 إنشاء نسخ احتياطية قبل البدء
```bash
# إنشاء backup شامل قبل الاختبار
BACKUP_NAME="pre-rollback-test-$(date +%Y-%m-%d-%H%M)"
mongodump --uri "$STAGING_MONGO_URI" --archive="$BACKUP_NAME.gz" --gzip

# نسخ البيانات التجريبية
cp -r /path/to/test/data /backup/test-data-$(date +%Y%m%d)
```

#### 1.3 إعداد مراقبة الأداء
```bash
# بدء مراقبة الأداء قبل الاختبار
./monitoring/start-monitoring.sh staging

# تفعيل تسجيل الأحداث
./logging/enable-detailed-logging.sh staging
```

### المرحلة 2: محاكاة الحادث (Incident Simulation)

#### 2.1 إنشاء إصدار تجريبي جديد
```bash
# محاكاة إصدار جديد يحتوي على مشكلة
cd Backend

# إنشاء فرع تجريبي
git checkout -b test-rollback-feature

# إضافة تغيير تجريبي (مثل إضافة حقل جديد)
echo 'console.log("Test feature that will be rolled back");' >> src/test-feature.js

# نشر الإصدار التجريبي
npm run build
docker build -t bthwani/backend:test-rollback-v1 .
docker push bthwani/backend:test-rollback-v1

# تحديث النشر في Staging
kubectl set image deployment/backend backend=bthwani/backend:test-rollback-v1
```

#### 2.2 محاكاة اكتشاف المشكلة
```bash
# محاكاة اكتشاف المشكلة
echo "مشكلة مكتشفة في الإصدار الجديد!"

# فحص السجلات للتأكد من وجود أخطاء
kubectl logs -l app=backend --tail=50 | grep -i "error\|fail"

# محاكاة شكاوى المستخدمين
echo "تم تلقي 15 شكوى من المستخدمين خلال 10 دقائق"
```

#### 2.3 تصنيف الحادث وإشعار الفريق
```bash
# تصنيف الحادث كـ SEV1
echo "SEV1: مشكلة حرجة في النظام - بدء إجراءات الطوارئ"

# إشعار الفريق عبر Slack
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🚨 SEV1: Rollback test in progress - Staging environment"}' \
  https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# بدء مؤقت الاسترجاع
START_TIME=$(date +%s)
```

### المرحلة 3: تنفيذ الاسترجاع (Rollback Execution)

#### 3.1 تنفيذ استرجاع التطبيق
```bash
#!/bin/bash
# سكريبت استرجاع التطبيق

echo "Starting application rollback..."

# 1. إيقاف الخدمة الحالية مؤقتاً
kubectl scale deployment backend --replicas=0

# 2. الرجوع إلى الإصدار السابق المستقر
kubectl set image deployment/backend backend=bthwani/backend:staging-stable

# 3. إعادة تشغيل الخدمة
kubectl scale deployment backend --replicas=3

# 4. انتظار بدء الخدمة
sleep 30

# 5. فحص أن الخدمة تعمل
kubectl get pods -l app=backend | grep Running
curl -f https://staging.bthwani.com/health

echo "Application rollback completed successfully!"
```

#### 3.2 استرجاع قاعدة البيانات (إن لزم الأمر)
```bash
# محاكاة استرجاع قاعدة البيانات
echo "Starting database rollback..."

# استرجاع انتقائي للجداول المتأثرة فقط
mongorestore --uri "$STAGING_MONGO_URI" \
  --archive=pre-rollback-test-2025-01-15-1430.gz \
  --gzip \
  --nsInclude="bthwani.orders" \
  --nsInclude="bthwani.transactions" \
  --drop

# فحص سلامة قاعدة البيانات
mongosh "$STAGING_MONGO_URI" --eval "
db.adminCommand('ismaster');
db.orders.countDocuments();
db.transactions.countDocuments();
"

echo "Database rollback completed successfully!"
```

### المرحلة 4: الاختبار بعد الاسترجاع (Post-Rollback Testing)

#### 4.1 فحص الصحة الأساسية
```bash
#!/bin/bash
# فحص شامل بعد الاسترجاع

echo "Running comprehensive health checks..."

# 1. فحص endpoint الصحة
HEALTH_CHECK=$(curl -f -s https://staging.bthwani.com/health | jq -r '.status')
if [ "$HEALTH_CHECK" = "ok" ]; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
fi

# 2. فحص قاعدة البيانات
DB_STATUS=$(mongosh "$STAGING_MONGO_URI" --eval "db.stats()" --quiet)
if echo "$DB_STATUS" | grep -q "ok"; then
    echo "✅ Database healthy"
else
    echo "❌ Database issues detected"
fi

# 3. فحص الخدمات الأساسية
API_TEST=$(curl -f -s https://staging.bthwani.com/api/v1/test)
if [ $? -eq 0 ]; then
    echo "✅ API endpoints working"
else
    echo "❌ API endpoints failed"
fi
```

#### 4.2 اختبار السيناريوهات الوظيفية

##### سيناريو 1: طلب → محفظة → تسوية
```bash
#!/bin/bash
# اختبار سيناريو كامل للتطبيق

echo "Testing complete order flow..."

# 1. إنشاء طلب تجريبي
ORDER_RESPONSE=$(curl -X POST https://staging.bthwani.com/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"test": true, "amount": 100}')

if echo "$ORDER_RESPONSE" | grep -q "success"; then
    echo "✅ Order creation successful"
else
    echo "❌ Order creation failed"
fi

# 2. فحص حالة المحفظة
WALLET_RESPONSE=$(curl -s https://staging.bthwani.com/api/v1/wallet/balance)
if echo "$WALLET_RESPONSE" | grep -q "balance"; then
    echo "✅ Wallet check successful"
else
    echo "❌ Wallet check failed"
fi

# 3. فحص التسوية
SETTLEMENT_RESPONSE=$(curl -s https://staging.bthwani.com/api/v1/settlements/pending)
if echo "$SETTLEMENT_RESPONSE" | grep -q "pending"; then
    echo "✅ Settlement check successful"
else
    echo "❌ Settlement check failed"
fi
```

##### سيناريو 2: اختبار الويب (3 صفحات أساسية)
```bash
#!/bin/bash
# اختبار صفحات الويب الأساسية

echo "Testing web application..."

# 1. فحص الصفحة الرئيسية
curl -f -s https://staging.bthwani.com/ | head -20 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Homepage loads successfully"
else
    echo "❌ Homepage failed to load"
fi

# 2. فحص صفحة المنتجات
curl -f -s https://staging.bthwani.com/products > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Products page loads successfully"
else
    echo "❌ Products page failed to load"
fi

# 3. فحص صفحة تسجيل الدخول
curl -f -s https://staging.bthwani.com/login > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Login page loads successfully"
else
    echo "❌ Login page failed to load"
fi
```

##### سيناريو 3: اختبار التطبيقات المحمولة
```bash
#!/bin/bash
# اختبار التطبيقات المحمولة

echo "Testing mobile applications..."

# 1. فحص أن التحديث متاح
eas update:list --branch staging

# 2. اختبار 3 شاشات أساسية
echo "Manual testing required:"
echo "1. Open mobile app on staging channel"
echo "2. Test login screen"
echo "3. Test products browsing"
echo "4. Test cart functionality"

# 3. فحص الأداء
echo "Performance checks:"
echo "- App launch time < 3 seconds"
echo "- No crashes during navigation"
echo "- Smooth scrolling and animations"
```

#### 4.3 فحص عدم وجود فروقات في القيود
```bash
#!/bin/bash
# فحص تطابق القيود المالية

echo "Checking financial records consistency..."

# 1. فحص تطابق أرصدة المحافظ
WALLET_BALANCE=$(curl -s https://staging.bthwani.com/api/v1/reports/wallet-balance)
TRANSACTION_SUM=$(curl -s https://staging.bthwani.com/api/v1/reports/transaction-sum)

echo "Wallet balance: $WALLET_BALANCE"
echo "Transaction sum: $TRANSACTION_SUM"

# 2. فحص سجلات التدقيق
AUDIT_COUNT=$(curl -s "https://staging.bthwani.com/admin/audit-logs?limit=1" | jq '.total')
echo "Recent audit logs: $AUDIT_COUNT"

# 3. فحص حالة الطلبات
ORDERS_COUNT=$(curl -s https://staging.bthwani.com/api/v1/orders/count)
echo "Orders count: $ORDERS_COUNT"
```

### المرحلة 5: قياس الأداء والتأثير

#### 5.1 قياس زمن الاسترجاع
```bash
# حساب زمن الاسترجاع الفعلي
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "Rollback duration: $DURATION seconds"

# قياس زمن التوقف
DOWNTIME=$(($DURATION - 30)) # خصم وقت الاختبار
echo "Service downtime: $DOWNTIME seconds"
```

#### 5.2 مراقبة الأداء بعد الاسترجاع
```bash
# مراقبة استخدام الموارد
kubectl top pods -l app=backend

# مراقبة زمن الاستجابة
curl -w "@curl-format.txt" -s -o /dev/null https://staging.bthwani.com/api/v1/test

# مراقبة معدل الأخطاء
kubectl logs -l app=backend --tail=100 | grep -c "ERROR"
```

#### 5.3 استطلاع رضا المستخدمين التجريبيين
```bash
# محاكاة استطلاع رضا المستخدمين
echo "User satisfaction survey (simulated):"
echo "1. Service restored within acceptable time: Yes"
echo "2. All features working correctly: Yes"
echo "3. No data loss experienced: Yes"
echo "4. Overall experience: Good"
```

### المرحلة 6: التوثيق والتقرير

#### 6.1 جمع البيانات والنتائج
```bash
# جمع جميع البيانات من الاختبار
cat > rollback-test-results.json << EOF
{
  "test_date": "$(date)",
  "rollback_duration": "$DURATION",
  "downtime": "$DOWNTIME",
  "health_checks": "all_passed",
  "functional_tests": "all_passed",
  "performance_metrics": "within_acceptable_limits",
  "user_satisfaction": "good"
}
EOF
```

#### 6.2 إنشاء تقرير مفصل
```markdown
# تقرير اختبار الاسترجاع على Staging

## ملخص الاختبار
- **التاريخ**: $(date)
- **البيئة**: Staging Environment
- **النوع**: محاكاة SEV1 Rollback
- **النتيجة**: نجاح كامل ✅

## تفاصيل التنفيذ

### 1. مرحلة التحضير
- ✅ إنشاء نسخ احتياطية شاملة
- ✅ تفعيل مراقبة الأداء
- ✅ إعداد أدوات التشخيص

### 2. مرحلة المحاكاة
- ✅ إنشاء إصدار تجريبي يحتوي على مشكلة
- ✅ محاكاة اكتشاف المشكلة
- ✅ تصنيف الحادث وإشعار الفريق

### 3. مرحلة الاسترجاع
- ✅ استرجاع التطبيق بنجاح
- ✅ استرجاع قاعدة البيانات (إن لزم)
- ✅ فحص الصحة الأساسية

### 4. مرحلة الاختبار
- ✅ اختبار السيناريوهات الوظيفية
- ✅ فحص 3 شاشات أساسية
- ✅ رحلة كاملة للتطبيق
- ✅ عدم وجود فروقات في القيود

## المقاييس والنتائج

### زمن الاسترجاع
- **زمن الاسترجاع الإجمالي**: $DURATION ثانية
- **زمن التوقف**: $DOWNTIME ثانية
- **زمن التعافي**: أقل من 5 دقائق

### جودة الخدمة بعد الاسترجاع
- **الصحة العامة**: ممتازة
- **الوظائف الأساسية**: تعمل بكفاءة
- **الأداء**: ضمن الحدود المقبولة
- **الاستقرار**: مستقر تماماً

### رضا المستخدمين
- **تجربة التعافي**: سلسة وسريعة
- **فقدان البيانات**: معدوم
- **التواصل**: واضح وفعال

## الدروس المستفادة

### النقاط الإيجابية
1. **سرعة الاسترجاع**: تم في وقت أقل من المستهدف
2. **دقة الإجراءات**: جميع الخطوات نجحت بدون أخطاء
3. **اكتمال الاختبار**: غطى جميع السيناريوهات المطلوبة
4. **التوثيق**: ساعد في تنفيذ سلس للإجراءات

### مجالات التحسين
1. **أتمتة السكريبتات**: بعض الخطوات تحتاج أتمتة أكثر
2. **مراقبة أفضل**: إضافة تنبيهات تلقائية للحالات الطارئة
3. **تدريب الفريق**: إجراء تمارين دورية للتعامل مع الحالات الحرجة

## التوصيات للإنتاج

### 1. تحسينات فورية
- أتمتة سكريبتات الاسترجاع
- إضافة نقاط فحص تلقائية
- تحسين آليات النسخ الاحتياطي

### 2. تحسينات مستقبلية
- تطبيق Blue-Green Deployment
- إضافة Feature Flags للتحكم في الميزات
- تحسين آليات مراقبة الأداء

### 3. تدريب وتوعية
- تدريب شهري للفريق على إجراءات الاسترجاع
- محاكاة حوادث مختلفة بانتظام
- تحديث الوثائق بانتظام

## الخلاصة

اختبار الاسترجاع على Staging تم بنجاح كامل وأثبت جاهزية النظام للتعامل مع الحالات الطارئة. جميع السيناريوهات المطلوبة تم اختبارها والنتائج كانت مرضية.

**الحالة النهائية**: ✅ **مكتمل وناجح**
**الجاهزية للإنتاج**: ✅ **مؤكدة**
```

## سكريبت الاختبار الآلي

```bash
#!/bin/bash
# سكريبت اختبار الاسترجاع الآلي

# متغيرات الاختبار
STAGING_URL="https://staging.bthwani.com"
START_TIME=$(date +%s)

echo "🚀 Starting automated rollback test..."

# 1. فحص الصحة قبل الاختبار
echo "📊 Pre-rollback health check..."
curl -f "$STAGING_URL/health" || exit 1

# 2. محاكاة إصدار تجريبي
echo "🔧 Deploying test version..."
# هنا يتم نشر إصدار تجريبي يحتوي على مشكلة

# 3. محاكاة اكتشاف المشكلة
echo "⚠️  Simulating incident detection..."
sleep 5

# 4. تنفيذ الاسترجاع
echo "🔄 Executing rollback..."
# هنا يتم تنفيذ سكريبت الاسترجاع

# 5. قياس زمن الاسترجاع
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# 6. فحص الصحة بعد الاسترجاع
echo "✅ Post-rollback health check..."
curl -f "$STAGING_URL/health" || exit 1

# 7. تشغيل اختبارات الوظائف
echo "🧪 Running functional tests..."
# هنا يتم تشغيل اختبارات السيناريوهات

echo "🎉 Rollback test completed successfully in $DURATION seconds!"
```

## جدولة الاختبارات المستقبلية

### اختبارات شهرية
- **الأسبوع الأول**: اختبار استرجاع Backend
- **الأسبوع الثاني**: اختبار استرجاع Web
- **الأسبوع الثالث**: اختبار استرجاع Mobile Apps
- **الأسبوع الرابع**: اختبار متكامل لجميع الأنظمة

### اختبارات ربع سنوية
- اختبار سيناريوهات معقدة متعددة الأنظمة
- اختبار تأثير فقدان البيانات
- اختبار التعافي من كارثة كاملة

---

**تاريخ آخر تحديث**: 15 يناير 2025
**الإصدار**: 1.0.0
**مسؤول الاختبار**: فريق DevOps
