import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string | Date, locale: string = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function getAccountTypeColor(accountCode: string): string {
  const firstDigit = accountCode.charAt(0);
  
  switch (firstDigit) {
    case '1': // Assets
      return 'text-green-600 bg-green-50';
    case '2': // Liabilities
      return 'text-red-600 bg-red-50';
    case '3': // Equity
      return 'text-purple-600 bg-purple-50';
    case '4': // Revenue
      return 'text-blue-600 bg-blue-50';
    case '5': // Cost of Goods Sold
      return 'text-orange-600 bg-orange-50';
    case '6': // Expenses
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

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
  
  return names[locale as keyof typeof names]?.[firstDigit as keyof typeof names.ar] || 'غير محدد';
}

export function downloadFile(data: Blob, filename: string): void {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function isValidExcelFile(file: File): boolean {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ];
  
  return validTypes.includes(file.type) || 
    file.name.endsWith('.xlsx') || 
    file.name.endsWith('.xls');
}

export function generateReportFileName(type: string, projectName: string, format: string): string {
  const date = new Date().toISOString().split('T')[0];
  const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9؀-ۿ]/g, '_');
  return `${type}_${sanitizedProjectName}_${date}.${format}`;
}