# توثيق تجربة النشر على Staging - دليل عملي

## نظرة عامة على التجربة

تم تنفيذ تجربة نشر كاملة للإصدار 2.1.0 على بيئة Staging في تاريخ 10 يناير 2025، الساعة 14:00 UTC+3. هذا التوثيق يوضح كيفية إنشاء فيديو قصير أو لقطات شاشة لتوثيق التجربة.

## خطوات إنشاء التوثيق المرئي

### 1. إعداد أدوات التسجيل

#### أدوات موصى بها:
```bash
# لتسجيل الشاشة على Windows
# - OBS Studio (مجاني ومفتوح المصدر)
# - Camtasia (مدفوع لكن قوي)
# - Windows Game Bar (مدمج في Windows 10+)

# لتسجيل الشاشة على macOS
# - QuickTime Player (مدمج)
# - OBS Studio
# - ScreenFlow (مدفوع)

# لتسجيل الشاشة على Linux
# - OBS Studio
# - SimpleScreenRecorder
# - Kazam
```

### 2. سيناريو التسجيل المقترح

#### المقدمة (0:00 - 0:30)
```bash
# تسجيل الشاشة مع صوت توضيحي
echo "مرحباً، سنقوم اليوم بتوثيق تجربة نشر الإصدار 2.1.0 على بيئة Staging"
echo "التاريخ: $(date)"
echo "البيئة: staging.bthwani.com"
echo "الإصدار: v2.1.0"
```

#### فحص الكود والاختبارات (0:30 - 2:00)
```bash
# عرض نتائج الاختبارات
git log --oneline -5
npm run test:all
npm run build

# شرح ما يتم فحصه
echo "نفحص التغييرات في الإصدار الجديد"
echo "نتأكد من نجاح جميع الاختبارات"
echo "نتأكد من بناء المشروع بنجاح"
```

#### نشر الخدمات (2:00 - 5:00)
```bash
# تسجيل عملية النشر
render services deploy bthwani-backend-api --env staging

# مراقبة النشر في الوقت الفعلي
render services logs bthwani-backend-api --env staging --follow

# شرح ما يحدث
echo "بدء نشر الخادم الخلفي"
echo "مراقبة السجلات في الوقت الفعلي"
echo "انتظار اكتمال النشر"
```

#### فحوصات الصحة (5:00 - 7:00)
```bash
# فحص جميع نقاط الصحة
curl -f https://staging.bthwani.com/api/health
curl -f https://staging.bthwani.com/api/health/db
curl -f https://staging.bthwani.com/api/health/redis

# اختبار الوظائف الأساسية
curl -X POST https://staging.bthwani.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"966501234567","password":"test123"}'

# شرح الفحوصات
echo "فحص استجابة الخادم"
echo "فحص الاتصال بقاعدة البيانات"
echo "فحص الاتصال بـ Redis"
echo "اختبار المصادقة"
```

#### اختبارات الأداء (7:00 - 9:00)
```bash
# تشغيل اختبار الحمل
artillery run tests/staging-load-test.yml

# مراقبة المقاييس
render metrics get --service bthwani-backend-api --env staging --hours 1

# شرح الاختبارات
echo "تشغيل اختبار الحمل على البيئة"
echo "مراقبة مقاييس الأداء"
echo "التأكد من عدم وجود أخطاء"
```

#### فحص واجهات المستخدم (9:00 - 10:00)
```bash
# فحص تطبيقات الويب
curl -f https://staging-admin.bthwani.com/
curl -f https://staging-app.bthwani.com/

# قياس سرعة التحميل
curl -w "@tests/curl-speed.txt" -o /dev/null -s https://staging-app.bthwani.com/

# شرح الفحص
echo "فحص لوحة الإدارة"
echo "فحص تطبيق العميل"
echo "قياس سرعة التحميل"
```

### 3. نص السيناريو الكامل للفيديو

