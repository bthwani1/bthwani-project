import axiosInstance from "./axios-instance";
import { getAuthHeader } from "./auth";
import type { User, Address } from "../types";

// Get user profile
export const fetchUserProfile = async (): Promise<User> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.get<User>("/users/me", { headers });

  const user = response.data;
  return {
    ...user,
    id: user.id || user._id || "",
  };
};

// Update user profile
export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.patch<User>("/users/profile", data, {
    headers,
  });
  return response.data;
};

// Update user avatar
export const updateUserAvatar = async (imageUrl: string): Promise<User> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.patch<User>(
    "/users/avatar",
    { image: imageUrl },
    { headers }
  );
  return response.data;
};

// Add user address
export const addUserAddress = async (
  address: Omit<Address, "_id">
): Promise<Address> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.post<Address>(
    "/users/address",
    address,
    { headers }
  );
  return response.data;
};

// Update user address
export const updateUserAddress = async (payload: Address): Promise<Address> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.patch<Address>(
    `/users/address/${payload._id}`,
    payload,
    { headers }
  );
  return response.data;
};

// Delete user address
export const deleteUserAddress = async (addressId: string): Promise<void> => {
  const headers = await getAuthHeader();
  await axiosInstance.delete(`/users/address/${addressId}`, { headers });
};

// Set default address
export const setDefaultUserAddress = async (
  address: Address
): Promise<Address> => {
  const headers = await getAuthHeader();
  const response = await axiosInstance.patch<Address>(
    "/users/default-address",
    address,
    { headers }
  );
  return response.data;
};

export default {
  fetchUserProfile,
  updateUserProfile,
  updateUserAvatar,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
};
