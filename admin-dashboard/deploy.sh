#!/bin/bash

# =====================================
# ملف البناء والرفع للاستضافة
# =====================================

echo "🚀 بدء عملية البناء والرفع..."

# تنظيف المجلدات السابقة
echo "🧹 تنظيف المجلدات السابقة..."
rm -rf dist
rm -rf build

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
npm install

# بناء المشروع للإنتاج
echo "🔨 بناء المشروع للإنتاج..."
npm run build

# التحقق من نجاح البناء
if [ ! -d "dist" ]; then
    echo "❌ فشل في البناء!"
    exit 1
fi

echo "✅ تم البناء بنجاح!"

# عرض حجم الملفات
echo "📊 حجم الملفات:"
du -sh dist/*

# نسخ ملفات إضافية مهمة
echo "📋 نسخ الملفات الإضافية..."
cp public/.htaccess dist/
cp public/robots.txt dist/
cp public/sitemap.xml dist/

# إنشاء ملف معلومات البناء
echo "📝 إنشاء ملف معلومات البناء..."
echo "Build Date: $(date)" > dist/build-info.txt
echo "Build Version: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" >> dist/build-info.txt
echo "Node Version: $(node --version)" >> dist-build-info.txt
echo "NPM Version: $(npm --version)" >> dist/build-info.txt

echo "🎉 تم إعداد الملفات للرفع!"
echo ""
echo "📁 مجلد dist جاهز للرفع إلى الاستضافة"
echo "📋 الملفات المطلوبة:"
echo "   - dist/ (المجلد الرئيسي)"
echo "   - .htaccess (إعدادات الخادم)"
echo "   - robots.txt (SEO)"
echo "   - sitemap.xml (SEO)"
echo ""
echo "💡 نصائح للرفع:"
echo "   1. ارفع محتويات مجلد dist إلى المجلد الجذر للموقع"
echo "   2. تأكد من وجود ملف .htaccess"
echo "   3. تأكد من تفعيل mod_rewrite على الخادم"
echo "   4. اختبر الروابط بعد الرفع"
echo ""
echo "🔗 روابط مهمة للاختبار:"
echo "   - الصفحة الرئيسية: /"
echo "   - الخدمات: /services"
echo "   - للتجار: /for-merchants"
echo "   - للكباتن: /become-captain"
echo "   - الدعم: /support"
echo "   - من نحن: /about"
echo "   - التواصل: /contact"
