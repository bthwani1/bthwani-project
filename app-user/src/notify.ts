// app/notify.ts
import axiosInstance from "@/utils/api/axiosInstance";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

async function setupAndroidChannels() {
  await Notifications.setNotificationChannelAsync("orders", {
    name: "تحديثات الطلب",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
  });
  await Notifications.setNotificationChannelAsync("promos", {
    name: "العروض",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
  });
}

export async function registerPushToken(app: "user" | "driver" | "vendor") {
  if (!Device.isDevice) return null;

  // إذن Android 13+ و iOS
  const p = await Notifications.getPermissionsAsync();
  let status = p.status;
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== "granted") return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    (Constants as any).easConfig?.projectId;

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  await setupAndroidChannels();

  const endpoint =
    app === "user"
      ? "/users/push-token"
      : app === "driver"
      ? "/drivers/push-token"
      : "/vendors/push-token";

  try {
    await axiosInstance.post(endpoint, {
      token,
      platform: Device.osName?.toLowerCase().includes("android")
        ? "android"
        : "ios",
      app,
      device: `${Device.manufacturer || ""} ${Device.modelName || ""}`.trim(),
      locale: "ar",
      timezone: "Asia/Aden",
    });
  } catch (error: any) {
    // Handle 401 errors more gracefully - user might not be authenticated yet
    if (error?.response?.status === 401) {
      console.warn(
        `Push token registration failed for ${app}: User not authenticated (401)`
      );
      throw new Error("User not authenticated");
    }
    // Re-throw other errors
    throw error;
  }

  return token;
}

// عرض الإشعارات داخل التطبيق (SDK حديث يطلب هذين الحقلين على iOS)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// إضافة مستمعي الإشعارات
export function attachNotificationListeners(
  navigate: (screen: string, params?: any) => void,
  onNotificationReceived?: () => void
) {
  const responseSub = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data as any;
      if (data?.orderId) navigate("OrderDetails", { orderId: data.orderId });
    }
  );

  const receiveSub = Notifications.addNotificationReceivedListener((notif) => {
    // حدّث UI عند استلام إشعار طلب
    const data = notif.request.content.data as any;
    if (data?.type && data.type.startsWith('order.')) {
      onNotificationReceived?.();
    }
  });

  return { responseSub, receiveSub };
}

// نُنصح بإلغاء تسجيل التوكن عند تسجيل الخروج:
export async function unregisterPushToken(
  app: "user" | "driver" | "vendor",
  token: string
) {
  const endpoint =
    app === "user"
      ? "/users/push-token"
      : app === "driver"
      ? "/drivers/push-token"
      : "/vendors/push-token";
  try {
    await axiosInstance.delete(endpoint, { data: { token } });
  } catch {}
}
