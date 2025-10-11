import COLORS from "@/constants/colors";
import { useWebResponsive } from "@/hooks/useWebResponsive";
import axiosInstance from "@/utils/api/axiosInstance";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CategoriesChips from "@/components/CategoriesChips";
import FiltersBar, { FilterKey } from "@/components/FiltersBar";

// Enhanced color palette for web compatibility
const WEB_COLORS = {
  primary: "#FF500D",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  text: "#1A3052",
  textLight: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  input: "#F8FAFC",
};

type Store = {
  _id: string;
  name: string;
  categories?: { name: string }[];
  distanceMeters?: number;
  rating?: number;
  image?: string;
};

const LIMIT = 20;

export default function DeliverySearch() {
  const isFocused = useIsFocused();
  const mountedRef = useRef(true);
  const { isDesktop, isTablet, width: screenWidth } = useWebResponsive();

  // Responsive layout configuration
  const getLayoutConfig = () => {
    if (Platform.OS === "web") {
      const isLargeScreen = isDesktop || isTablet;
      return {
        containerPadding: isLargeScreen ? 24 : 16,
        contentMaxWidth: isDesktop ? 1200 : isTablet ? 900 : screenWidth - 32,
        searchBarWidth: isLargeScreen ? "600px" : "100%",
        cardRadius: isLargeScreen ? 16 : 12,
      };
    }
    return {
      containerPadding: 16,
      contentMaxWidth: screenWidth - 32,
      searchBarWidth: "100%",
      cardRadius: 12,
    };
  };

  const { containerPadding, contentMaxWidth, searchBarWidth, cardRadius } =
    getLayoutConfig();

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const [items, setItems] = useState<Store[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const cancelRef = useRef<ReturnType<typeof axios.CancelToken.source> | null>(
    null
  );

  // احصل على الموقع عند اختيار "الأقرب"
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (filter !== "nearest") {
        if (mounted && isFocused) setCoords({});
        return;
      }
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (mounted && isFocused) {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [filter, isFocused]);

  // حارس unmount + cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelRef.current?.cancel("unmount");
    };
  }, []);

  // إعادة الضبط عند تغيّر أي مُدخل
  useEffect(() => {
    if (isFocused && mountedRef.current) {
      setItems([]);
      setPage(1);
      setHasMore(true);
    }
  }, [q, filter, categoryId, coords.lat, coords.lng, isFocused]);

  const debouncedQ = useDebounce(q, 250);

  useEffect(() => {
    if (isFocused && mountedRef.current) {
      fetchPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, filter, categoryId, coords.lat, coords.lng, isFocused]);

  async function fetchPage(p = 1) {
    if (!isFocused || !mountedRef.current || loading || (p > 1 && !hasMore))
      return;

    if (mountedRef.current) setLoading(true);

    cancelRef.current?.cancel();
    const source = axios.CancelToken.source();
    cancelRef.current = source;

    try {
      const params: any = {
        q: debouncedQ.trim(),
        filter,
        page: p,
        limit: LIMIT,
      };
      if (categoryId) params.categoryId = categoryId;
      if (filter === "nearest" && coords.lat && coords.lng) {
        params.lat = coords.lat;
        params.lng = coords.lng;
      }
      const { data } = await axiosInstance.get("/delivery/stores/search", {
        params,
        cancelToken: source.token,
      });

      if (!mountedRef.current || !isFocused) return; // ⛔ لا تحدّث UI بعد الخروج

      setItems(p === 1 ? data.items : (prev) => [...prev, ...data.items]); // استخدم prev
      setHasMore(Boolean(data.hasMore));
      setPage(p);
    } catch (e: any) {
      if (!axios.isCancel(e)) {
      }
    } finally {
      if (mountedRef.current && isFocused) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }

  function refresh() {
    if (!isFocused || !mountedRef.current) return;
    if (mountedRef.current) setRefreshing(true);
    fetchPage(1);
  }

  function loadMore() {
    if (!isFocused || !mountedRef.current) return;
    if (!loading && hasMore && items.length >= page * LIMIT) {
      fetchPage(page + 1);
    }
  }

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: containerPadding, maxWidth: contentMaxWidth },
      ]}
    >
      {/* شريط البحث - متجاوب */}
      <View style={[styles.searchContainer, { width: searchBarWidth }]}>
        <Ionicons name="search" size={20} color={WEB_COLORS.primary} />
        <TextInput
          placeholder="ابحث عن متجر…"
          placeholderTextColor={WEB_COLORS.textLight}
          style={styles.searchInput}
          value={q}
          onChangeText={setQ}
        />
        {!!q && (
          <TouchableOpacity onPress={() => setQ("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={WEB_COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* الفلاتر والفئات في نفس السطر على الويب */}
      {Platform.OS === "web" && (isDesktop || isTablet) ? (
        <View style={styles.filtersRow}>
          <View style={styles.filtersItem}>
            <FiltersBar value={filter} onChange={setFilter} />
          </View>
          <View style={styles.filtersItem}>
            <CategoriesChips
              value={categoryId}
              onChange={(id) => setCategoryId(id || undefined)}
            />
          </View>
        </View>
      ) : (
        <>
          {/* الفلاتر */}
          <FiltersBar value={filter} onChange={setFilter} />

          {/* الفئات */}
          <CategoriesChips
            value={categoryId}
            onChange={(id) => setCategoryId(id || undefined)}
          />
        </>
      )}

      {/* النتائج */}
      <FlatList
        removeClippedSubviews={false} // 👈 أضِف هذا
        data={items}
        keyExtractor={(it) => it._id}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReachedThreshold={0.35}
        onEndReached={loadMore}
        ListFooterComponent={
          loading && items.length > 0 ? (
            <View style={{ paddingVertical: 14 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <Text
              style={{ textAlign: "center", marginTop: 40, color: "#98a5b3" }}
            >
              لا توجد نتائج
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.storeCard,
              {
                marginHorizontal: 12,
                marginTop: 10,
                borderRadius: cardRadius,
                padding: containerPadding,
              },
            ]}
          >
            <Text
              style={[
                styles.storeName,
                {
                  color: Platform.OS === "web" ? WEB_COLORS.text : COLORS.blue,
                },
              ]}
            >
              {item.name}
            </Text>
            {!!item.categories?.[0]?.name && (
              <Text
                style={[styles.storeCategory, { color: WEB_COLORS.textLight }]}
              >
                {item.categories[0].name}
              </Text>
            )}
            {!!item.distanceMeters && (
              <Text
                style={[styles.storeDistance, { color: WEB_COLORS.primary }]}
              >
                {(item.distanceMeters / 1000).toFixed(1)} كم
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

/** ديبونس بسيط */
function useDebounce<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

// Enhanced styles for web compatibility
const styles = {
  container: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? WEB_COLORS.background : "#fff",
    alignSelf: "center",
    width: "100%",
  },
  searchContainer: {
    margin: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: WEB_COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: Platform.OS === "web" ? WEB_COLORS.input : "#fff",
    ...(Platform.OS === "web" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: WEB_COLORS.text,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 20,
    marginHorizontal: 12,
    marginBottom: 16,
    ...(Platform.OS === "web" && {
      justifyContent: "space-between",
    }),
  },
  filtersItem: {
    flex: 1,
    ...(Platform.OS === "web" && {
      maxWidth: 300,
    }),
  },
  storeCard: {
    backgroundColor: Platform.OS === "web" ? WEB_COLORS.card : "#fff",
    borderWidth: 1,
    borderColor: WEB_COLORS.border,
    ...(Platform.OS === "web" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  storeName: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
  storeCategory: {
    fontFamily: "Cairo-Regular",
    marginTop: 4,
  },
  storeDistance: {
    fontFamily: "Cairo-Regular",
    marginTop: 4,
    fontSize: 14,
  },
};
