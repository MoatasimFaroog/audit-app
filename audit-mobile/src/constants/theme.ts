import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { I18nManager } from 'react-native';

// مزج موضوعات React Navigation و React Native Paper
const paperTheme = {
  ...PaperDefaultTheme,
  // التأكد من أن التبييت لليمين لليسار في اللغة العربية
  rtl: I18nManager.isRTL,
  roundness: 8,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#1976D2',      // أزرق داكن
    primaryContainer: '#dbeafe',
    secondary: '#64B5F6',    // أزرق فاتح
    secondaryContainer: '#f0f9ff',
    surface: '#FFFFFF',      // أبيض
    background: '#F5F5F5',   // رمادي فاتح جداً
    error: '#D32F2F',        // أحمر
    text: '#212121',         // رمادي داكن
    onSurface: '#212121',
    disabled: '#757575',     // رمادي متوسط
    placeholder: '#9E9E9E',   // رمادي
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#1976D2',
    success: '#4CAF50',      // أخضر
    warning: '#FFA000',      // برتقالي
  },
  fonts: {
    ...PaperDefaultTheme.fonts,
    // استخدام خط مناسب للغة العربية
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: paperTheme.colors.primary,
    background: paperTheme.colors.background,
    card: paperTheme.colors.surface,
    text: paperTheme.colors.text,
    border: paperTheme.colors.disabled,
    notification: paperTheme.colors.notification,
  },
};

// مزج الموضوعين معاً
export const theme = {
  ...paperTheme,
  ...navigationTheme,
  colors: {
    ...paperTheme.colors,
    ...navigationTheme.colors,
  },
};
