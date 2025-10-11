// screens/OnboardingScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  I18nManager,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAuth } from "@/auth/AuthContext";
import { silenceAuthPrompts } from "@/guards/authGate";
import { useWebResponsive } from "@/hooks/useWebResponsive";
import { RootStackParamList } from "@/types/navigation";
import axiosInstance from "@/utils/api/axiosInstance";

const { width: W, height: H } = Dimensions.get("window");
const isRTL = I18nManager.isRTL;

// ألوان
const COLORS = {
  primary: "#FF500D",
  primaryLight: "#FF6B2D",
  primaryDark: "#E63E00",
  secondary: "#0A2F5C",
  text: "#1A3052",
  textLight: "#6B7280",
  background: "#FFFFFF",
  backgroundSecondary: "#F8FAFC",
  accent: "#10B981",
  border: "#E5E7EB",
  shadow: "rgba(0, 0, 0, 0.1)",
};

// أنواع من الباك
type Lang = "ar" | "en";
type Media = { type: "lottie" | "image"; url: string };
type BEText = string | { ar?: string; en?: string };
type BackendSlide = {
  key: string;
  title?: BEText;
  subtitle?: BEText;
  media?: Media;
  cta?: { label?: BEText; action?: string };
  order?: number;
};

// util ترجمة بسيطة
const t = (val?: BEText, lang: Lang = "ar") =>
  typeof val === "string" ? val : val?.[lang] ?? val?.ar ?? val?.en ?? "";

/** محمّل لوتي من URL */
const RemoteLottie: React.FC<{
  url: string;
  width: number;
  height: number;
}> = ({ url, width, height }) => {
  const [json, setJson] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        const j = await res.json();
        if (mounted) setJson(j);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("CORS error, using fallback:", error);
          if (mounted)
            setJson({
              v: "5.5.7",
              fr: 29.97,
              ip: 0,
              op: 300,
              w: 800,
              h: 600,
              nm: "fallback",
              ddd: 0,
              assets: [],
              layers: [],
            });
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [url]);

  if (!json) return <ActivityIndicator />;
  return <LottieView source={json} autoPlay loop style={{ width, height }} />;
};

