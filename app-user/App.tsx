// App.tsx
import { Platform } from "react-native";
import { enableFreeze, enableScreens } from "react-native-screens";
if (Platform.OS !== "web") {
  require("@/notify");
}
enableScreens(true);
enableFreeze(false);

// Suppress SafeAreaView deprecation warning
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("SafeAreaView has been deprecated")
  ) {
    return;
  }
  originalWarn(...args);
};

// البوليفيلات قبل i18n
import "./src/localization/i18n";
import "./src/polyfills/intl";
import "./src/polyfills/platform"; // ⬅️ جديد

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  DevSettings,
  I18nManager,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

// Web-specific error handling
// Web-specific error handling (type-safe without DOM lib)
if (Platform.OS === "web") {
  const w: any =
    (typeof globalThis !== "undefined" && (globalThis as any).window) ||
    undefined;

  if (w) {
    w.addEventListener("error", (event: any) => {
      // event: ErrorEvent في متصفح، لكن نكتفي بـ any لتفادي DOM typings
      console.error("Global error:", event?.error ?? event);
    });

    w.addEventListener("unhandledrejection", (event: any) => {
      // event: PromiseRejectionEvent في متصفح
      console.error("Unhandled promise rejection:", event?.reason ?? event);
    });
  }
}

// لو عندك Expo:
let Updates: any = null;
try {
  Updates = require("expo-updates");
} catch {}

// ===== مكوّن التمهيد: يحسم RTL ثم يحمّل الـ Shell =====
const RTL_FLAG = "didForceRTL";

function AppBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const did = await AsyncStorage.getItem(RTL_FLAG);
      if (!I18nManager.isRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      }
      if (!did) {
        await AsyncStorage.setItem(RTL_FLAG, "1");
        // إعادة التشغيل مرّة واحدة
        if (Updates?.reloadAsync) {
          try {
            await Updates.reloadAsync();
            return;
          } catch {}
        }
        if (DevSettings?.reload) {
          DevSettings.reload();
          return;
        }
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;
  return <AppShell />;
}

// ===== هنا ضع كل ما كان في App سابقًا (NetInfo, Fonts, Linking, ...الخ) =====
import { useVerificationState } from "@/context/verify";
import { getAuthBanner } from "@/guards/bannerGateway";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";
import { AuthBannerProvider } from "./src/components/AuthBanner";
import { CartProvider } from "./src/context/CartContext";
import { AppThemeProvider, useAppTheme } from "./src/context/ThemeContext";
import AppNavigation from "./src/navigation";
import { navigationRef } from "./src/navigation/ref";
import { attachNotificationListeners, registerPushToken } from "./src/notify";
import OfflineScreen from "./src/screens/OfflineScreen";
import { saveUtmFromUrl } from "./src/utils/lib/utm";
import { retryQueuedRequests } from "./src/utils/offlineQueue";
import { toastConfig } from "./src/utils/toastConfig";
import { Analytics } from "./src/lib/analytics";
import { FeatureFlags } from "./src/lib/featureFlags";
import { SentryConfig } from "./src/lib/sentry";

SplashScreen.preventAutoHideAsync();

// Initialize analytics, feature flags, and error tracking
Analytics.init();
FeatureFlags.init();
SentryConfig.init();

function AppShell() {
  // 👇 كل الـ Hooks هنا تُستدعى دائمًا وبنفس الترتيب
  const { isLoggedIn, authReady } = useAuth();
  const { verified } = useVerificationState();
  const [appIsReady, setAppIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const { theme } = useAppTheme();
  const barStyle =
    theme.modeResolved === "dark" ? "light-content" : "dark-content";

  const handleRetry = useCallback(() => {
    setChecking(true);
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setChecking(false);
    });
  }, []);
  useEffect(() => {
    const b = getAuthBanner();
    if (!b) return;
    if (isLoggedIn) b.hide(); // لا معنى لبانر "login" الآن
    if (verified) b.hide(); // ولا لبانر "verify"
  }, [isLoggedIn, verified]);
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const onDeepLink = (event: { url: string }) => {
      if (event?.url) saveUtmFromUrl(event.url);
    };
    Linking.getInitialURL().then((url) => {
      if (url) {
        saveUtmFromUrl(url);
      }
    });
    const sub = Linking.addEventListener("url", onDeepLink);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          "Cairo-Regular": require("./assets/fonts/cairo_regular.ttf"),
          "Cairo-Bold": require("./assets/fonts/cairo_bold.ttf"),
          "Cairo-SemiBold": require("./assets/fonts/cairo_semibold.ttf"),
        });
        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        setHasSeenOnboarding(seen === "true");
      } catch (e) {
        console.warn("❌ Error initializing app:", e);
      } finally {
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    retryQueuedRequests();
  }, []);

  // Register push token فقط بعد جهوزية auth وتوفر جلسة
  useEffect(() => {
    if (authReady && isLoggedIn) {
      (async () => {
        try {
          await registerPushToken("user");
        } catch (e) {
          console.warn("Push register error:", e);
        }
      })();
    }
  }, [authReady, isLoggedIn]);

  useEffect(() => {
    // فعّل مستمعي الإشعارات
    const navigate = (screen: string, params?: any) => {
      if (navigationRef?.current) {
        (navigationRef.current as any).navigate(screen, params);
      }
    };
    const { responseSub, receiveSub } = attachNotificationListeners(navigate);

    return () => {
      responseSub?.remove?.();
      receiveSub?.remove?.();
    };
  }, []);

  return (
    <AuthBannerProvider>
      <CartProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            {/* خلفية عامة للجزء العلوي لضمان ظهور اللون على iOS و Android */}
            <View style={{ flex: 1, backgroundColor: "#FF500D" }}>
              <StatusBar
                translucent={false}
                backgroundColor={theme.colors.primary}
                barStyle={barStyle}
              />
              <SafeAreaView
                style={{ flex: 1, backgroundColor: theme.colors.primary }}
                edges={["top", "bottom"]}
              >
                {/* ✳️ بقية التطبيق */}
                {!appIsReady || hasSeenOnboarding === null ? (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                ) : checking || isConnected === null ? (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" />
                  </View>
                ) : !isConnected ? (
                  <OfflineScreen onRetry={handleRetry} />
                ) : (
                  <>
                    <AppNavigation hasSeenOnboarding={hasSeenOnboarding} />
                    <Toast config={toastConfig} />
                  </>
                )}
              </SafeAreaView>
            </View>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </CartProvider>
    </AuthBannerProvider>
  );
}

export default function App() {
  // لفّ كل شيء داخل AuthProvider و AppThemeProvider
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppBootstrap />
      </AuthProvider>
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
