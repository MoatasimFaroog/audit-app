import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { changeLanguage } from '../translations/i18n';

interface SettingsState {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  loading: boolean;
  setLanguage: (lang: 'ar' | 'en') => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  initialize: () => Promise<void>;
}

const LANGUAGE_KEY = '@app:language';
const THEME_KEY = '@app:theme';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  language: 'ar',
  theme: 'light',
  loading: true,
  
  initialize: async () => {
    try {
      const [languageData, themeData] = await Promise.all([
        AsyncStorage.getItem(LANGUAGE_KEY),
        AsyncStorage.getItem(THEME_KEY),
      ]);
      
      const language = (languageData as 'ar' | 'en') || 'ar';
      const theme = (themeData as 'light' | 'dark' | 'system') || 'light';
      
      // تفعيل الاتجاه من اليمين لليسار للغة العربية
      if (language === 'ar' && !I18nManager.isRTL) {
        I18nManager.forceRTL(true);
      } else if (language === 'en' && I18nManager.isRTL) {
        I18nManager.forceRTL(false);
      }
      
      // تغيير لغة التطبيق
      await changeLanguage(language);
      
      set({ language, theme, loading: false });
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ loading: false });
    }
  },
  
  setLanguage: async (language: 'ar' | 'en') => {
    try {
      // تفعيل الاتجاه من اليمين لليسار للغة العربية
      if (language === 'ar' && !I18nManager.isRTL) {
        I18nManager.forceRTL(true);
        // يجب إعادة تشغيل التطبيق بعد تغيير الاتجاه
      } else if (language === 'en' && I18nManager.isRTL) {
        I18nManager.forceRTL(false);
        // يجب إعادة تشغيل التطبيق بعد تغيير الاتجاه
      }
      
      // تغيير لغة التطبيق
      await changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      set({ language });
    } catch (error) {
      console.error('Error setting language:', error);
    }
  },
  
  setTheme: async (theme: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
      set({ theme });
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  },
}));
