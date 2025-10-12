# دليل النشر والعمليات لمنصة بثواني

## نظرة عامة على النشر

يوثق هذا الدليل عمليات النشر والصيانة والتشغيل لمنصة بثواني، مع التركيز على الإجراءات الآمنة والفعالة.

## بيئات النشر

### البيئات المتاحة
- **التطوير** (Development) - `localhost:3000`
- **الاختبار** (Staging) - `staging.bthwani.com`
- **الإنتاج** (Production) - `api.bthwani.com`

### إعداد البيئات

#### متطلبات النظام لكل خادم
```bash
# متطلبات أساسية
Ubuntu 20.04 LTS أو أحدث
Node.js v18.17.0 أو أحدث
MongoDB v5.0 أو أحدث
Redis v6.0 أو أحدث
Nginx v1.20 أو أحدث
PM2 (مدير العمليات)

# مساحة التخزين المطلوبة
الحد الأدنى: 50GB SSD
موصى به: 100GB NVMe SSD

# الذاكرة
الحد الأدنى: 4GB RAM
موصى به: 8GB RAM أو أكثر
```

## إجراءات النشر

### 1. نشر الخادم الخلفي (Backend)

#### خطوات النشر التلقائي
```bash
# 1. الدخول للخادم
ssh user@your-server-ip

# 2. الانتقال لمجلد المشروع
cd /var/www/bthwani-backend

# 3. سحب أحدث التغييرات
git pull origin main

# 4. تثبيت التبعيات
npm ci --production

# 5. بناء المشروع
npm run build

# 6. إعادة تشغيل الخدمة
pm2 reload bthwani-backend

# 7. فحص حالة الخدمة
pm2 status
pm2 logs bthwani-backend --lines 50
```

#### إعداد PM2 للإنتاج
```bash
# ملف إعدادات PM2
{
  "name": "bthwani-backend",
  "script": "dist/index.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 3000
  },
  "error_file": "/var/log/pm2/bthwani-backend-error.log",
  "out_file": "/var/log/pm2/bthwani-backend-out.log",
  "log_file": "/var/log/pm2/bthwani-backend.log",
  "time": true,
  "merge_logs": true,
  "watch": false,
  "max_memory_restart": "1G"
}
```

### 2. نشر تطبيقات الويب

#### نشر لوحة الإدارة
```bash
# 1. بناء التطبيق للإنتاج
npm run build:prod

# 2. نسخ الملفات لمجلد Nginx
sudo cp -r dist/* /var/www/admin-dashboard/

# 3. إعادة تشغيل Nginx
sudo systemctl reload nginx
```

#### إعداد Nginx للوحة الإدارة
```nginx
server {
    listen 80;
    server_name admin.bthwani.com;
    root /var/www/admin-dashboard;
    index index.html;

    # حماية من الوصول غير المصرح به
    location / {
        try_files $uri $uri/ /index.html;

        # إعدادات الأمان
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # ملفات ثابتة
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # ضغط الملفات
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss;
}
```

### 3. نشر قواعد البيانات

#### نسخ احتياطي قبل النشر
```bash
# إنشاء نسخة احتياطية
mongodump --uri="$MONGO_URI" --out="/backup/$(date +%Y%m%d_%H%M%S)"

# نسخ النسخة للتخزين السحابي
aws s3 cp /backup/$(date +%Y%m%d_%H%M%S) s3://bthwani-backups/mongodb/
```

#### تشغيل migrations إذا لزم الأمر
```javascript
// مثال على migration لإضافة حقل جديد
const addUserRoleMigration = {
  name: 'add-user-role-field',
  up: async (db) => {
    await db.collection('users').updateMany(
      { role: { $exists: false } },
      { $set: { role: 'customer' } }
    );
  },
  down: async (db) => {
    await db.collection('users').updateMany(
      {},
      { $unset: { role: '' } }
    );
  }
};
```

## إجراءات الصيانة الدورية

### الصيانة اليومية
```bash
# 1. فحص حالة الخدمات
pm2 status
pm2 jlist

# 2. فحص استخدام الموارد
htop
df -h
free -h

# 3. فحص السجلات بحثاً عن أخطاء
pm2 logs --lines 100
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 4. فحص قاعدة البيانات
mongosh --eval "db.stats()"
mongosh --eval "db.collection.stats()"
```

