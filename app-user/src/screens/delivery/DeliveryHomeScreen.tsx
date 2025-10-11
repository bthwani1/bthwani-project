import React, { useCallback, useRef } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

import { RootStackParamList } from "@/types/navigation";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuth } from "@/auth/AuthContext";
import { useVerificationState } from "@/context/verify";
import { useEnsureAuthAndVerified } from "@/guards/useEnsureAuthAndVerified"; // ✅
import { useWebResponsive } from "@/hooks/useWebResponsive";

import DeliveryBannerSlider from "@/components/delivery/DeliveryBannerSlider";
import DeliveryCategories from "@/components/delivery/DeliveryCategories";
import DeliveryDeals from "@/components/delivery/DeliveryDeals";
import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import DeliveryTrending from "@/components/delivery/DeliveryTrending";

// Enhanced color palette for web compatibility
const COLORS = {
  primary: "#FF500D",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  text: "#1A3052",
  textLight: "#6B7280",
  border: "#E5E7EB",
};
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BusinessDetails"
>;

const DeliveryHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDesktop, isTablet, width: screenWidth } = useWebResponsive();
  const ensure = useEnsureAuthAndVerified({
    requireVerified: true,
    cooldownMs: 1200,
  });
  const { authReady } = useAuth();
  const { loading: verifyLoading } = useVerificationState();
  const promptedRef = useRef(false);

  // Responsive layout configuration
  const getLayoutConfig = () => {
    if (Platform.OS === "web") {
      const isLargeScreen = isDesktop || isTablet;
      return {
        containerPadding: isLargeScreen ? 20 : 16,
        sectionGap: isLargeScreen ? 32 : 24,
        maxContentWidth: isDesktop ? 1400 : isTablet ? 1000 : screenWidth - 32,
      };
    }
    return {
      containerPadding: 16,
      sectionGap: 24,
      maxContentWidth: screenWidth - 32,
    };
  };

  const { containerPadding, sectionGap, maxContentWidth } = getLayoutConfig();

  // اعرض الـ Prompt عند أول Focus للشاشة فقط بعد الجاهزية
  useFocusEffect(
    useCallback(() => {
      if (promptedRef.current) return;
      if (!authReady || verifyLoading) return;

      promptedRef.current = true;
      const t = setTimeout(() => {
        ensure();
      }, 50); // تأخير بسيط للتأكيد
      return () => clearTimeout(t);
    }, [authReady, verifyLoading, ensure])
  );

  return (
    <View testID="delivery-home-container" style={styles.container}>
      <View testID="sticky-header" style={styles.stickyHeader}>
        <DeliveryHeader />
      </View>

      <ScrollView
        testID="scroll-view"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: containerPadding },
        ]}
      >
        <View style={[styles.contentWrapper, { maxWidth: maxContentWidth }]}>
          {/* Hero Banner - Full Width */}
          <View
            testID="content-section"
            style={[styles.section, { marginBottom: sectionGap }]}
          >
            <DeliveryBannerSlider placement="home_hero" channel="app" />
          </View>

          {/* Responsive Layout for Categories and Trending */}
          {Platform.OS === "web" && isDesktop ? (
            <View style={[styles.rowSection, { marginBottom: sectionGap }]}>
              <View style={styles.rowItem}>
                <DeliveryCategories />
              </View>
              <View style={styles.rowItem}>
                <DeliveryTrending
                  onSelect={(store) =>
                    navigation.navigate("BusinessDetails", { business: store })
                  }
                />
              </View>
            </View>
          ) : (
            <>
              <View
                testID="content-section"
                style={[styles.section, { marginBottom: sectionGap }]}
              >
                <DeliveryCategories />
              </View>

              <View
                testID="content-section"
                style={[styles.section, { marginBottom: sectionGap }]}
              >
                <DeliveryTrending
                  onSelect={(store) =>
                    navigation.navigate("BusinessDetails", { business: store })
                  }
                />
              </View>
            </>
          )}

          {/* Deals Section - Full Width */}
          <View
            testID="content-section"
            style={[styles.section, { marginBottom: sectionGap }]}
          >
            <DeliveryDeals
              sectionTitle="العروض"
              onSelect={(store) =>
                navigation.navigate("BusinessDetails", { business: store })
              }
              // categoryId={...} // اختياري: لو تبي عروض لفئة معينة
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DeliveryHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stickyHeader: {
    zIndex: 10,
    backgroundColor: COLORS.background,
    paddingBottom: 6,
    borderBottomWidth: Platform.OS === "web" ? 1 : 0,
    borderBottomColor: COLORS.border,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 6,
  },
  contentWrapper: {
    alignSelf: "center",
    width: "100%",
  },
  section: {
    marginBottom: 10,
    // Enhanced styles for web
    ...(Platform.OS === "web" && {
      paddingHorizontal: 8,
      borderRadius: 12,
      backgroundColor: COLORS.surface,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  // New responsive layout styles
  rowSection: {
    flexDirection: "row",
    gap: 24,
    ...(Platform.OS === "web" && {
      justifyContent: "space-between",
    }),
  },
  rowItem: {
    flex: 1,
    ...(Platform.OS === "web" && {
      minWidth: 300,
      maxWidth: 600,
    }),
  },
});
