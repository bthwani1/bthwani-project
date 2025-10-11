// src/api/favorites.ts
import { getAuthBanner } from "@/guards/bannerGateway";
import { FavoriteItem, FavoriteSnapshot, FavoriteType } from "../types/types";
import axios from "../utils/api/axiosInstance";

const API_URL = "/favorites";

export async function getAllUserFavorites(): Promise<FavoriteItem[]> {
  try {
    const { data } = await axios.get(API_URL, {
      params: { flat: 1 },
      headers: { "x-silent-401": "1" },
    });
    if (!Array.isArray(data)) return [];
    return data.map(
      (f: any): FavoriteItem => ({
        _id: String(f._id ?? ""),
        itemId: String(f.itemId ?? f.item ?? ""),
        itemType:
          String(f.itemType).toLowerCase() === "product"
            ? "product"
            : "restaurant",
        userId:
          typeof f.userId === "string"
            ? f.userId
            : f.user
            ? String(f.user)
            : undefined,
        title: f.title ?? f.itemSnapshot?.title,
        image: f.image ?? f.itemSnapshot?.image,
        price:
          typeof f.price === "number"
            ? f.price
            : typeof f.itemSnapshot?.price === "number"
            ? f.itemSnapshot.price
            : undefined,
        rating:
          typeof f.rating === "number"
            ? f.rating
            : typeof f.itemSnapshot?.rating === "number"
            ? f.itemSnapshot.rating
            : undefined,
        storeId: f.storeId
          ? String(f.storeId)
          : f.itemSnapshot?.storeId
          ? String(f.itemSnapshot.storeId)
          : undefined,
        storeType: (f.storeType ?? f.itemSnapshot?.storeType) as
          | "grocery"
          | "restaurant"
          | undefined,
        createdAt: f.createdAt
          ? new Date(f.createdAt).toISOString()
          : undefined,
      })
    );
  } catch (e: any) {
    // ضيف/401 → رجّع قائمة فاضية بدون بانر
    if (e?.response?.status === 401) return [];
    throw e;
  }
}

export async function addFavorite(
  itemId: string,
  itemType: FavoriteType,
  itemSnapshot?: FavoriteSnapshot
) {
  try {
    return await axios.post(
      API_URL,
      { itemId, itemType, itemSnapshot },
      { headers: { "x-silent-401": "1" } }
    );
  } catch (e: any) {
    if (e?.response?.status === 401) {
      getAuthBanner()?.show("login"); // 👈 أظهر بانر تسجيل الدخول
    }
    throw e;
  }
}

export async function removeFavorite(itemId: string, itemType: FavoriteType) {
  try {
    return await axios.delete(`${API_URL}/${itemType}/${itemId}`, {
      headers: { "x-silent-401": "1" },
    });
  } catch (e: any) {
    if (e?.response?.status === 401) {
      getAuthBanner()?.show("login"); // 👈 أظهر بانر تسجيل الدخول
    }
    throw e;
  }
}

export const isFavorite = async (
  itemId: string,
  itemType: FavoriteType
): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_URL}/exists/${itemType}/${itemId}`, {
      headers: { "x-silent-401": "1" },
    });
    return !!res.data?.exists;
  } catch (e: any) {
    if (e?.response?.status === 401) return false; // ضيف: لا تزعجه
    return false;
  }
};

export const getFavoritesCounts = async (
  type: FavoriteType,
  ids: string[]
): Promise<Record<string, number>> => {
  try {
    const res = await axios.get(`${API_URL}/counts`, {
      params: { type, ids: ids.join(",") },
      headers: { "x-silent-401": "1" },
    });
    return res.data as Record<string, number>;
  } catch (e: any) {
    if (e?.response?.status === 401) return {};
    throw e;
  }
};
