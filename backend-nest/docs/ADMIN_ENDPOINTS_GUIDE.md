# 📚 دليل استخدام Admin Endpoints

## 📋 نظرة عامة

هذا المجلد يحتوي على ملفات توثيق شاملة لجميع Admin Endpoints في المشروع، تم استخراجها تلقائياً من جميع الـ controllers.

## 📁 الملفات المتاحة

### 1. `admin-endpoints.json`
ملف JSON يحتوي على جميع الـ endpoints بصيغة structured data.

**الاستخدام:**
- للقراءة من الـ Backend
- للمعالجة الآلية
- للتكامل مع الأدوات الخارجية

**مثال:**
```json
{
  "generatedAt": "2025-10-15T16:18:22.628Z",
  "totalEndpoints": 110,
  "modules": 12,
  "endpointsByModule": {
    "admin": [...],
    "analytics": [...]
  }
}
```

### 2. `admin-endpoints.md`
ملف Markdown للقراءة البشرية والتوثيق.

**الاستخدام:**
- للمراجعة والتوثيق
- لعرض في GitHub
- للطباعة والمشاركة

**المحتويات:**
- ✅ إحصائيات شاملة
- ✅ جدول بجميع الـ modules
- ✅ تفاصيل كل endpoint
- ✅ جدول موحد لكل الـ endpoints

### 3. `admin-endpoints.ts`
ملف TypeScript type-safe للاستخدام في الـ Frontend.

**الاستخدام:**
- في React/Next.js Dashboard
- Type safety كامل
- Helper functions جاهزة

## 🔄 تحديث الملفات

لتحديث الملفات بعد إضافة endpoints جديدة:

```bash
cd backend-nest
node scripts/extract-admin-endpoints.js
```

**متى تحتاج للتحديث:**
- ✅ بعد إضافة endpoint جديد
- ✅ بعد تعديل route أو summary
- ✅ بعد تغيير الصلاحيات (roles)
- ✅ قبل نشر نسخة جديدة

## 💻 استخدام في الـ Dashboard

### React/Next.js مثال

```typescript
import {
  ADMIN_ENDPOINTS_BY_MODULE,
  ALL_ADMIN_ENDPOINTS,
  getEndpointsByCategory,
  buildEndpointUrl,
  hasPermission,
} from '@/docs/admin-endpoints';

// 1. عرض جميع الـ modules
function AdminSidebar() {
  return (
    <nav>
      {ALL_MODULES.map((module) => (
        <div key={module.name}>
          <h3>{module.displayName}</h3>
          <span>{module.icon}</span>
          <span>{module.endpoints.length} endpoints</span>
        </div>
      ))}
    </nav>
  );
}

// 2. عرض endpoints حسب الصلاحيات
function AdminMenu({ userRoles }: { userRoles: string[] }) {
  const allowedEndpoints = ALL_ADMIN_ENDPOINTS.filter((ep) =>
    hasPermission(userRoles, ep)
  );

  return (
    <ul>
      {allowedEndpoints.map((endpoint) => (
        <li key={endpoint.id}>
          <Link href={endpoint.fullPath}>
            {endpoint.summary}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// 3. استدعاء API endpoint
async function fetchDriverDetails(driverId: string) {
  const endpoint = getEndpointById('admin-driver-details');
  const url = buildEndpointUrl(endpoint, { id: driverId });
  
  const response = await fetch(url, {
    method: endpoint.method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.json();
}

// 4. عرض Dashboard بالـ categories
function AdminDashboard() {
  return (
    <div>
      {ENDPOINT_CATEGORIES.map((category) => {
        const endpoints = getEndpointsByCategory(category.id);
        return (
          <section key={category.id}>
            <h2>{category.label}</h2>
            <span>{category.icon}</span>
            <ul>
              {endpoints.map((ep) => (
                <EndpointCard key={ep.id} endpoint={ep} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
```

### Vue.js مثال

```vue
<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <nav>
        <div v-for="module in modules" :key="module.name">
          <h3>{{ module.displayName }}</h3>
          <ul>
            <li v-for="ep in module.endpoints" :key="ep.id">
              <router-link :to="ep.fullPath">
                {{ ep.summary }}
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ALL_MODULES, hasPermission } from '@/docs/admin-endpoints';

const userRoles = ['admin'];

const modules = computed(() => {
  return ALL_MODULES.map(module => ({
    ...module,
    endpoints: module.endpoints.filter(ep => 
      hasPermission(userRoles, ep)
    ),
  }));
});
</script>
```

## 🎨 أمثلة UI Components

### 1. Sidebar Navigation

