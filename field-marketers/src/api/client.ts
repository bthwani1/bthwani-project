// src/api/client.ts  (مثال)
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { ERROR_MAP } from "../utils/errorMap";

const API_BASE =
  (Constants.expoConfig?.extra as any)?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://api.bthwani.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE,
});

// optional: still keep interceptor that reads SecureStore (fallback)
api.interceptors.request.use(async (config) => {
  // إذا الهيدر موجود بالفعل، لا نقرأ SecureStore ثانياً (تسريع)
  if (!config.headers?.Authorization) {
    const token = await SecureStore.getItemAsync("mk_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor لمعالجة الأخطاء الموحّدة
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.error?.code;

    if (code && ERROR_MAP[code]) {
      // هنا اعرض Toast/Modal حسب نظام التنبيهات لديك
      console.warn(`[${code}] ${ERROR_MAP[code].message}`);

      // مثال: عرض رسالة خطأ للمستخدم
      // يمكنك استبدال هذا بنظام التنبيهات الخاص بك (مثل react-native-toast-message)
      if (typeof window !== 'undefined') {
        // في React Native: استخدم toast أو alert
        alert(`${ERROR_MAP[code].title}: ${ERROR_MAP[code].message}`);
      }
    }
    return Promise.reject(error);
  }
);

// تحسين setAuthToken ليحدّث axios.defaults فوراً
export async function setAuthToken(token: string | null) {
  if (token) {
    await SecureStore.setItemAsync("mk_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    await SecureStore.deleteItemAsync("mk_token");
    delete api.defaults.headers.common.Authorization;
  }
}
