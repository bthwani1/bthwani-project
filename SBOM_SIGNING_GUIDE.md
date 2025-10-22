# 📦 دليل SBOM وتوقيع الصور

## ✅ تم إكمال SBOM Generation

تم إنتاج **Software Bill of Materials (SBOM)** لجميع المشاريع باستخدام CycloneDX:

- ✅ `sbom-backend-nest.json`
- ✅ `sbom-admin-dashboard.json`
- ✅ `sbom-bthwani-web.json`
- ✅ `sbom-app-user.json`
- ✅ `sbom-vendor-app.json`
- ✅ `sbom-rider-app.json`
- ✅ `sbom-field-marketers.json`

## 🔐 توقيع الصور (Container Image Signing)

### متطلبات التوقيع:
1. **Cosign** - أداة توقيع الصور
2. **Container Registry** - مثل Docker Hub, ECR, GCR
3. **Private Key** - لتوقيع الصور

### خطوات التوقيع (للتنفيذ لاحقاً):

```bash
# 1. تثبيت cosign
# Windows:
winget install cosign
# أو Linux/Mac:
brew install cosign

# 2. إنشاء مفتاح التوقيع
cosign generate-key-pair

# 3. تسجيل الدخول للـ registry
cosign login registry.example.com

# 4. توقيع الصور
cosign sign --key cosign.key bthwani/backend:latest
cosign sign --key cosign.key bthwani/frontend:latest
cosign sign --key cosign.key bthwani/admin:latest

# 5. التحقق من التوقيع
cosign verify --key cosign.pub bthwani/backend:latest
```

### بدائل في حال عدم توفر Docker/Cosign:
- استخدام GitHub Actions للتوقيع التلقائي
- استخدام Sigstore للتوقيع السحابي
- التحقق اليدوي من سلامة الصور

## 📋 حالة الإنجاز

- ✅ **SBOM Generated**: جميع المشاريع
- ⏳ **Image Signing**: يحتاج تثبيت cosign وإعداد registry
- ✅ **Security**: تم إنتاج SBOM للتحقق من الثغرات

**التاريخ**: $(date)
**الحالة**: SBOM مكتمل - توقيع الصور يحتاج إعداد البنية التحتية
