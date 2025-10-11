# Web Application Rollback Handbook

## نظرة عامة
دليل شامل لإجراءات الاسترجاع (Rollback) لتطبيق الويب المستضاف على Hostinger مع ضمان استمرارية الخدمة والحد الأدنى من التوقف.

## استراتيجية الإصدارات

### تسميات الإصدارات الموحدة
```
web-vYYYY.MM.DD-HHMM
```
**أمثلة:**
- `web-v2025.01.15-1430`
- `web-v2025.01.15-1500`
- `web-v2025.01.16-0900`

### هيكل المجلدات في Hostinger
```
/home/uXXXXXX/domains/bthwani.com/
├── public_html/          # الإصدار الحالي (live)
├── releases/            # مجلد الإصدارات السابقة
│   ├── web-v2025.01.15-1430/
│   │   ├── index.html
│   │   ├── assets/
│   │   ├── css/
│   │   └── js/
│   ├── web-v2025.01.15-1500/
│   └── web-v2025.01.16-0900/
├── backups/             # نسخ احتياطية من قاعدة البيانات
└── logs/                # سجلات النشر والأخطاء
```

## إجراءات النشر العادية

### 1. بناء الإصدار الجديد
```bash
# في الجهاز المحلي أو CI/CD
npm run build

# ضغط الملفات للرفع
tar -czf web-v2025.01.15-1500.tar.gz dist/

# رفع إلى الخادم
scp web-v2025.01.15-1500.tar.gz user@hostinger-server:/home/uXXXXXX/domains/bthwani.com/releases/
```

### 2. استخراج وتجهيز الإصدار
```bash
# في خادم Hostinger
cd /home/uXXXXXX/domains/bthwani.com/

# استخراج الإصدار الجديد
tar -xzf releases/web-v2025.01.15-1500.tar.gz -C releases/

# إعداد صلاحيات الملفات
chmod -R 755 releases/web-v2025.01.15-1500/
chown -R uXXXXXX:uXXXXXX releases/web-v2025.01.15-1500/

# اختبار الإصدار الجديد مؤقتاً
# يمكن إنشاء رابط مؤقت للاختبار
```

## خطة الاسترجاع (Rollback Plan)

### سيناريوهات الاسترجاع

#### SEV1 (توقف حرج)
- **السبب**: عدم تحميل الموقع، أخطاء في الصفحات الأساسية، مشاكل أمنية حرجة
- **الوقت المستهدف**: خلال 15 دقيقة
- **الإجراء**: رجوع فوري إلى آخر إصدار مستقر

#### SEV2 (خلل جزئي)
- **السبب**: مشاكل في صفحات معينة، بطء في التحميل، أخطاء في الوظائف
- **الوقت المستهدف**: خلال ساعة واحدة
- **الإجراء**: تقييم الأثر واتخاذ قرار الرجوع أو الإصلاح

#### SEV3 (مشاكل طفيفة)
- **السبب**: أخطاء عرض طفيفة، مشاكل في التصميم
- **الوقت المستهدف**: خلال يوم عمل
- **الإجراء**: إصلاح سريع أو رجوع حسب الأثر

## إجراءات الاسترجاع التفصيلية

### 1. تقييم الوضع (الخطوات الأولى)
```bash
# فحص حالة الموقع الحالية
curl -I https://bthwani.com/

# فحص السجلات للأخطاء الأخيرة
tail -f /home/uXXXXXX/domains/bthwani.com/logs/access.log
tail -f /home/uXXXXXX/domains/bthwani.com/logs/error.log

# فحص استخدام الموارد
df -h /home/uXXXXXX/
free -h
```

### 2. تحديد الإصدار المستهدف للرجوع
```bash
# قائمة الإصدارات المتاحة
ls -la /home/uXXXXXX/domains/bthwani.com/releases/

# فحص تاريخ آخر إصدار مستقر
ls -ld /home/uXXXXXX/domains/bthwani.com/releases/web-v* | tail -3
```

### 3. إجراء الرجوع

