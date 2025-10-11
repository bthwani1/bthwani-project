// src/api/profile.ts
import axios from "./axios";

export const getProfile = async () => {
  const res = await axios.get("/driver/me");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await axios.patch("/driver/me", data);
  return res.data;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  await axios.post("/driver/change-password", { oldPassword, newPassword });
};
