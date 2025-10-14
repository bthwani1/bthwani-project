import axios from "axios";
import { auth } from "../config/firebaseConfig";
import { ERROR_MAP } from "./errorMap";

// قراءة متغير البيئة أو استخدام قيمة افتراضية
const getBaseURL = () => {
  // في التطوير: استخدم متغير البيئة أو localhost
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  }
  // في الإنتاج: استخدم متغير البيئة أو قيمة ثابتة آمنة
  return import.meta.env.VITE_API_URL || "https://api.bthwani.com/api/v1";
};

// Axios instance
const instance = axios.create({
  baseURL: getBaseURL(),
});

// ✅ Interceptor آمن وحديث
instance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("currentUser:", auth.currentUser);

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor لمعالجة الأخطاء الموحّدة
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const code = error?.response?.data?.error?.code;

    if (code && ERROR_MAP[code]) {
      // هنا اعرض Toast/Modal حسب نظام التنبيهات لديك
      console.warn(`[${code}] ${ERROR_MAP[code].message}`);

      // مثال: عرض رسالة خطأ للمستخدم
      // يمكنك استبدال هذا بنظام التنبيهات الخاص بك
      if (typeof window !== 'undefined') {
        // في React: استخدم toast أو modal
        // toast.error(ERROR_MAP[code].message, { title: ERROR_MAP[code].title });
        alert(`${ERROR_MAP[code].title}: ${ERROR_MAP[code].message}`);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