/** عرض ميديا الشريحة مع مقاسات متجاوبة */
const SlideMedia: React.FC<{ media?: Media; w: number; h: number }> = ({
  media,
  w,
  h,
}) => {
  if (!media?.url) return null;
  return (
    <View style={styles.lottieWrap}>
      {media.type === "lottie" ? (
        <RemoteLottie url={media.url} width={w} height={h} />
      ) : (
        <Image
          source={{ uri: media.url }}
          style={{ width: w, height: h, borderRadius: 16 }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const RTLTitle: React.FC<{
  children: React.ReactNode;
  size: number;
  color?: string;
  isRTL?: boolean;
}> = ({ children, size, color = COLORS.text, isRTL = false }) => (
  <Text
    style={[
      styles.titleText,
      {
        color,
        fontSize: size,
        lineHeight: Math.round(size * 1.25),
        textAlign: isRTL ? "right" : "center",
        writingDirection: isRTL ? "rtl" : "ltr",
      },
    ]}
    numberOfLines={3}
  >
    {children}
  </Text>
);

const RTLSubtitle: React.FC<{
  children: React.ReactNode;
  size: number;
  isRTL?: boolean;
}> = ({ children, size, isRTL = false }) => (
  <Text
    style={[
      styles.subtitleText,
      {
        fontSize: size,
        lineHeight: Math.round(size * 1.5),
        textAlign: isRTL ? "right" : "center",
        writingDirection: isRTL ? "rtl" : "ltr",
      },
    ]}
    numberOfLines={4}
  >
    {children}
  </Text>
);

/** يجلب الشرائح من /cms/onboarding */
function useOnboardingFromBackend(lang: Lang = "ar") {
  const [slides, setSlides] = useState<BackendSlide[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await axiosInstance.get<{ onboarding?: BackendSlide[] }>(
        "/cms/onboarding",
        {
          params: { lang },
          headers: { "x-silent-401": "1" },
          validateStatus: (s) => (s >= 200 && s < 300) || s === 304,
        }
      );
      if (resp.status !== 304) {
        setSlides(resp.data?.onboarding ?? []);
      } else {
        setSlides([]);
      }
    } catch {
      setSlides([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    load();
  }, [load]);

  return { slides, loading, refresh: load };
}

const OnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { enterAsGuest } = useAuth();
  const insets = useSafeAreaInsets();
  const { isDesktop, isTablet, width: screenWidth } = useWebResponsive();
  const [currentIndex, setCurrentIndex] = useState(0);

  const MIN_ANDROID_GESTURE_INSET = 16;
  const safeBottom =
    Platform.OS === "android"
      ? Math.max(insets.bottom, MIN_ANDROID_GESTURE_INSET)
      : insets.bottom;

  const isLargeScreen = isDesktop || isTablet;

  // مقاسات متجاوبة (ميديا وخطوط) - تعمل على الويب والموبايل
  const getResponsiveSizes = () => {
    if (Platform.OS === "web") {
      const isLargeScreen = isDesktop || isTablet;
      return {
        mediaW: isDesktop
          ? 560
          : isTablet
          ? 480
          : Math.min(screenWidth * 0.9, 360),
        mediaH: isDesktop
          ? 420
          : isTablet
          ? 360
          : Math.min(screenWidth * 0.9 * 0.75, 280),
        titleSize: isDesktop ? 36 : isTablet ? 28 : 24,
        subSize: isDesktop ? 18 : isTablet ? 16 : 14,
      };
    }
    // للموبايل استخدم مقاسات ثابتة
    return {
      mediaW: Math.min(screenWidth * 0.9, 360),
      mediaH: Math.min(screenWidth * 0.9 * 0.75, 280),
      titleSize: 24,
      subSize: 14,
    };
  };

  const { mediaW, mediaH, titleSize, subSize } = getResponsiveSizes();

  const getLayoutConfig = () => {
    if (Platform.OS === "web") {
      return {
        containerPadding: isLargeScreen ? 16 : 20,
        maxContentWidth: isDesktop ? 1200 : isTablet ? 900 : screenWidth - 32,
      };
    }
    return {
      containerPadding: 20,
      maxContentWidth: screenWidth - 32,
    };
  };

  const { containerPadding, maxContentWidth } = getLayoutConfig();

  const { slides, loading } = useOnboardingFromBackend("ar");

  // كتم تنبيهات المصادقة أثناء الاستعراض
  const extendSilence = useCallback(() => {
    silenceAuthPrompts(60_000);
  }, []);
  useEffect(() => {
    extendSilence();
  }, [extendSilence]);

  const handleDone = async () => {
    extendSilence();
    await enterAsGuest();
  };

  // بناء الصفحات: على الديسكتوب → عمودين (الميديا يمين، النص يسار)
  const pages = useMemo(() => {
    const arr = slides ?? [];
    return arr.map((s) => {
      const isWebLargeScreen = Platform.OS === "web" && isLargeScreen;

      const content = (
        <View
          style={[
            styles.slideRow,
            isWebLargeScreen ? styles.rowDesktop : styles.colMobile,
            { maxWidth: maxContentWidth },
          ]}
        >
          <View style={styles.mediaCol}>
            <SlideMedia media={s.media} w={mediaW} h={mediaH} />
          </View>

          <View
            style={[
              styles.textCol,
              { alignItems: isRTL ? "flex-end" : "center" },
            ]}
          >
            <RTLTitle size={titleSize} isRTL={isRTL}>
              {t(s.title, "ar")}
            </RTLTitle>
            <RTLSubtitle size={subSize} isRTL={isRTL}>
              {t(s.subtitle, "ar")}
            </RTLSubtitle>
          </View>
        </View>
      );

      // نضع كل المحتوى في image لأن المكتبة تقيد أماكن العرض
      return {
        backgroundColor: COLORS.background,
        image: content,
        title: <View />, // فارغ حتى لا يكرر العناوين
        subtitle: <View />,
      };
    });
  }, [
    slides,
    isLargeScreen,
    maxContentWidth,
    mediaW,
    mediaH,
    titleSize,
    subSize,
  ]);

  const skipLabel = "تخطي";
  const nextLabel = "التالي";
  const doneLabel = "ابدأ";

  if (loading) {
    return (
      <>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <SafeAreaView style={styles.loadingContainer} edges={["top", "bottom"]}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>جارٍ التحميل...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.mainContainer} edges={["top", "bottom"]}>
        <View style={[styles.contentContainer, { maxWidth: maxContentWidth }]}>
          <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
            bottomBarHeight={safeBottom + 12}
            pageIndexCallback={(index) => {
              setCurrentIndex(index);
              extendSilence();
            }}
            bottomBarColor={COLORS.background}
            containerStyles={[
              styles.onboardingContainer,
              {
                paddingTop:
                  Platform.OS === "web" && isLargeScreen
                    ? 16
                    : insets.top + containerPadding,
                paddingBottom: safeBottom + containerPadding,
              },
            ]}
            // إصلاح مشكلة RTL في المكتبة
            allowFontScaling={false}
            showSkip={true}
            showNext={true}
            showDone={true}
            SkipButtonComponent={(p: any) => {
              const isWebLarge = Platform.OS === "web" && isLargeScreen;
              return (
                <View
                  style={[
                    styles.buttonContainer,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <TouchableOpacity
                    {...p}
                    style={[
                      styles.webButton,
                      styles.skipButton,
                      isWebLarge && {
                        paddingHorizontal: 32,
                        paddingVertical: 16,
                        minWidth: 120,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.webButtonText, styles.skipButtonText]}>
                      تخطي
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            NextButtonComponent={(p: any) => {
              const isWebLarge = Platform.OS === "web" && isLargeScreen;
              return (
                <View
                  style={[
                    styles.buttonContainer,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <TouchableOpacity
                    {...p}
                    style={[
                      styles.webButton,
                      styles.nextButton,
                      isWebLarge && {
                        paddingHorizontal: 32,
                        paddingVertical: 16,
                        minWidth: 120,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.webButtonText, styles.nextButtonText]}>
                      التالي
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            DoneButtonComponent={(p: any) => {
              const isWebLarge = Platform.OS === "web" && isLargeScreen;
              return (
                <View
                  style={[
                    styles.buttonContainer,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <TouchableOpacity
                    {...p}
                    style={[
                      styles.webButton,
                      styles.doneButton,
                      isWebLarge && {
                        paddingHorizontal: 32,
                        paddingVertical: 16,
                        minWidth: 120,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.webButtonText, styles.doneButtonText]}>
                      ابدأ
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            pages={pages}
          />

          {/* مؤشّر تقدم أنيق للويب */}
          {Platform.OS === "web" &&
            isLargeScreen &&
            slides &&
            slides.length > 1 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  {slides.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.progressDot,
                        index === currentIndex && styles.progressDotActive,
                        index < currentIndex && styles.progressDotCompleted,
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.progressText}>
                  {currentIndex + 1} من {slides.length}
                </Text>
              </View>
            )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: COLORS.textLight,
  },

  // Main
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 16,
  },

  onboardingContainer: {
    backgroundColor: COLORS.background,
  },

  // تخطيط الصفحة - ديناميكي حسب المنصة
  slideRow: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 16,
  },
  rowDesktop: {
    flexDirection: "row", // سيتم تعديله في الكود
    minHeight: 520,
  },
  colMobile: {
    flexDirection: "column",
    minHeight: 480,
  },
  mediaCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 320,
  },
  textCol: {
    flex: 1,
    alignItems: "center", // سيتم تعديله في الكود
    justifyContent: "center",
    maxWidth: 560,
  },

  // الميديا
  lottieWrap: {
    width: "100%",
    alignItems: "center",
    marginVertical: 12,
  },

  // النصوص - سيتم حسابها ديناميكيًا في الكود
  titleText: {
    fontFamily: "Cairo-Bold",
    paddingHorizontal: 12,
    includeFontPadding: false,
    color: COLORS.text,
  },
  subtitleText: {
    fontFamily: "Cairo-Regular",
    marginTop: 12,
    paddingHorizontal: 12,
    includeFontPadding: false,
    color: COLORS.textLight,
  },

  // أزرار الموبايل - سيتم حسابها ديناميكيًا في الكود
  buttonContainer: {
    // سيتم تعيين flexDirection ديناميكيًا في الكود
  },
  webButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webButtonText: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    textAlign: "center",
  },
  skipButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  skipButtonText: { color: COLORS.textLight },
  nextButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  nextButtonText: { color: COLORS.primary },
  doneButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  doneButtonText: { color: COLORS.background },

  // مؤشّر التقدم للويب
  progressContainer: {
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  progressDotCompleted: { backgroundColor: COLORS.accent },
  progressText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

export default OnboardingScreen;
