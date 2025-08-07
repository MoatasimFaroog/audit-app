import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';

/**
 * دالة للتحقق من أن الملف هو ملف Excel
 */
export function isExcelMimeType(mimeType: string): boolean {
  const excelMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/octet-stream', // لبعض ملفات Excel التي يمكن أن تأتي كتدفق بيانات
  ];
  
  return excelMimeTypes.includes(mimeType) || 
         mimeType.includes('excel') || 
         mimeType.includes('spreadsheet');
}

/**
 * دالة للتحقق من امتداد ملف Excel
 */
export function hasExcelExtension(uri: string): boolean {
  const lowerCaseUri = uri.toLowerCase();
  return lowerCaseUri.endsWith('.xlsx') || lowerCaseUri.endsWith('.xls');
}

/**
 * دالة لاختيار ملف Excel من الجهاز
 */
export async function pickExcelFile(): Promise<{
  success: boolean;
  uri?: string;
  name?: string;
  size?: number;
  error?: string;
}> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        '.xlsx',
        '.xls',
      ],
      copyToCacheDirectory: true,
    });
    
    if (result.canceled) {
      return { success: false, error: 'User cancelled document picking' };
    }
    
    const file = result.assets[0];
    const isExcel = isExcelMimeType(file.mimeType || '') || hasExcelExtension(file.uri);
    
    if (!isExcel) {
      return { success: false, error: 'Selected file is not an Excel file' };
    }
    
    return {
      success: true,
      uri: file.uri,
      name: file.name,
      size: file.size,
    };
  } catch (error) {
    console.error('Error picking document:', error);
    return { success: false, error: 'Error selecting file' };
  }
}

/**
 * دالة لقراءة ملف كشفرة Base64
 */
export async function readFileAsBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error reading file as base64:', error);
    throw new Error('Failed to read file as base64');
  }
}

/**
 * دالة لتحميل ملف
 */
export async function downloadFile(
  fileUrl: string,
  fileName: string,
  mimeType: string
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    // تحديد مسار التنزيل
    let downloadPath;
    
    if (Platform.OS === 'ios') {
      // في نظام iOS، نقوم بالتنزيل إلى مجلد مؤقت أولاً
      downloadPath = `${FileSystem.cacheDirectory}${fileName}`;
    } else {
      // في نظام Android، يمكننا استخدام مجلد التنزيلات
      downloadPath = `${FileSystem.documentDirectory}${fileName}`;
    }
    
    // تنزيل الملف
    const { uri } = await FileSystem.downloadAsync(fileUrl, downloadPath);
    
    return { success: true, filePath: uri };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error: 'Failed to download file' };
  }
}
