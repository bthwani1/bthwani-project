# 📚 Admin Endpoints Documentation

## 🎯 نظرة عامة سريعة

هذا المجلد يحتوي على **توثيق شامل ومحدث تلقائياً** لجميع Admin Endpoints في المشروع.

## 📁 الملفات

| الملف | الوصف | الاستخدام |
|------|--------|----------|
| `admin-endpoints.json` | ملف JSON شامل | للمعالجة الآلية والتكامل مع الأدوات |
| `admin-endpoints.md` | توثيق Markdown | للقراءة البشرية والمراجعة |
| `admin-endpoints.ts` | TypeScript types | للاستخدام في الفرونت إند مع type safety |
| `ADMIN_ENDPOINTS_GUIDE.md` | دليل شامل | شرح مفصل وأمثلة |
| `examples/dashboard-integration.tsx` | مثال عملي | كود جاهز للنسخ واللصق |

## ⚡ البدء السريع

### 1. تحديث التوثيق

```bash
cd backend-nest
npm run docs:endpoints
```

أو:

```bash
node scripts/extract-admin-endpoints.js
```

### 2. استخدام في Dashboard

```typescript
// 1. Import
import { 
  ADMIN_ENDPOINTS_BY_MODULE, 
  ALL_ADMIN_ENDPOINTS 
} from '@/docs/admin-endpoints';

// 2. عرض في Sidebar
function Sidebar() {
  return (
    <nav>
      {Object.values(ADMIN_ENDPOINTS_BY_MODULE).map(module => (
        <div key={module.name}>
          <h3>{module.displayName}</h3>
          <span>{module.icon}</span>
        </div>
      ))}
    </nav>
  );
}

// 3. استدعاء API
const endpoint = ALL_ADMIN_ENDPOINTS.find(ep => ep.id === 'admin-drivers-all');
const url = buildEndpointUrl(endpoint);
const response = await fetch(url);
```

## 📊 الإحصائيات الحالية

- ✅ **110** Admin Endpoints
- ✅ **12** Modules
- ✅ **56** GET endpoints
- ✅ **31** POST endpoints
- ✅ **18** PATCH endpoints
- ✅ **5** DELETE endpoints

## 🔄 متى يجب التحديث؟

قم بتشغيل `npm run docs:endpoints` بعد:
- ✅ إضافة endpoint جديد
- ✅ تعديل route أو summary
- ✅ تغيير الصلاحيات (roles)
- ✅ قبل نشر نسخة جديدة

## 📖 الملفات بالتفصيل

### `admin-endpoints.json`
```json
{
  "totalEndpoints": 110,
  "modules": 12,
  "endpointsByModule": { ... },
  "allEndpoints": [ ... ],
  "summary": { ... }
}
```

**استخدامات:**
- قراءة من Backend
- تكامل مع Swagger/Postman
- تحليل وإحصائيات

### `admin-endpoints.md`
توثيق كامل بصيغة Markdown يتضمن:
- جداول الإحصائيات
- تفاصيل كل endpoint
- تنظيم حسب Module
- جدول شامل

**استخدامات:**
- المراجعة والتوثيق
- عرض في GitHub
- الطباعة

### `admin-endpoints.ts`
ملف TypeScript type-safe مع:
- Interface definitions
- Helper functions
- Permission guards
- URL builders

**استخدامات:**
- React/Next.js Dashboard
- Type safety
- Autocomplete في IDE

## 🎨 أمثلة سريعة

### عرض Sidebar
```typescript
import { ADMIN_ENDPOINTS_BY_MODULE } from '@/docs/admin-endpoints';

function Sidebar() {
  return (
    <aside>
      {Object.values(ADMIN_ENDPOINTS_BY_MODULE).map(module => (
        <ModuleSection key={module.name} module={module} />
      ))}
    </aside>
  );
}
```

### Permissions Guard
```typescript
import { hasPermission } from '@/docs/admin-endpoints';

function ProtectedPage({ endpoint }) {
  const userRoles = ['admin'];
  
  if (!hasPermission(userRoles, endpoint)) {
    return <AccessDenied />;
  }
  
  return <Page />;
}
```

### API Call
```typescript
import { buildEndpointUrl, getEndpointById } from '@/docs/admin-endpoints';

async function fetchDrivers() {
  const endpoint = getEndpointById('admin-drivers-all');
  const url = buildEndpointUrl(endpoint);
  
  const response = await fetch(url, {
    method: endpoint.method,
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return response.json();
}
```

## 🔗 روابط مفيدة

- [📖 الدليل الكامل](./ADMIN_ENDPOINTS_GUIDE.md)
- [💻 مثال Dashboard كامل](./examples/dashboard-integration.tsx)
- [📝 Endpoints List (MD)](./admin-endpoints.md)
- [📄 Endpoints Data (JSON)](./admin-endpoints.json)

## 🛠️ السكريبت

الملف: `scripts/extract-admin-endpoints.js`

**ماذا يفعل:**
1. يقرأ جميع `*.controller.ts` files
2. يبحث عن `@Roles('admin')` decorators
3. يستخرج Method, Path, Summary, Handler
4. يجمعها حسب Module
5. يولد JSON و Markdown و TypeScript

**التشغيل:**
```bash
npm run docs:endpoints
```

## 🤝 المساهمة

إذا أضفت endpoint جديد:
1. تأكد من استخدام `@Roles('admin', 'superadmin')`
2. أضف `@ApiOperation({ summary: '...' })`
3. شغّل `npm run docs:endpoints`
4. راجع التغييرات في `git diff`
5. Commit الملفات المحدثة

## 📞 الدعم

- 📧 راسل فريق Backend
- 🐛 افتح Issue في GitHub
- 📖 راجع [الدليل الشامل](./ADMIN_ENDPOINTS_GUIDE.md)

---

**آخر تحديث:** 15 أكتوبر 2025  
**الإصدار:** 1.0.0

