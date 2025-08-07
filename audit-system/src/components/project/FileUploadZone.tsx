import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useProcessExcelFile } from '../../hooks/useTrialBalance';
import { isValidExcelFile, readFileAsBase64 } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface FileUploadZoneProps {
  projectId: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ projectId }) => {
  const processExcelFile = useProcessExcelFile();
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!isValidExcelFile(file)) {
      setUploadStatus('error');
      setErrorMessage('نوع الملف غير صحيح. يرجى رفع ملف Excel (.xlsx أو .xls)');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const fileData = await readFileAsBase64(file);
      await processExcelFile.mutateAsync({
        fileData,
        fileName: file.name,
        projectId
      });
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'خطأ في رفع الملف');
    }
  }, [projectId, processExcelFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const resetUpload = () => {
    setUploadStatus('idle');
    setErrorMessage('');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">رفع ميزان المراجعة</h3>
          </div>
          
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
              uploadStatus === 'success' && 'border-green-500 bg-green-50',
              uploadStatus === 'error' && 'border-red-500 bg-red-50'
            )}
          >
            <input {...getInputProps()} />
            
            {uploadStatus === 'idle' && (
              <>
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'أفلت الملف هنا' : 'اسحب وأفلت ملف Excel هنا'}
                </p>
                <p className="text-gray-600 mb-4">أو انقر لاختيار الملف</p>
                <p className="text-sm text-gray-500">الصيغ المدعومة: .xlsx, .xls</p>
              </>
            )}
            
            {uploadStatus === 'uploading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-900">جاري معالجة الملف...</p>
                <p className="text-gray-600">يرجى الانتظار</p>
              </>
            )}
            
            {uploadStatus === 'success' && (
              <>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-green-900 mb-2">تم رفع الملف بنجاح!</p>
                <p className="text-green-700 mb-4">تم معالجة بيانات ميزان المراجعة</p>
                <Button onClick={resetUpload} variant="outline" size="sm">
                  رفع ملف آخر
                </Button>
              </>
            )}
            
            {uploadStatus === 'error' && (
              <>
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-red-900 mb-2">خطأ في رفع الملف</p>
                <p className="text-red-700 mb-4">{errorMessage}</p>
                <Button onClick={resetUpload} variant="outline" size="sm">
                  المحاولة مرة أخرى
                </Button>
              </>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>ملاحظة:</strong> تأكد من أن ملف Excel يحتوي على:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>رمز الحساب في العمود الأول</li>
              <li>اسم الحساب في العمود الثاني</li>
              <li>المبلغ المدين في العمود الثالث</li>
              <li>المبلغ الدائن في العمود الرابع</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};