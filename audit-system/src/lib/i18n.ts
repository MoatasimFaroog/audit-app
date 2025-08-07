import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Navigation
      dashboard: 'لوحة التحكم',
      projects: 'المشاريع',
      chartOfAccounts: 'دليل الحسابات',
      reports: 'التقارير',
      settings: 'الإعدادات',
      
      // Project Management
      createProject: 'إنشاء مشروع جديد',
      projectName: 'اسم المشروع',
      companyName: 'اسم الشركة',
      financialYear: 'السنة المالية',
      currency: 'العملة',
      status: 'الحالة',
      actions: 'العمليات',
      
      // File Upload
      uploadTrialBalance: 'رفع ميزان المراجعة',
      dragAndDrop: 'اسحب وأفلت ملف Excel هنا',
      orClickToSelect: 'أو انقر لاختيار الملف',
      supportedFormats: 'الصيغ المدعومة: .xlsx, .xls',
      upload: 'رفع',
      processing: 'جارٍ المعالجة...',
      
      // Financial Statements
      balanceSheet: 'قائمة المركز المالي',
      incomeStatement: 'قائمة الدخل',
      cashFlowStatement: 'قائمة التدفقات النقدية',
      equityStatement: 'قائمة التغير في حقوق الملكية',
      
      // Balance Sheet
      assets: 'الأصول',
      liabilities: 'الالتزامات',
      equity: 'حقوق الملكية',
      totalAssets: 'إجمالي الأصول',
      totalLiabilities: 'إجمالي الالتزامات',
      totalEquity: 'إجمالي حقوق الملكية',
      
      // Income Statement
      revenues: 'الإيرادات',
      expenses: 'المصروفات',
      netIncome: 'صافي الدخل',
      grossProfit: 'إجمالي الربح',
      operatingIncome: 'دخل العمليات',
      
      // Actions
      generate: 'توليد',
      export: 'تصدير',
      pdf: 'PDF',
      excel: 'Excel',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      
      // Common
      loading: 'جارٍ التحميل...',
      success: 'تم بنجاح',
      error: 'خطأ',
      warning: 'تحذير',
      info: 'معلومات',
      total: 'الإجمالي',
      amount: 'المبلغ',
      date: 'التاريخ',
      description: 'الوصف',
      accountCode: 'رمز الحساب',
      accountName: 'اسم الحساب',
      debit: 'مدين',
      credit: 'دائن',
      balance: 'الرصيد',
      
      // Messages
      projectCreated: 'تم إنشاء المشروع بنجاح',
      fileUploaded: 'تم رفع الملف بنجاح',
      statementGenerated: 'تم توليد القائمة المالية بنجاح',
      dataExported: 'تم تصدير البيانات بنجاح',
      
      // Validation
      required: 'هذا الحقل مطلوب',
      invalidFile: 'نوع الملف غير صحيح',
      uploadError: 'خطأ في رفع الملف',
      
      // Financial Notes
      financialNotes: 'الإيضاحات المتممة',
      addNote: 'إضافة إيضاح',
      noteTitle: 'عنوان الإيضاح',
      noteContent: 'محتوى الإيضاح',
      noteNumber: 'رقم الإيضاح',
      
      // Reviewer Report
      reviewerReport: 'تقرير المراجع',
      reviewerName: 'اسم المراجع',
      reviewDate: 'تاريخ المراجعة',
      findings: 'النتائج',
      recommendations: 'التوصيات',
      complianceNotes: 'ملاحظات الامتثال'
    }
  },
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      projects: 'Projects',
      chartOfAccounts: 'Chart of Accounts',
      reports: 'Reports',
      settings: 'Settings',
      
      // Project Management
      createProject: 'Create New Project',
      projectName: 'Project Name',
      companyName: 'Company Name',
      financialYear: 'Financial Year',
      currency: 'Currency',
      status: 'Status',
      actions: 'Actions',
      
      // File Upload
      uploadTrialBalance: 'Upload Trial Balance',
      dragAndDrop: 'Drag and drop Excel file here',
      orClickToSelect: 'or click to select file',
      supportedFormats: 'Supported formats: .xlsx, .xls',
      upload: 'Upload',
      processing: 'Processing...',
      
      // Financial Statements
      balanceSheet: 'Balance Sheet',
      incomeStatement: 'Income Statement',
      cashFlowStatement: 'Cash Flow Statement',
      equityStatement: 'Statement of Changes in Equity',
      
      // Balance Sheet
      assets: 'Assets',
      liabilities: 'Liabilities',
      equity: 'Equity',
      totalAssets: 'Total Assets',
      totalLiabilities: 'Total Liabilities',
      totalEquity: 'Total Equity',
      
      // Income Statement
      revenues: 'Revenues',
      expenses: 'Expenses',
      netIncome: 'Net Income',
      grossProfit: 'Gross Profit',
      operatingIncome: 'Operating Income',
      
      // Actions
      generate: 'Generate',
      export: 'Export',
      pdf: 'PDF',
      excel: 'Excel',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      
      // Common
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      total: 'Total',
      amount: 'Amount',
      date: 'Date',
      description: 'Description',
      accountCode: 'Account Code',
      accountName: 'Account Name',
      debit: 'Debit',
      credit: 'Credit',
      balance: 'Balance',
      
      // Messages
      projectCreated: 'Project created successfully',
      fileUploaded: 'File uploaded successfully',
      statementGenerated: 'Financial statement generated successfully',
      dataExported: 'Data exported successfully',
      
      // Validation
      required: 'This field is required',
      invalidFile: 'Invalid file type',
      uploadError: 'File upload error',
      
      // Financial Notes
      financialNotes: 'Financial Notes',
      addNote: 'Add Note',
      noteTitle: 'Note Title',
      noteContent: 'Note Content',
      noteNumber: 'Note Number',
      
      // Reviewer Report
      reviewerReport: 'Reviewer Report',
      reviewerName: 'Reviewer Name',
      reviewDate: 'Review Date',
      findings: 'Findings',
      recommendations: 'Recommendations',
      complianceNotes: 'Compliance Notes'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;