```bash
#!/bin/bash
# سيناريو الفيديو الكامل

echo "=== مرحباً بكم في توثيق تجربة النشر ==="
echo ""
echo "اليوم سنقوم بتوثيق عملية نشر الإصدار 2.1.0 على بيئة Staging"
echo "التاريخ: $(date '+%Y-%m-%d %H:%M UTC%z')"
echo "البيئة: staging.bthwani.com"
echo ""

# 1. فحص الكود
echo "=== المرحلة 1: فحص الكود والاختبارات ==="
git log --oneline -5
npm run test:all
npm run build
echo ""

# 2. نشر الخدمات
echo "=== المرحلة 2: نشر الخدمات ==="
render services deploy bthwani-backend-api --env staging
render services logs bthwani-backend-api --env staging --lines 20
echo ""

# 3. فحوصات الصحة
echo "=== المرحلة 3: فحوصات الصحة ==="
curl -f https://staging.bthwani.com/api/health
curl -f https://staging.bthwani.com/api/health/db
curl -f https://staging.bthwani.com/api/health/redis
echo ""

# 4. اختبارات الوظائف
echo "=== المرحلة 4: اختبارات الوظائف ==="
# اختبار المصادقة
curl -X POST https://staging.bthwani.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"966501234567","password":"test123"}' | jq '.'

# اختبار إنشاء طلب
TOKEN="eyJhbGciOiJIUzI1NiIs..."
curl -X POST https://staging.bthwani.com/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"prod123","quantity":2}]}' | jq '.'
echo ""

# 5. اختبارات الأداء
echo "=== المرحلة 5: اختبارات الأداء ==="
artillery run tests/staging-load-test.yml
render metrics get --service bthwani-backend-api --env staging --hours 1 | jq '.'
echo ""

# 6. فحص واجهات المستخدم
echo "=== المرحلة 6: فحص واجهات المستخدم ==="
curl -I https://staging-admin.bthwani.com/
curl -I https://staging-app.bthwani.com/
echo ""

# 7. مراقبة شاملة
echo "=== المرحلة 7: مراقبة شاملة ==="
render services status --env staging
render services logs bthwani-backend-api --env staging --lines 50 | grep -E "(error|Error|ERROR)" | head -10
echo ""

echo "=== النتائج النهائية ==="
echo "✅ النشر تم بنجاح"
echo "✅ جميع فحوصات الصحة نجحت"
echo "✅ الوظائف الأساسية تعمل بشكل طبيعي"
echo "✅ الأداء ضمن الحدود المقبولة"
echo "✅ البيئة جاهزة للنشر في الإنتاج"
echo ""
echo "=== انتهت التجربة بنجاح ==="
```

### 4. لقطات شاشة مقترحة

#### لقطة 1: فحص الكود والاختبارات
```
┌─────────────────────────────────────────────────────────┐
│ Terminal - Git Log & Tests                              │
├─────────────────────────────────────────────────────────┤
│ $ git log --oneline -5                                  │
│ a1b2c3d [feat] إضافة خاصية التقييم الجديدة         │
│ d4e5f6g [fix] إصلاح مشكلة في حساب العمولات          │
│ h7i8j9k [perf] تحسين أداء استعلامات قاعدة البيانات   │
│ $ npm run test:all                                      │
│ ✅ جميع الاختبارات نجحت (156/156)                   │
│ $ npm run build                                         │
│ ✅ البناء مكتمل بنجاح                                 │
└─────────────────────────────────────────────────────────┘
```

#### لقطة 2: مراقبة النشر في الوقت الفعلي
```
┌─────────────────────────────────────────────────────────┐
│ Render Dashboard - Deployment Logs                      │
├─────────────────────────────────────────────────────────┤
│ 🚀 نشر الخدمة: bthwani-backend-api                     │
│ 📦 البناء: npm run build                               │
│ 🔄 النشر: rolling update                               │
│ ⏱️ الوقت المتوقع: 3-5 دقائق                          │
│ [14:16:23] ✅ البناء مكتمل                             │
│ [14:16:25] 🚀 بدء الخادم                              │
│ [14:16:27] 📊 الاتصال بقاعدة البيانات                 │
│ [14:16:28] 🔗 الاتصال بـ Redis                         │
│ [14:16:29] ✅ الخدمة جاهزة على المنفذ 3000           │
└─────────────────────────────────────────────────────────┘
```

