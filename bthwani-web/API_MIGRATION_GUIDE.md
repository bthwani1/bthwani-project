# دليل ترحيل API للباك إند الجديد

## نظرة عامة

تم تحديث جميع API calls لتتوافق مع البنية الجديدة للباك إند والتي تستخدم شكل استجابة موحد.

## البنية الجديدة

### شكل الاستجابة
```typescript
{
  success: boolean;          // حالة النجاح/الفشل
  message?: string;          // رسالة اختيارية
  data?: T;                  // البيانات المطلوبة
  error?: {                  // تفاصيل الخطأ (في حالة الفشل)
    code: string;
    message: string;
    userMessage?: string;    // رسالة بالعربي
    suggestedAction?: string; // اقتراح للحل
    details?: any;
  };
  meta?: {                   // معلومات إضافية
    timestamp: string;
    path: string;
    version: string;
  };
  pagination?: {             // معلومات الصفحات
    total?: number;
    page?: number;
    limit?: number;
    nextCursor?: string;
    hasMore?: boolean;
  };
}
```

## التحديثات المطلوبة

### 1. تحديث Types

تم إضافة:
- `src/types/api.ts` - التعريفات الأساسية
- `src/utils/api-helpers.ts` - دوال مساعدة

### 2. تحديث axios-instance.ts

تم إضافة:
- استيراد types الجديدة
- معالجة أخطاء محسنة في response interceptor
- طباعة تفاصيل الخطأ في وضع التطوير

### 3. كيفية تحديث ملفات API

#### قبل:
```typescript
export const fetchUserProfile = async (): Promise<User> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.get<User>("/users/me", { headers });
  return response.data;
};
```

#### بعد (الطريقة الأولى - مباشرة):
```typescript
import type { ApiResponse } from "../types/api";

export const fetchUserProfile = async (): Promise<User> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.get<ApiResponse<User>>("/users/me", { headers });
  
  const apiResponse = response.data;
  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.error?.userMessage || "فشل تحميل البروفايل");
  }
  
  return apiResponse.data;
};
```

#### بعد (الطريقة الثانية - باستخدام helpers):
```typescript
import { extractApiData } from "../utils/api-helpers";
import type { ApiResponse } from "../types/api";

export const fetchUserProfile = async (): Promise<User> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.get<ApiResponse<User>>("/users/me", { headers });
  return extractApiData(response, "فشل تحميل البروفايل");
};
```

#### بعد (الطريقة الثالثة - wrapper):
```typescript
import { apiGet } from "../utils/api-helpers";
import type { ApiResponse } from "../types/api";

export const fetchUserProfile = async (): Promise<User> => {
  const headers = await getAuthHeader();
  return apiGet(
    () => axiosInstance.get<ApiResponse<User>>("/users/me", { headers }),
    "فشل تحميل البروفايل"
  );
};
```

### 4. أنواع الطلبات المختلفة

#### GET - بيانات واحدة
```typescript
import { apiGet } from "../utils/api-helpers";

export const getItem = async (id: string): Promise<Item> => {
  return apiGet(
    () => axiosInstance.get<ApiResponse<Item>>(`/items/${id}`),
    "فشل تحميل العنصر"
  );
};
```

#### GET - مصفوفة
```typescript
import { apiGetArray } from "../utils/api-helpers";

export const getItems = async (): Promise<Item[]> => {
  return apiGetArray(
    () => axiosInstance.get<ApiResponse<Item[]>>("/items"),
    "فشل تحميل العناصر"
  );
};
```

#### POST/PATCH - إنشاء أو تحديث
```typescript
import { apiMutate } from "../utils/api-helpers";

export const createItem = async (data: ItemData): Promise<Item> => {
  return apiMutate(
    () => axiosInstance.post<ApiResponse<Item>>("/items", data),
    "فشل إنشاء العنصر"
  );
};
```

#### DELETE
```typescript
import { apiDelete } from "../utils/api-helpers";

export const deleteItem = async (id: string): Promise<void> => {
  return apiDelete(
    () => axiosInstance.delete<ApiResponse<void>>(`/items/${id}`),
    "فشل حذف العنصر"
  );
};
```

#### GET مع Pagination
```typescript
import { extractApiData, extractPagination } from "../utils/api-helpers";

export const getItemsPaginated = async (page = 1, limit = 20) => {
  const response = await axiosInstance.get<ApiResponse<Item[]>>("/items", {
    params: { page, limit }
  });
  
  return {
    data: extractApiData(response, "فشل تحميل العناصر"),
    pagination: extractPagination(response),
  };
};
```

