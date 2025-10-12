# إعداد البيئات - لوحة الإدارة

## المتغيرات البيئية المطلوبة

قم بنسخ ملف `.env.example` إلى `.env` وضبط القيم التالية:

```bash
# رابط API الخاص بالمشروع
VITE_API_URL=https://api.bthwani.com/api/v1

# إعدادات Firebase (إن لزم الأمر)
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_domain
# VITE_FIREBASE_PROJECT_ID=your_project_id

# إعدادات التطوير
VITE_DEV_MODE=true
VITE_DEBUG=true
```

## البيئات المختلفة

### التطوير (Development)
- **API URL**: `http://localhost:3000/api/v1` (افتراضي)
- **استخدم**: `npm run dev` أو `yarn dev`

### الإنتاج (Production)
- **API URL**: `https://api.bthwani.com/api/v1`
- **استخدم**: `npm run build && npm run preview`

## ملاحظات مهمة

1. **توحيد البيئات**: تأكد من أن نفس الـ API URL مستخدم في جميع التطبيقات (التاجر، المستخدم، الإدارة)
2. **الأمان**: لا تشارك ملف `.env` في repository العام
3. **الاختبار**: اختبر في جميع البيئات قبل النشر
