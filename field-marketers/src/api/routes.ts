export const ENDPOINTS = {
  AUTH_MARKETER_LOGIN: "/auth/marketer-login", // { token, user }
  ONB_LIST_MY: "/field/onboarding/my", // قائمة طلباتي
  ONB_CREATE: "/field/onboarding", // POST draft
  ONB_UPDATE: (id: string) => `/field/onboarding/${id}`,
  ONB_SUBMIT: (id: string) => `/field/onboarding/${id}/submit`,
  ONB_GET_ONE: (id: string) => `/field/onboarding/${id}`,
  FILE_SIGN: "/files/sign",
  FILE_COMPLETE: "/files/complete",
  LOOKUP_CATEGORIES: "/delivery/categories",
  QUICK_ONBOARD: "/field/quick-onboard",

  MARKETERS_SEARCH: "/marketers/search", // (اختياري) للبحث عن زميل — لو أضفته في الباك إند
  PUSH_TOKEN: "/auth/push-token",
  REPORT_ME: (uid: string) => `/reports/marketers/${uid}`, // تقرير أدائي
};