## معالجة الأخطاء

### في Components
```typescript
try {
  const user = await fetchUserProfile();
  // استخدام البيانات
} catch (error: any) {
  // الخطأ يحتوي على userMessage بالفعل
  console.error(error.message); // سيطبع "فشل تحميل البروفايل" أو الرسالة من الباك إند
  // عرض رسالة للمستخدم
  toast.error(error.message);
}
```

### استخراج تفاصيل إضافية
```typescript
import { extractErrorMessage, extractSuggestedAction } from "../types/api";

try {
  await someApiCall();
} catch (error: any) {
  const message = extractErrorMessage(error);
  const action = extractSuggestedAction(error);
  
  toast.error(message);
  if (action) {
    toast.info(action);
  }
}
```

## أكواد الأخطاء الشائعة

- `UNAUTHORIZED` - يجب تسجيل الدخول
- `FORBIDDEN` - لا توجد صلاحيات
- `NOT_FOUND` - البيانات غير موجودة
- `VALIDATION_ERROR` - خطأ في التحقق من البيانات
- `CONFLICT` - تعارض في البيانات
- `TOO_MANY_REQUESTS` - طلبات كثيرة جداً

## الخطوات التالية

1. ✅ تحديث `user.ts` - تم
2. ⏳ تحديث باقي ملفات API في `src/api/`
3. ⏳ اختبار جميع الطلبات
4. ⏳ تطبيق نفس التحديثات على التطبيقات الأخرى:
   - admin-dashboard
   - bThwaniApp (Mobile)
   - vendor-app
   - rider-app
   - field-marketers

## ملاحظات مهمة

1. **الباك إند يعيد البيانات دائماً بنفس الشكل** - سواء نجح أو فشل الطلب
2. **تحقق من `success` أولاً** - قبل الوصول لـ `data`
3. **استخدم `userMessage`** - للرسائل الموجهة للمستخدم
4. **`suggestedAction`** - يحتوي على اقتراح للحل
5. **Pagination** - متوفر في `pagination` object

## أمثلة كاملة

### مثال 1: تحميل قائمة مع معالجة الأخطاء
```typescript
import { apiGetArray } from "../utils/api-helpers";
import type { ApiResponse } from "../types/api";

export const fetchStores = async (): Promise<Store[]> => {
  try {
    return await apiGetArray(
      () => axiosInstance.get<ApiResponse<Store[]>>("/stores"),
      "فشل تحميل المتاجر"
    );
  } catch (error: any) {
    console.error("Error fetching stores:", error.message);
    // يمكن إرجاع مصفوفة فارغة أو رمي الخطأ
    throw error;
  }
};
```

### مثال 2: إنشاء عنصر مع validation
```typescript
import { apiMutate } from "../utils/api-helpers";
import type { ApiResponse } from "../types/api";

export const createOrder = async (orderData: OrderData): Promise<Order> => {
  return apiMutate(
    () => axiosInstance.post<ApiResponse<Order>>("/orders", orderData),
    "فشل إنشاء الطلب"
  );
};

// في الكومبوننت
try {
  const order = await createOrder(data);
  toast.success("تم إنشاء الطلب بنجاح");
  navigate(`/orders/${order.id}`);
} catch (error: any) {
  // الخطأ سيحتوي على رسالة واضحة من الباك إند
  toast.error(error.message);
}
```

### مثال 3: تحديث مع معالجة خطأ CONFLICT
```typescript
import { apiMutate } from "../utils/api-helpers";
import { ErrorCode } from "../types/api";
import type { ApiResponse } from "../types/api";

export const updateProduct = async (id: string, data: ProductData): Promise<Product> => {
  return apiMutate(
    () => axiosInstance.patch<ApiResponse<Product>>(`/products/${id}`, data),
    "فشل تحديث المنتج"
  );
};

// في الكومبوننت
try {
  await updateProduct(productId, formData);
} catch (error: any) {
  const errorCode = error?.response?.data?.error?.code;
  
  if (errorCode === ErrorCode.CONFLICT) {
    toast.error("المنتج تم تحديثه من قبل مستخدم آخر");
    // إعادة تحميل البيانات
    refetch();
  } else {
    toast.error(error.message);
  }
}
```