#### طريقة التبديل السريع (موصى بها)
```bash
#!/bin/bash
# سكريبت الرجوع السريع

CURRENT_VERSION=$(basename $(readlink /home/uXXXXXX/domains/bthwani.com/public_html))
TARGET_VERSION="web-v2025.01.15-1430"

echo "$(date): Starting rollback from $CURRENT_VERSION to $TARGET_VERSION" >> /home/uXXXXXX/domains/bthwani.com/logs/rollback.log

# إنشاء backup للحالة الحالية (احتياطي)
cp -r /home/uXXXXXX/domains/bthwani.com/public_html /home/uXXXXXX/domains/bthwani.com/backups/emergency-$(date +%Y%m%d-%H%M%S)

# إيقاف الخدمة مؤقتاً (إذا كان هناك web server مخصص)
# systemctl stop nginx  # إذا كان nginx مُعدل

# تبديل الرابط الرمزي
rm /home/uXXXXXX/domains/bthwani.com/public_html
ln -sf /home/uXXXXXX/domains/bthwani.com/releases/$TARGET_VERSION /home/uXXXXXX/domains/bthwani.com/public_html

# إعادة تشغيل الخدمة
# systemctl start nginx

# فحص أن الرجوع تم بنجاح
curl -I https://bthwani.com/

echo "$(date): Rollback completed successfully" >> /home/uXXXXXX/domains/bthwani.com/logs/rollback.log
```

#### طريقة النسخ المباشر (إذا فشل الرابط الرمزي)
```bash
# نسخ محتويات الإصدار السابق إلى public_html
cp -r /home/uXXXXXX/domains/bthwani.com/releases/web-v2025.01.15-1430/* /home/uXXXXXX/domains/bthwani.com/public_html/

# إعداد صلاحيات الملفات
chmod -R 755 /home/uXXXXXX/domains/bthwani.com/public_html/
chown -R uXXXXXX:uXXXXXX /home/uXXXXXX/domains/bthwani.com/public_html/
```

### 4. اختبار ما بعد الاسترجاع

#### فحص الصحة الأساسية:
```bash
# فحص تحميل الصفحة الرئيسية
curl -s https://bthwani.com/ | head -20

# فحص حالة HTTP
curl -I https://bthwani.com/

# فحص الملفات الثابتة (CSS, JS, Images)
curl -I https://bthwani.com/assets/main.js
curl -I https://bthwani.com/assets/main.css
```

#### اختبار الصفحات العامة في نافذة خاصة:
```bash
# اختبار في متصفح حقيقي (يمكن تنفيذه يدوياً)
# 1. افتح نافذة خاصة (Incognito/Private)
# 2. اذهب إلى https://bthwani.com/
# 3. فحص أن الصفحة تحميل بدون أخطاء
# 4. اختبر الروابط والتنقل الأساسي
# 5. اختبر البحث والفلاتر إن وجدت
```

#### سكريبت اختبار شامل:
```bash
#!/bin/bash
# اختبار شامل بعد الرجوع

echo "Testing web application after rollback..."

# 1. فحص الصفحة الرئيسية
echo "1. Testing homepage..."
curl -f -s https://bthwani.com/ > /dev/null && echo "✓ Homepage loads successfully"

# 2. فحص صفحات مهمة
echo "2. Testing key pages..."
curl -f -s https://bthwani.com/about > /dev/null && echo "✓ About page loads"
curl -f -s https://bthwani.com/contact > /dev/null && echo "✓ Contact page loads"

# 3. فحص الملفات الثابتة
echo "3. Testing static assets..."
curl -f -I https://bthwani.com/assets/main.js | grep -q "200 OK" && echo "✓ Main JS loads"
curl -f -I https://bthwani.com/assets/main.css | grep -q "200 OK" && echo "✓ Main CSS loads"

# 4. فحص الصور
echo "4. Testing images..."
curl -f -I https://bthwani.com/images/logo.png | grep -q "200 OK" && echo "✓ Logo image loads"

# 5. فحص الروابط الداخلية
echo "5. Testing internal links..."
curl -f -s https://bthwani.com/ | grep -q "href=\"/about\"" && echo "✓ Internal links present"

echo "All tests completed!"
```

## مراقبة ما بعد الاسترجاع

### مؤشرات النجاح:
1. **تحميل الصفحة الرئيسية**: يجب أن تعمل بدون أخطاء
2. **الملفات الثابتة**: CSS و JS يتم تحميلها بشكل صحيح
3. **الروابط الداخلية**: تعمل جميع الروابط
4. **البحث والفلاتر**: تعمل الوظائف التفاعلية
5. **الأداء**: لا يوجد بطء غير طبيعي