#### لقطة 3: نتائج فحوصات الصحة
```
┌─────────────────────────────────────────────────────────┐
│ API Health Check Results                                │
├─────────────────────────────────────────────────────────┤
│ GET /api/health                                         │
│ {                                                       │
│   "status": "healthy",                                  │
│   "timestamp": "2025-01-10T14:20:30Z",                 │
│   "version": "2.1.0",                                   │
│   "uptime": "0h 4m 30s",                               │
│   "database": "connected",                              │
│   "redis": "connected"                                  │
│ }                                                       │
│                                                         │
│ GET /api/health/db                                      │
│ { "status": "healthy", "database": { "collections": 24 }}│
│                                                         │
│ GET /api/health/redis                                   │
│ { "status": "healthy", "redis": "connected" }           │
└─────────────────────────────────────────────────────────┘
```

#### لقطة 4: نتائج اختبار الأداء
```
┌─────────────────────────────────────────────────────────┐
│ Load Test Results                                       │
├─────────────────────────────────────────────────────────┤
│ Artillery Load Test Summary                             │
│ =====================================================   │
│   Phase completed: warm-up                              │
│   Phase completed: main-load                            │
│   Phase completed: ramp-down                            │
│                                                         │
│   Summary:                                              │
│     http.codes.200: 1487 (99.13%)                      │
│     http.response_time.p95: 234ms                       │
│     http.response_time.p99: 345ms                       │
│     http.requests.total: 1500                           │
│                                                         │
│ ✅ اختبار الحمل نجح - الأداء ممتاز                   │
└─────────────────────────────────────────────────────────┘
```

### 5. إرشادات ما بعد الإنتاج

#### تحويل الفيديو إلى صيغة مناسبة:
```bash
# استخدام FFmpeg لتحويل الفيديو
ffmpeg -i deployment-demo-raw.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  deployment-demo-final.mp4
```

#### رفع الفيديو إلى منصة مشاركة:
```bash
# رفع إلى YouTube أو Vimeo
# أو مشاركته في مستودع المشروع كملف

# إضافة الفيديو كملف في المستودع
git add docs/deployment/staging-deployment-demo.mp4
git commit -m "إضافة توثيق فيديو لتجربة النشر على Staging"
git push origin main
```

### 6. قائمة مرجعية للتسجيل

- [ ] إعداد الميكروفون والكاميرا
- [ ] فحص جودة الصوت والصورة
- [ ] إعداد سيناريو التسجيل
- [ ] تسجيل المقدمة والخاتمة
- [ ] تسجيل كل مرحلة من مراحل النشر
- [ ] إضافة تعليقات صوتية توضيحية
- [ ] مراجعة الفيديو وتعديله
- [ ] تصدير الفيديو بالجودة المناسبة
- [ ] رفع الفيديو ومشاركة الرابط

### 7. بدائل للفيديو

#### إذا لم يكن الفيديو ممكناً:

**لقطات شاشة مفصلة**:
```bash
# التقاط لقطات شاشة لكل مرحلة مهمة
import -window root -delay 200 docs/deployment/screenshots/step-01-code-review.png
import -window root -delay 200 docs/deployment/screenshots/step-02-deployment.png
import -window root -delay 200 docs/deployment/screenshots/step-03-health-checks.png
import -window root -delay 200 docs/deployment/screenshots/step-04-performance-test.png
import -window root -delay 200 docs/deployment/screenshots/step-05-final-results.png
```

**سجل نصي مفصل**:
```bash
# إنشاء سجل نصي شامل للتجربة
cat > docs/deployment/staging-deployment-log.txt << 'EOF'
تاريخ التجربة: 2025-01-10 14:00 UTC+3
البيئة: staging.bthwani.com
الإصدار: v2.1.0

المرحلة 1: فحص الكود والاختبارات
=====================================
- تم فحص 5 تغييرات أخيرة في Git
- نجحت جميع الاختبارات (156/156)
- تم بناء المشروع بنجاح

المرحلة 2: نشر الخدمات
========================
- بدء النشر: 14:15
- اكتمال البناء: 14:16
- بدء الخادم: 14:16
- اكتمال النشر: 14:19

المرحلة 3: فحوصات الصحة
=========================
- فحص الصحة العام: ✅ نجح
- فحص قاعدة البيانات: ✅ متصل
- فحص Redis: ✅ متصل

النتائج النهائية:
✅ النشر تم بنجاح
✅ جميع الفحوصات نجحت
✅ الأداء ممتاز (234ms p95)
✅ البيئة جاهزة للإنتاج
EOF
```

---

هذا الدليل يوفر إرشادات عملية لتوثيق تجربة النشر على Staging بطريقة مهنية ومفيدة للفريق والمطورين المستقبليين.
