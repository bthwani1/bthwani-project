import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

// Sentry configuration for React Native/Expo
export class SentryConfig {
  static init() {
    Sentry.init({
      dsn: Constants.expoConfig?.extra?.sentryDsn || process.env.EXPO_PUBLIC_SENTRY_DSN,
      environment: __DEV__ ? 'development' : 'production',
      enableInExpoDevelopment: true,
      debug: __DEV__,
      tracesSampleRate: __DEV__ ? 1.0 : 0.1,
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: __DEV__ ? 1.0 : 0.1,

      // Release tracking
      release: Constants.expoConfig?.version || '1.0.0',
      dist: `${Constants.expoConfig?.android?.package}-${Constants.expoConfig?.ios?.bundleIdentifier}`,

      // Filter out development errors in production
      beforeSend(event, hint) {
        // Filter out network errors that are not actual errors
        if (event.exception) {
          const error = hint.originalException;
          if (error && typeof error === 'object' && 'message' in error) {
            const message = (error as Error).message;
            if (message.includes('Network Error') || message.includes('Failed to fetch')) {
              return null;
            }
          }
        }
        return event;
      },

      // Set tags for better error categorization
      initialScope: {
        tags: {
          platform: 'mobile',
          framework: 'expo',
        },
      },
    });
  }

  static captureException(error: Error, context?: Record<string, any>) {
    Sentry.Native.captureException(error, {
      contexts: {
        ...context,
        page: context?.screen || 'unknown',
        step: context?.step || 'unknown',
        payload_hash: context?.payload_hash || 'unknown',
      },
    });
  }

  static captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
    Sentry.Native.captureMessage(message, level, {
      contexts: context,
    });
  }

  static setUser(userId: string, userProperties?: Record<string, any>) {
    Sentry.Native.setUser({
      id: userId,
      ...userProperties,
    });
  }

  static setTag(key: string, value: string) {
    Sentry.Native.setTag(key, value);
  }

  static setContext(key: string, context: Record<string, any>) {
    Sentry.Native.setContext(key, context);
  }

  static addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }) {
    Sentry.Native.addBreadcrumb(breadcrumb);
  }
}

// Hook for React Native components
export const useSentry = () => {
  return {
    captureException: SentryConfig.captureException,
    captureMessage: SentryConfig.captureMessage,
    setUser: SentryConfig.setUser,
    setTag: SentryConfig.setTag,
    setContext: SentryConfig.setContext,
    addBreadcrumb: SentryConfig.addBreadcrumb,
  };
};

export default SentryConfig;