```typescript
// components/AdminSidebar.tsx
import { ADMIN_ENDPOINTS_BY_MODULE } from '@/docs/admin-endpoints';

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg">
      {Object.values(ADMIN_ENDPOINTS_BY_MODULE).map((module) => (
        <div key={module.name} className="mb-4">
          <div className="flex items-center gap-2 p-4 bg-gray-50">
            <span className="material-icons" style={{ color: module.color }}>
              {module.icon}
            </span>
            <h3 className="font-bold">{module.displayName}</h3>
          </div>
          <ul className="p-2">
            {module.endpoints.map((ep) => (
              <li key={ep.id} className="p-2 hover:bg-gray-100 rounded">
                <Link href={ep.fullPath}>
                  <span className={`text-xs ${getMethodColor(ep.method)}`}>
                    {ep.method}
                  </span>
                  <span className="ml-2">{ep.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
```

### 2. Endpoint Card

```typescript
// components/EndpointCard.tsx
import type { AdminEndpoint } from '@/docs/admin-endpoints';

interface Props {
  endpoint: AdminEndpoint;
}

export function EndpointCard({ endpoint }: Props) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="material-icons text-gray-500">
            {endpoint.icon}
          </span>
          <h4 className="font-semibold">{endpoint.summary}</h4>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${getMethodColor(endpoint.method)}`}>
          {endpoint.method}
        </span>
      </div>
      
      <code className="block mt-2 text-sm text-gray-600">
        {endpoint.fullPath}
      </code>
      
      <div className="flex gap-2 mt-2">
        {endpoint.roles.map((role) => (
          <span key={role} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}
```

### 3. Permissions Guard

```typescript
// hooks/usePermissions.ts
import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { filterEndpointsByPermissions, type AdminEndpoint } from '@/docs/admin-endpoints';

export function usePermissions() {
  const { user } = useAuth();
  
  const allowedEndpoints = useMemo(() => {
    if (!user) return [];
    return filterEndpointsByPermissions(user.roles);
  }, [user]);
  
  const canAccess = (endpoint: AdminEndpoint) => {
    return allowedEndpoints.some(ep => ep.id === endpoint.id);
  };
  
  return {
    allowedEndpoints,
    canAccess,
  };
}

// استخدام
function ProtectedComponent() {
  const { canAccess } = usePermissions();
  const endpoint = getEndpointById('admin-drivers-all');
  
  if (!canAccess(endpoint)) {
    return <AccessDenied />;
  }
  
  return <DriversPage />;
}
```

## 📊 الإحصائيات

**الملفات الحالية تحتوي على:**
- ✅ 110 Admin Endpoints
- ✅ 12 Modules
- ✅ 56 GET endpoints
- ✅ 31 POST endpoints  
- ✅ 18 PATCH endpoints
- ✅ 5 DELETE endpoints

## 🔧 Automation

### GitHub Actions مثال

```yaml
# .github/workflows/update-endpoints.yml
name: Update Admin Endpoints

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend-nest/src/modules/**/*.controller.ts'

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Extract Endpoints
        run: |
          cd backend-nest
          node scripts/extract-admin-endpoints.js
      
      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/
          git commit -m "📝 Update admin endpoints documentation" || echo "No changes"
          git push
```

## 🎯 Best Practices

### 1. التحديث المنتظم
```bash
# أضف هذا في package.json scripts
"scripts": {
  "docs:endpoints": "node scripts/extract-admin-endpoints.js",
  "prebuild": "npm run docs:endpoints"
}
```

### 2. Version Control
- ✅ احفظ الملفات في Git
- ✅ راجع التغييرات في Pull Requests
- ✅ احذر من merge conflicts

### 3. Type Safety
```typescript
// استخدم types دائماً
import type { AdminEndpoint } from '@/docs/admin-endpoints';

function processEndpoint(ep: AdminEndpoint) {
  // TypeScript سيعطيك autocomplete
  console.log(ep.method, ep.path, ep.summary);
}
```

## 🐛 Troubleshooting

### المشكلة: الملفات غير محدثة
**الحل:** 
```bash
cd backend-nest
node scripts/extract-admin-endpoints.js
```

### المشكلة: بعض الـ endpoints مفقودة
**السبب المحتمل:**
- الـ decorator `@Roles('admin')` غير موجود
- الملف ليس `.controller.ts`
- صيغة الـ decorator غير صحيحة

**الحل:**
تأكد من استخدام:
```typescript
@Roles('admin', 'superadmin')
```

### المشكلة: Handler names غير صحيحة
**السبب:** الـ regex في السكريبت قد يحتاج تحديث

**الحل:**
راجع ملف `extract-admin-endpoints.js` وعدل الـ regex

## 📞 الدعم

إذا واجهت أي مشكلة أو لديك اقتراح:
1. افتح Issue في GitHub
2. راسل فريق الـ Backend
3. راجع الـ Documentation

---

**آخر تحديث:** 15 أكتوبر 2025
**الإصدار:** 1.0.0

