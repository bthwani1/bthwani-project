// src/utils/api/axiosInstance.ts
import { refreshIdToken } from "@/api/authService";
import { shouldSilenceAuthPrompts } from "@/guards/authGate";
import { getAuthBanner } from "@/guards/bannerGateway";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// ===================== Request Interceptor =====================
axiosInstance.interceptors.request.use(
  async (config) => {
    // مسارات يجب أن تمر دائمًا بتوثيق (حتى لو كانت ضمن general list)
    const SECURE_ALWAYS = ["/delivery/stores/search"];

    // مسارات عامة لا تحتاج توكن (قراءة فقط)
    const publicEndpoints = [
      "/market/sliders",
      "/market/categories",
      "/market/products",
      "/market/offers",
      "/delivery/categories",
      "/delivery/banners",
      "/delivery/stores",
      "/delivery/promotions",
      "/delivery/products/daily-offers",
      "/delivery/products/nearby/new",
      "/utility/options",
      // CMS
      "/cms/bootstrap",
      "/cms/pages",
    ];

    const url = config.url || "";
    const mustAuth = SECURE_ALWAYS.some((p) => url.startsWith(p));
    const isPublic =
      !mustAuth && publicEndpoints.some((p) => url.startsWith(p));

    if (!isPublic) {
      const token = await refreshIdToken(); // قد ترجع null
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===================== Response Interceptor =====================
let prompting401 = false;
let prompting403 = false;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const cfg = error?.config ?? {};

    // ✅ كتم عالمي / لكل طلب
    const globallySilenced = shouldSilenceAuthPrompts();
    const silentHeader = (cfg.headers as any)?.["x-silent-401"] === "1";
    const silentFlag = (cfg as any).__silent401 === true;

    if (
      (status === 401 || status === 403) &&
      (globallySilenced || silentHeader || silentFlag)
    ) {
      return Promise.reject(error);
    }

    // ✅ معالجة 401 - تجديد التوكن تلقائياً
    if (status === 401 && !cfg._retry && !isRefreshing) {
      if (isRefreshing) {
        // إذا كان التجديد جارٍ، أضف الطلب للطابور
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          cfg.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(cfg);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      cfg._retry = true;
      isRefreshing = true;

      try {
        const { refreshIdToken } = await import("@/api/authService");
        const newToken = await refreshIdToken();

        if (newToken) {
          // تحديث الهيدر العام
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

          // معالجة الطابور
          processQueue(null, newToken);

          // إعادة المحاولة للطلب الأصلي
          cfg.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(cfg);
        } else {
          // فشل التجديد - توجيه لتسجيل الدخول
          processQueue(error, null);

          // حفظ حالة الشاشة الحالية قبل الانتقال
          await saveCurrentScreenState();

          const banner = getAuthBanner();
          if (banner) {
            banner.show("login");
          } else {
            const { safeNavigate } = await import("@/navigation/RootNavigation");
            safeNavigate("Login");
          }

          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // حفظ حالة الشاشة الحالية قبل الانتقال
        await saveCurrentScreenState();

        const banner = getAuthBanner();
        if (banner) {
          banner.show("login");
        } else {
          const { safeNavigate } = await import("@/navigation/RootNavigation");
          safeNavigate("Login");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ✅ 403 — غير موثّق أو صلاحيات غير كافية
    if (status === 403 && !prompting403) {
      prompting403 = true;
      try {
        // حفظ حالة الشاشة الحالية
        await saveCurrentScreenState();

        const banner = getAuthBanner();
        if (banner) {
          banner.show("forbidden");
        } else {
          // عرض رسالة خطأ محلية أو انتقل لصفحة ممنوع
          console.warn('Access forbidden:', code || 'Unknown error');
        }
      } finally {
        prompting403 = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to save current screen state
async function saveCurrentScreenState() {
  try {
    const currentRoute = await import("@/navigation/RootNavigation").then(m => m.getCurrentRoute());
    if (currentRoute) {
      await AsyncStorage.setItem("lastScreenState", JSON.stringify({
        route: currentRoute,
        timestamp: Date.now(),
      }));
    }
  } catch (error) {
    console.warn('Failed to save screen state:', error);
  }
}

export default axiosInstance;
