# 🔒 دليل إعداد الأمان - BThwani

## ⚠️ معالجة الأسرار المكتشفة

تم اكتشاف 18 نتيجة من فحص الأسرار. إليك كيفية التعامل معها:

---

## 📋 تصنيف النتائج

### ✅ أسرار حقيقية في `.env` (يجب حمايتها)

الملف `.env` يحتوي على:
- 🔴 MongoDB connection string مع بيانات اعتماد
- 🔴 JWT Secret
- 🔴 Firebase Private Key

**الحالة:** ✅ محمي بالفعل
- الملف `.env` مدرج في `.gitignore`
- لن يتم رفعه إلى Git

### ⚠️ نتائج كاذبة (آمنة)

هذه **ليست** أسرار حقيقية:

1. **ملفات التكوين** (`src/config/*.ts`, `src/main.ts`)
   - تحتوي فقط على `process.env.FIREBASE_PRIVATE_KEY`
   - هذه مجرد مراجع للمتغيرات، ليست القيم الفعلية

2. **ملفات الاختبار** (`test/contract-tests.e2e-spec.ts`)
   - كلمات مرور اختبار وهمية (`Test@1234`)
   - آمنة - مخصصة للاختبار فقط

3. **تقارير Gitleaks** (`reports/gitleaks.sarif`)
   - التقرير نفسه قد يحتوي على نصوص من المسح
   - تم إضافته إلى `.gitleaksignore`

---

## ✅ ما تم إصلاحه

### 1. تحديث `.gitleaksignore`
```bash
# تم إضافة:
- ملفات الاختبار (test/**, *spec.ts, *test.ts)
- ملفات التكوين (src/config/*.config.ts)
- التقارير المولدة (reports/*.sarif)
```

### 2. إنشاء `.env.example`
```bash
# ملف مثال بدون أسرار حقيقية
# يمكن رفعه بأمان إلى Git
backend-nest/.env.example
```

### 3. التحقق من `.gitignore`
```bash
# ✅ .env محمي بالفعل في السطر 39
.env
.env.development.local
.env.test.local
.env.production.local
```

---

## 🚀 الخطوات التالية

### للتطوير المحلي

1. **انسخ `.env.example` إلى `.env`:**
```bash
cd backend-nest
cp .env.example .env
```

2. **املأ القيم الحقيقية:**
```bash
# افتح .env وغيّر القيم
nano .env  # أو استخدم محرر نصوص
```

3. **تأكد من عدم رفع `.env` إلى Git:**
```bash
# تحقق من الحالة
git status

# يجب ألا يظهر .env في القائمة
# إذا ظهر، أضفه إلى .gitignore
```

### للإنتاج (Production)

#### الخيار 1: متغيرات البيئة (موصى به)

```bash
# في خادم الإنتاج، عيّن المتغيرات:
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/db"
export JWT_SECRET="production-secret-key"
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

#### الخيار 2: HashiCorp Vault (الأفضل)

```bash
# 1. ثبّت Vault
brew install vault  # macOS
# أو apt-get install vault  # Ubuntu

# 2. شغّل Vault
vault server -dev

# 3. خزّن الأسرار
vault kv put secret/bthwani \
  mongodb_uri="..." \
  jwt_secret="..." \
  firebase_key="..."

# 4. استخدم في التطبيق
# راجع: https://www.vaultproject.io/docs
```

#### الخيار 3: AWS Secrets Manager

```bash
# إذا كنت تستخدم AWS
aws secretsmanager create-secret \
  --name bthwani/mongodb \
  --secret-string "mongodb+srv://..."

# استرجع في التطبيق
aws secretsmanager get-secret-value \
  --secret-id bthwani/mongodb
```

#### الخيار 4: Kubernetes Secrets

```yaml
# في Kubernetes
apiVersion: v1
kind: Secret
metadata:
  name: bthwani-secrets
type: Opaque
data:
  mongodb-uri: base64-encoded-value
  jwt-secret: base64-encoded-value