### الصيانة الأسبوعية
```bash
# 1. تحديث التبعيات الأمنية
npm audit fix --production

# 2. تنظيف الملفات المؤقتة
find /tmp -type f -mtime +7 -delete
find /var/log -type f -name "*.log" -mtime +30 -delete

# 3. تحسين قاعدة البيانات
mongosh --eval "db.repairDatabase()"
mongosh --eval "db.collection.reIndex()"

# 4. فحص الأمان
sudo fail2ban-client status
sudo ufw status
```

### الصيانة الشهرية
```bash
# 1. مراجعة السجلات الأمنية
sudo journalctl --since "1 month ago" | grep -i "failed\|error\|attack"

# 2. تحديث نظام التشغيل والحزم
sudo apt update && sudo apt upgrade -y
sudo npm update -g

# 3. إنشاء تقرير الأداء
# استخدام أدوات مثل PM2 Monitoring أو New Relic

# 4. مراجعة استراتيجية النسخ الاحتياطي
aws s3 ls s3://bthwani-backups/ --recursive
```

## إدارة قواعد البيانات

### استراتيجية النسخ الاحتياطي
```bash
# نسخ احتياطي يومي
0 2 * * * mongodump --uri="$MONGO_URI" --out="/backup/daily/$(date +%Y%m%d)"

# نسخ احتياطي أسبوعي كامل
0 3 * * 0 mongodump --uri="$MONGO_URI" --out="/backup/weekly/$(date +%Y%m%d)"

# تنظيف النسخ القديمة (أكثر من 30 يوم)
0 4 * * * find /backup -type d -mtime +30 -exec rm -rf {} +
```

### تحسين الأداء
```javascript
// فهرسة قاعدة البيانات
db.orders.createIndex({ "userId": 1, "createdAt": -1 })
db.orders.createIndex({ "status": 1, "createdAt": -1 })
db.orders.createIndex({ "location": "2dsphere" })

// تحسين الاستعلامات
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$vendorId", total: { $sum: "$total" } } }
])
```

## مراقبة الأداء والأمان

### مراقبة الأداء
```bash
# تثبيت وإعداد Prometheus + Grafana
# أو استخدام خدمات مثل DataDog أو New Relic

# مراقبة الخادم
mpstat -P ALL 1 5
iostat -x 1 5
vmstat 1 5

# مراقبة التطبيق
pm2 monit
clinic doctor -- node dist/index.js
```

### مراقبة الأمان
```bash
# فحص الثغرات الأمنية
sudo lynis audit system
sudo rkhunter --check

# مراقبة محاولات الدخول
sudo fail2ban-client status ssh
sudo fail2ban-client status nginx-http-auth

# فحص السجلات بحثاً عن أنشطة مشبوهة
grep -i "failed\|attack\|malicious" /var/log/auth.log
```

## إجراءات التعامل مع المشاكل

### استكشاف الأخطاء الشائعة

#### مشكلة: الخادم لا يستجيب
```bash
# 1. فحص حالة الخدمة
pm2 status

# 2. فحص السجلات
pm2 logs bthwani-backend --lines 50

# 3. فحص استخدام الموارد
htop

# 4. إعادة تشغيل الخدمة إذا لزم الأمر
pm2 restart bthwani-backend
```

#### مشكلة: قاعدة البيانات بطيئة
```bash
# 1. فحص حالة MongoDB
mongosh --eval "db.serverStatus()"

# 2. فحص الاستعلامات البطيئة
mongosh --eval "db.system.profile.find().sort({millis:-1}).limit(10)"

# 3. فحص الفهرسة
mongosh --eval "db.collection.getIndexes()"

# 4. تحسين الاستعلامات أو إضافة فهارس جديدة
```

#### مشكلة: استهلاك ذاكرة عالي
```bash
# 1. تحديد العملية المستهلكة للذاكرة
ps aux --sort=-%mem | head -10

# 2. فحص تسريبات الذاكرة
clinic doctor -- node dist/index.js

# 3. إعادة تشغيل الخدمة
pm2 restart bthwani-backend

# 4. تحسين إعدادات PM2
pm2 reload bthwani-backend --update-env
```

