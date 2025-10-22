# 🚨 دليل إعداد الأسرار والمتغيرات البيئية - CRITICAL SECURITY

## 🔥 حالة الطوارئ الأمنية

تم اكتشاف **5 أسرار حرجة مكشوفة** في الكود. تم إصلاحها مؤقتاً، لكن يجب اتخاذ الإجراءات التالية **فوراً**:

### 1. إبطال Firebase API Keys المكشوفة
**القيم المكشوفة:**
- `AIzaSyCN6cX8lKQgEkMkEXsMKJjljRJQqlY_yzY` (admin-dashboard)
- `AIzaSyDcj9GF6Jsi7aIWHoOmH9OKwdOs2pRswS0` (bthwani-web)

**الإجراءات:**
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع Bthwani
3. **Project Settings > General > Your apps**
4. **Delete the compromised web apps**
5. **Create new web apps** with new API keys
6. **Update all .env files** with the new keys

### 2. تغيير بيانات MongoDB
**البيانات المكشوفة:**
```
mongodb+srv://bthwani1_db_user:WTmCFUDVVGOTeMHc@cluster0.vip178l.mongodb.net/
```

**الإجراءات:**
1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Database Access > Edit user "bthwani1_db_user"**
3. **Change password** إلى كلمة مرور قوية جديدة
4. **Rotate API keys** إذا كانت مستخدمة
5. **Update all .env files** with new credentials

### 3. إعادة تعيين كلمة مرور Admin
**الكلمة المكشوفة:** `admin1234`

**الإجراءات:**
1. في Firebase Console: **Authentication > Users**
2. ابحث عن `admin@bthwani.com`
3. **Reset password** أو **Delete and recreate** مع كلمة مرور قوية
4. **Update ADMIN_PASSWORD** في .env

## 📋 متغيرات البيئة المطلوبة

انسخ هذا إلى ملف `.env` في كل مشروع:

### Admin Dashboard (.env)
```bash
# Firebase (احصل عليها من Firebase Console بعد إعادة الإنشاء)
REACT_APP_FIREBASE_API_KEY=your_new_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Database (بعد تغيير كلمة المرور)
MONGODB_URI=mongodb+srv://bthwani1_db_user:NEW_STRONG_PASSWORD@cluster0.vip178l.mongodb.net/?retryWrites=true&w=majority

# Admin
ADMIN_EMAIL=admin@bthwani.com
ADMIN_PASSWORD=NEW_STRONG_ADMIN_PASSWORD
```

### Bthwani Web (.env)
```bash
# Firebase (احصل عليها من Firebase Console)
VITE_FIREBASE_API_KEY=your_new_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key_for_push
```

## ✅ قائمة التحقق بعد الإصلاح

- [ ] Firebase API keys جديدة تم إنشاؤها
- [ ] MongoDB password تم تغييرها
- [ ] Admin password تم إعادة التعيين
- [ ] جميع ملفات .env تم تحديثها
- [ ] التطبيقات تم اختبارها مع البيانات الجديدة
- [ ] .env مدرج في .gitignore (تحقق)
- [ ] لا توجد أسرار مكشوفة في الكود

## 🔐 إجراءات أمنية مستقبلية

1. **Pre-commit hooks**: تثبيت gitleaks لمنع دفع الأسرار
2. **Secrets Manager**: استخدام AWS Secrets Manager أو HashiCorp Vault
3. **Regular rotation**: تدوير الأسرار كل 90 يوم
4. **Environment separation**: بيئات مختلفة للكل (dev/staging/prod)

## 🚨 حالة الخطر

**الحالة: CRITICAL - RED** 🔴
- تم إصلاح الكود مؤقتاً لكن الأسرار الحقيقية لا تزال مكشوفة
- يجب إكمال هذه الخطوات قبل أي نشر أو استخدام

**تاريخ الاكتشاف:** $(date)
**المسؤول:** فريق الأمان + DevOps