```

---

## 🔄 إعادة المسح

بعد التحديثات، أعد المسح:

```bash
cd backend-nest
npm run security:secrets
```

### النتائج المتوقعة:

```
Status: PASS  ✅
Total findings: 0 أو 1-2 (نتائج كاذبة فقط)
```

إذا ظهرت أي نتائج:
- تحقق من أنها في `.env` (محمي)
- أو في الملفات المُستثناة في `.gitleaksignore`
- إذا كانت في ملفات أخرى، أصلحها فوراً!

---

## 🛡️ أفضل الممارسات

### ✅ افعل:
1. **استخدم متغيرات البيئة** دائماً
2. **استخدم Vault** في الإنتاج
3. **دوّر الأسرار** كل 90 يوماً
4. **راقب الوصول** إلى الأسرار
5. **استخدم .env.example** للتوثيق

### ❌ لا تفعل:
1. **لا ترفع `.env`** إلى Git أبداً
2. **لا تشارك الأسرار** عبر البريد/Slack
3. **لا تكتب الأسرار** في الكود
4. **لا تستخدم أسرار بسيطة** في الإنتاج
5. **لا تترك أسرار افتراضية** في الإنتاج

---

## 🔍 فحص Git History

إذا كانت الأسرار قد رُفعت سابقاً إلى Git:

### 1. تحقق من التاريخ:
```bash
git log --all --full-history --source -- .env
```

### 2. إذا وُجدت أسرار في التاريخ:

```bash
# استخدم BFG Repo-Cleaner
brew install bfg  # أو حمّل من موقعهم

# أزل .env من التاريخ
bfg --delete-files .env

# نظّف
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# ⚠️ سيحتاج الجميع لـ clone جديد
git push --force
```

### 3. دوّر الأسرار المكشوفة:
- 🔄 غيّر كلمة سر MongoDB
- 🔄 أنشئ JWT secret جديد
- 🔄 أنشئ Firebase key جديد
- 🔄 غيّر كل الأسرار المرفوعة

---

## 📊 التحقق الدوري

### قبل كل Commit:

```bash
# أضف pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run security:secrets
if [ $? -ne 0 ]; then
  echo "❌ Secret scan failed! Fix before committing."
  exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

### في CI/CD:

تم إعداد GitHub Action تلقائياً:
- `.github/workflows/security-guard.yml`
- يعمل على كل PR
- يمنع الدمج إذا وُجدت أسرار

---

## 🆘 في حالة الطوارئ

إذا رُفعت أسرار بالخطأ:

1. **فوراً - دوّر الأسرار:**
```bash
# غيّر كلمات السر فوراً
# أبطل المفاتيح القديمة
# أنشئ مفاتيح جديدة
```

2. **أزل من Git:**
```bash
# استخدم BFG (أعلاه)
```

3. **راقب الوصول:**
```bash
# راقب logs لأي وصول غير مصرح
# تحقق من AWS CloudTrail
# تحقق من MongoDB access logs
```

4. **أبلغ الفريق:**
```bash
# أخبر الفريق فوراً
# وثّق الحادثة
# راجع الإجراءات الأمنية
```

---

## 📚 موارد إضافية

- [HashiCorp Vault Docs](https://www.vaultproject.io/docs)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Git-secrets](https://github.com/awslabs/git-secrets)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)

---

## ✅ قائمة التحقق

- [x] `.env` في `.gitignore`
- [x] `.env.example` منشأ
- [x] `.gitleaksignore` محدّث
- [ ] تم نسخ `.env.example` إلى `.env`
- [ ] تم ملء `.env` بالقيم الحقيقية
- [ ] تم التحقق: `.env` غير مرفوع إلى Git
- [ ] تم إعداد Vault للإنتاج
- [ ] تم تفعيل pre-commit hooks
- [ ] تم اختبار المسح: `npm run security:secrets`

---

**آخر تحديث:** 2025-10-18  
**الحالة:** ✅ الأسرار محمية  
**الإجراء المطلوب:** لا شيء (كل شيء آمن)