### مراقبة مستمرة:
```bash
# مراقبة السجلات للأخطاء الجديدة
tail -f /home/uXXXXXX/domains/bthwani.com/logs/access.log | grep -v "favicon\|robots"

# مراقبة استخدام الموارد
htop

# مراقبة حالة الخدمة
watch -n 60 'curl -f -I https://bthwani.com/ | head -1'
```

### أدوات مراقبة مفيدة:
```bash
# استخدام Google PageSpeed Insights
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://bthwani.com/&key=API_KEY"

# فحص الأمان مع Mozilla Observatory
curl "https://http-observatory.security.mozilla.org/api/v1/analyze?host=bthwani.com" | jq
```

## جدولة الاسترجاع

### متى يتم الاسترجاع؟
1. **فوراً**: إذا لم يعد الموقع يحمل أو يوجد أخطاء حرجة
2. **خلال ساعة**: إذا تأثرت وظائف أساسية مثل البحث أو التنقل
3. **خلال يوم عمل**: إذا كانت مشاكل طفيفة في التصميم أو المحتوى

### من يقرر الاسترجاع؟
- **SEV1**: فريق DevOps + Frontend Lead فوراً
- **SEV2**: Product Manager + Technical Lead
- **SEV3**: فريق التطوير بعد تقييم الأثر

## التوثيق والتقارير

### بعد كل استرجاع:
1. **تسجيل الحادث**: في نظام إدارة الحوادث
2. **تحليل السبب الجذري**: اجتماع Post-Mortem
3. **تحسين العملية**: تحديث هذا الدليل إن لزم الأمر
4. **إشعار الفرق المعنية**: عبر Slack/Email

### نموذج تقرير الاسترجاع:
```markdown
# تقرير استرجاع الموقع [التاريخ]

## تفاصيل الحادث
- **الوقت**: YYYY-MM-DD HH:MM
- **المستوى**: SEV1/SEV2/SEV3
- **السبب**: وصف مختصر للمشكلة (مثل: خطأ في JavaScript، مشكلة في CSS)

## إجراءات الاسترجاع
- **الإصدار المسترجع إليه**: web-vYYYY.MM.DD-HHMM
- **وقت البدء**: HH:MM
- **وقت الانتهاء**: HH:MM
- **المدة الإجمالية**: XM
- **الطريقة المستخدمة**: تبديل الرابط الرمزي / نسخ مباشر

## نتائج الاختبار
- [ ] الصفحة الرئيسية تحميل بدون أخطاء
- [ ] الصفحات العامة تعمل بشكل طبيعي
- [ ] الملفات الثابتة (CSS, JS) تحميل بشكل صحيح
- [ ] البحث والفلاتر تعمل في نافذة خاصة
- [ ] لا توجد أخطاء في Console

## الدروس المستفادة
- [وصف الدرس المستفاد والتحسينات المقترحة]
- [اقتراحات لتحسين عملية النشر والاختبار]
```

## ملحقات

### أوامر مفيدة للاسترجاع السريع:
```bash
# فحص الإصدار الحالي
ls -la /home/uXXXXXX/domains/bthwani.com/public_html

# قائمة الإصدارات المتاحة مرتبة بالتاريخ
ls -la /home/uXXXXXX/domains/bthwani.com/releases/ | sort -k6,7

# فحص حجم الملفات للتأكد من اكتمال النسخ
du -sh /home/uXXXXXX/domains/bthwani.com/public_html

# فحص آخر تعديل للملفات
find /home/uXXXXXX/domains/bthwani.com/public_html -type f -mmin -5
```

### نقاط الاتصال للطوارئ:
- **Slack**: #frontend-emergency
- **Email**: frontend-team@bthwani.com
- **Phone**: +966-XX-XXXXXXX (Frontend Lead)

### نصائح لتسريع الاسترجاع:
1. **الحفاظ على نسخ احتياطية**: احتفظ بـ 3 إصدارات سابقة على الأقل
2. **اختبار قبل النشر**: اختبر في staging قبل الإنتاج دائماً
3. **مراقبة مستمرة**: استخدم أدوات مراقبة للكشف المبكر عن المشاكل
4. **توثيق الإجراءات**: سجل جميع خطوات النشر والاسترجاع

---
**تاريخ آخر تحديث**: 15 يناير 2025
**الإصدار**: 1.0.0
**مسؤول الصيانة**: فريق DevOps
