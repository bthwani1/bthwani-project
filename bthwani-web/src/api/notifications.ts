import axiosInstance from "./axios-instance";
import { getAuthHeader } from "./auth";
import type { Notification, NotificationSettings } from "../types";
import axios from "./axios-instance";

// Get user notifications
export const getUserNotifications = async (
  limit = 50,
  offset = 0
): Promise<Notification[]> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.get<Notification[]>("/notifications", {
    params: { limit, offset },
    headers,
  });
  return response.data;
};
export async function registerPushToken(payload: {
  token: string;
  platform: "web";
  userId: string;
}) {
  // Adjust the endpoint to your backend's actual route if different
  return axios.post("/notifications/register", payload);
}

// Get unread notifications count
export const getUnreadNotificationsCount = async (): Promise<number> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.get<{ count: number }>(
    "/notifications/unread/count",
    { headers }
  );
  return response.data.count;
};

// Mark notification as read
export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  const headers = await getAuthHeader();
  await axiosInstance.patch(
    `/notifications/${notificationId}/read`,
    {},
    { headers }
  );
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  const headers = await getAuthHeader();
  await axiosInstance.patch("/notifications/read-all", {}, { headers });
};

// Delete notification
export const deleteNotification = async (
  notificationId: string
): Promise<void> => {
  const headers = await getAuthHeader();
  await axiosInstance.delete(`/notifications/${notificationId}`, { headers });
};

// Get notification settings
export const getNotificationSettings =
  async (): Promise<NotificationSettings> => {
    const headers = await getAuthHeader();
    const response = await axiosInstance.get<NotificationSettings>(
      "/notifications/settings",
      { headers }
    );
    return response.data;
  };

// Update notification settings
export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.patch<NotificationSettings>(
    "/notifications/settings",
    settings,
    { headers }
  );
  return response.data;
};

// Send test notification (for development)
export const sendTestNotification = async (
  type: Notification["type"],
  title: string,
  message: string
): Promise<Notification> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.post<Notification>(
    "/notifications/test",
    {
      type,
      title,
      message,
    },
    { headers }
  );
  return response.data;
};

export default {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  sendTestNotification,
};
