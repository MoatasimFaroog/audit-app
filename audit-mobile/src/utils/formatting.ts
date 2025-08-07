import { I18nManager } from 'react-native';

/**
 * تنسيق المبلغ كعملة
 * @param amount المبلغ
 * @param currency رمز العملة
 * @returns المبلغ منسقاً كعملة
 */
export function formatCurrency(amount: number, currency: string = 'SAR'): string {
  const locale = I18nManager.isRTL ? 'ar-SA' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * تنسيق رقم مع فاصلتين عشريتين
 * @param value الرقم
 * @returns الرقم منسقاً
 */
export function formatNumber(value: number): string {
  const locale = I18nManager.isRTL ? 'ar-SA' : 'en-US';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * تنسيق تاريخ
 * @param date التاريخ
 * @returns التاريخ منسقاً
 */
export function formatDate(date: string | Date): string {
  const locale = I18nManager.isRTL ? 'ar-SA' : 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * الحصول على لون نوع الحساب
 * @param accountCode رمز الحساب
 * @returns لون نوع الحساب
 */
export function getAccountTypeColor(accountCode: string): {
  textColor: string;
  backgroundColor: string;
} {
  const firstDigit = accountCode.charAt(0);
  
  switch (firstDigit) {
    case '1': // Assets
      return { textColor: '#16a34a', backgroundColor: '#dcfce7' };
    case '2': // Liabilities
      return { textColor: '#dc2626', backgroundColor: '#fee2e2' };
    case '3': // Equity
      return { textColor: '#7c3aed', backgroundColor: '#f3e8ff' };
    case '4': // Revenue
      return { textColor: '#2563eb', backgroundColor: '#dbeafe' };
    case '5': // Cost of Goods Sold
      return { textColor: '#ea580c', backgroundColor: '#ffedd5' };
    case '6': // Expenses
      return { textColor: '#4b5563', backgroundColor: '#f3f4f6' };
    default:
      return { textColor: '#4b5563', backgroundColor: '#f3f4f6' };
  }
}

/**
 * الحصول على اسم نوع الحساب
 * @param accountCode رمز الحساب
 * @param locale اللغة
 * @returns اسم نوع الحساب
 */
export function getAccountTypeName(accountCode: string, locale: string = 'ar'): string {
  const firstDigit = accountCode.charAt(0);
  
  const names = {
    ar: {
      '1': 'الأصول',
      '2': 'الالتزامات',
      '3': 'حقوق الملكية',
      '4': 'الإيرادات',
      '5': 'تكلفة البضاعة المباعة',
      '6': 'المصروفات',
    },
    en: {
      '1': 'Assets',
      '2': 'Liabilities',
      '3': 'Equity',
      '4': 'Revenue',
      '5': 'Cost of Goods Sold',
      '6': 'Expenses',
    }
  };
  
  const localeKey = locale as keyof typeof names;
  const digitKey = firstDigit as keyof (typeof names)['ar'];
  
  return names[localeKey]?.[digitKey] || locale === 'ar' ? 'غير محدد' : 'Undefined';
}

/**
 * توليد اسم ملف التقرير
 * @param type نوع التقرير
 * @param projectName اسم المشروع
 * @param format صيغة الملف
 * @returns اسم ملف التقرير
 */
export function generateReportFileName(type: string, projectName: string, format: string): string {
  const date = new Date().toISOString().split('T')[0];
  const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9؀-ۿ]/g, '_');
  return `${type}_${sanitizedProjectName}_${date}.${format}`;
}
