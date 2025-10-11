// utils/axios.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ERROR_MAP } from "../utils/errorMap";

const instance = axios.create({
  baseURL: "https://api.bthwani.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    // اقرأ التوكن من SecureStore
    const token = await SecureStore.getItemAsync("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor لمعالجة الأخطاء الموحّدة
instance.interceptors.response.use(
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

export default instance;
