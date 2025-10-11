import { useEffect, useState } from "react";
import { Platform } from "react-native";

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWeb: boolean;
}

export const useWebResponsive = (): ResponsiveState => {
  const [dimensions, setDimensions] = useState(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 };
  });

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const width = dimensions.width;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return {
    width,
    height: dimensions.height,
    isMobile,
    isTablet,
    isDesktop,
    isWeb: Platform.OS === "web",
  };
};
