# دليل رفع التطبيق للاستضافة 🚀

## 📋 المتطلبات الأساسية

- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- حساب استضافة ويب يدعم PHP و Apache
- وصول FTP أو cPanel

## 🛠️ خطوات البناء

### 1. البناء التلقائي (مفضل)

#### على Windows:

```bash
deploy.bat
```

#### على Linux/Mac:

```bash
chmod +x deploy.sh
./deploy.sh
```

### 2. البناء اليدوي

```bash
# تثبيت التبعيات
npm install

# بناء المشروع
npm run build
```

## 📁 الملفات المطلوبة للرفع

بعد البناء، ستجد المجلدات والملفات التالية في مجلد `dist`:

```
dist/
├── index.html
├── assets/
│   ├── js/
│   ├── css/
│   └── images/
├── .htaccess
├── robots.txt
├── sitemap.xml
└── build-info.txt
```

## 🌐 خطوات الرفع للاستضافة

### الطريقة الأولى: عبر cPanel

1. **الدخول إلى cPanel**

   - ادخل إلى لوحة التحكم الخاصة بالاستضافة
   - ابحث عن "File Manager" أو "إدارة الملفات"

2. **فتح مجلد الموقع**

   - انتقل إلى مجلد `public_html` أو `www`
   - احذف الملفات الموجودة (احتفظ بنسخة احتياطية)

3. **رفع الملفات**
   - ارفع جميع محتويات مجلد `dist`
   - تأكد من رفع ملف `.htaccess`

### الطريقة الثانية: عبر FTP

1. **استخدام برنامج FTP**

   - استخدم FileZilla أو أي برنامج FTP آخر
   - اتصل بالخادم باستخدام بيانات الاتصال

2. **رفع الملفات**
   - انتقل إلى مجلد `public_html`
   - ارفع جميع محتويات مجلد `dist`

## ⚙️ إعدادات الخادم

### تفعيل mod_rewrite

تأكد من تفعيل وحدة `mod_rewrite` على الخادم:

1. **في cPanel:**

   - ابحث عن "Apache Configuration"
   - تأكد من تفعيل "mod_rewrite"

2. **في ملف .htaccess:**
   - تأكد من وجود الملف
   - تأكد من صحة القواعد

### إعدادات PHP

```ini
# في ملف php.ini
memory_limit = 256M
max_execution_time = 300
upload_max_filesize = 64M
post_max_size = 64M
```

## 🔍 اختبار الموقع

بعد الرفع، اختبر الروابط التالية:

- ✅ الصفحة الرئيسية: `https://yourdomain.com/`
- ✅ الخدمات: `https://yourdomain.com/services`
- ✅ للتجار: `https://yourdomain.com/for-merchants`
- ✅ للكباتن: `https://yourdomain.com/become-captain`
- ✅ الدعم: `https://yourdomain.com/support`
- ✅ من نحن: `https://yourdomain.com/about`
- ✅ التواصل: `https://yourdomain.com/contact`

## 🚨 حل المشاكل الشائعة

### مشكلة: الروابط لا تعمل

**الحل:** تأكد من وجود ملف `.htaccess` وتفعيل `mod_rewrite`

### مشكلة: الصفحة فارغة

**الحل:** تحقق من وحدة التحكم في المتصفح للأخطاء

### مشكلة: الملفات لا تتحمل

**الحل:** تأكد من رفع جميع الملفات في مجلد `assets`

### مشكلة: الصور لا تظهر

**الحل:** تحقق من مسارات الصور في مجلد `assets/images`

## 📱 تحسين الأداء

### 1. ضغط الملفات

```apache
# في ملف .htaccess
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### 2. التخزين المؤقت

```apache
# في ملف .htaccess
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 3. CDN

- استخدم CDN للصور والملفات الثابتة
- استخدم CDN للخطوط (Google Fonts)

## 🔒 الأمان

### 1. HTTPS

- فعّل شهادة SSL
- ارفع ملف `.htaccess` مع قواعد HTTPS

### 2. حماية الملفات

```apache
# في ملف .htaccess
<FilesMatch "\.(env|log|sql|md|txt|yml|yaml|json|lock)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

### 3. رؤوس الأمان

```apache
# في ملف .htaccess
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
```

## 📊 مراقبة الأداء

### 1. Google PageSpeed Insights

- اختبر سرعة الموقع
- اتبع التوصيات

### 2. GTmetrix

- اختبر الأداء
- حل المشاكل المكتشفة

### 3. Google Search Console

- أضف الموقع
- راجع تقارير SEO

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تحقق من وحدة التحكم في المتصفح
2. راجع ملفات السجل في الاستضافة
3. تأكد من إعدادات الخادم
4. اختبر الموقع على أجهزة مختلفة

## 🎯 نصائح إضافية

- **احتفظ بنسخة احتياطية** من الموقع القديم
- **اختبر الموقع** على متصفحات مختلفة
- **راجع الأداء** بانتظام
- **حدث الموقع** دورياً
- **راقب الأخطاء** في وحدة التحكم

---

**ملاحظة:** تأكد من تحديث الروابط في ملفات `robots.txt` و `sitemap.xml` لتناسب نطاقك.