### خطة التعافي من الكوارث

#### سيناريو انقطاع الخادم الرئيسي
```bash
# 1. التبديل للخادم الاحتياطي
# تحديث DNS أو Load Balancer

# 2. استرداد البيانات من آخر نسخة احتياطية
mongorestore --uri="$MONGO_URI" /backup/latest

# 3. فحص سلامة البيانات
mongosh --eval "db.stats()"

# 4. إعادة توجيه الحركة للخادم الرئيسي
```

#### سيناريو فقدان البيانات
```bash
# 1. إيقاف جميع عمليات الكتابة
# وضع النظام في وضع الصيانة

# 2. استرداد من النسخة الاحتياطية الأحدث
mongorestore --uri="$MONGO_URI" /backup/$(ls -t /backup/ | head -1)

# 3. فحص سلامة البيانات المستردة
mongosh --eval "db.collection.countDocuments()"

# 4. إعادة تشغيل الخدمات
```

## إدارة التطبيقات المحمولة

### نشر تحديثات التطبيقات
```bash
# 1. بناء التطبيق للإنتاج
eas build --platform android --profile production
eas build --platform ios --profile production

# 2. نشر التحديث
eas update --branch production

# 3. مراقبة حالة النشر
eas update:list
```

### مراقبة أداء التطبيقات
```bash
# 1. مراقبة الأخطاء والانهيارات
# استخدام Sentry أو Firebase Crashlytics

# 2. مراقبة الأداء
# استخدام React Native Performance Monitor

# 3. مراقبة استخدام الموارد
# استخدام Android Profiler أو Xcode Instruments
```

## الامتثال واللوائح

### حماية البيانات (GDPR)
- تشفير جميع البيانات الحساسة
- سجلات مفصلة لجميع عمليات الوصول للبيانات
- إمكانية حذف بيانات المستخدم بالكامل
- موافقات صريحة لجمع البيانات

### لوائح الدفع (PCI DSS)
- عدم تخزين بيانات البطاقات الائتمانية
- استخدام بوابات دفع معتمدة وآمنة
- تشفير جميع معاملات الدفع
- مراجعة دورية للأمان

### قوانين حماية المستهلكين
- عرض سياسات الخصوصية والشروط والأحكام بوضوح
- آلية سهلة للإبلاغ عن المشاكل والشكاوى
- ضمان جودة الخدمة والتسليم في الوقت المحدد
- سياسة إرجاع واسترداد واضحة

## جدولة المهام والمسؤوليات

### المسؤوليات اليومية
- [ ] فحص حالة جميع الخدمات
- [ ] مراجعة السجلات بحثاً عن أخطاء
- [ ] التحقق من النسخ الاحتياطي
- [ ] مراقبة استخدام الموارد

### المسؤوليات الأسبوعية
- [ ] تحديث التبعيات الأمنية
- [ ] مراجعة التقارير الأمنية
- [ ] تحسين الأداء حسب الحاجة
- [ ] اختبار خطة التعافي من الكوارث

### المسؤوليات الشهرية
- [ ] مراجعة شاملة للأمان والأداء
- [ ] تحديث الوثائق والإجراءات
- [ ] تدريب الفريق على الإجراءات الجديدة
- [ ] مراجعة التكاليف والموارد

## الاتصال والدعم

### فريق الدعم الفني
- **البريد الإلكتروني**: tech-support@bthwani.com
- **الهاتف**: +966-XX-XXX-XXXX
- **المنصة الداخلية**: support.bthwani.com

### قنوات التواصل
- **Slack**: #tech-support للمشاكل الفنية
- **Jira**: لتتبع المشاكل والمهام
- **GitHub**: للتقارير عن الأخطاء في الكود

### اتفاقيات مستوى الخدمة (SLA)
- **وقت الاستجابة**: أقل من 4 ساعات للمشاكل الحرجة
- **وقت الحل**: أقل من 24 ساعة للمشاكل الحرجة
- **توفر الخدمة**: 99.9% شهرياً
- **تعويضات**: خصم 10% لكل ساعة انقطاع بعد الحد

---

هذا الدليل يُحدث بانتظام مع تطور المنصة وإضافة إجراءات جديدة للصيانة والأمان.
