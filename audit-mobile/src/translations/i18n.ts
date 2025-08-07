import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import arTranslations from './ar';
import enTranslations from './en';

const LANGUAGE_STORAGE_KEY = '@app_language';

// تهيئة i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      ar: {
        translation: arTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    lng: 'ar', // اللغة الافتراضية هي العربية
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

// دالة لتغيير اللغة وحفظها
export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

// دالة لاسترجاع اللغة المخزنة
export const initLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Failed to load saved language:', error);
  }
};

export default i18n;
