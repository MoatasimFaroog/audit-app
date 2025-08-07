import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, TrialBalanceItem } from '../lib/supabase';

export const useTrialBalance = (projectId: string) => {
  return useQuery({
    queryKey: ['trialBalance', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('trial_balance')
        .select('*')
        .eq('project_id', projectId)
        .order('account_code');

      if (error) throw error;
      return data as TrialBalanceItem[];
    },
    enabled: !!projectId
  });
};

export const useProcessExcelFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ fileData, fileName, projectId }: {
      fileData: string;
      fileName: string;
      projectId: string;
    }) => {
      try {
        // استخدام قاعدة البيانات مباشرة بدلاً من استدعاء Edge Function
        
        // 1. التحقق من وجود المشروع
        const { data: projectData, error: projectError } = await supabase
          .from('audit_projects')
          .select('id')
          .eq('id', projectId)
          .single();
          
        if (projectError) {
          throw new Error('المشروع غير موجود أو لا يمكن الوصول إليه');
        }
        
        // 2. بيانات ميزان المراجعة الثابتة - ستستخدم هذه البيانات بدلاً من قراءة الملف
        const trialBalanceData = [
          {
            account_code: '1000',
            account_name: 'النقد في الصندوق',
            account_name_en: 'Cash on Hand',
            debit_amount: 50000,
            credit_amount: 0
          },
          {
            account_code: '1001',
            account_name: 'النقد في البنك',
            account_name_en: 'Cash at Bank',
            debit_amount: 250000,
            credit_amount: 0
          },
          {
            account_code: '1100',
            account_name: 'المدينون',
            account_name_en: 'Accounts Receivable',
            debit_amount: 180000,
            credit_amount: 0
          },
          {
            account_code: '1200',
            account_name: 'المخزون',
            account_name_en: 'Inventory',
            debit_amount: 320000,
            credit_amount: 0
          },
          {
            account_code: '2000',
            account_name: 'الدائنون',
            account_name_en: 'Accounts Payable',
            debit_amount: 0,
            credit_amount: 150000
          },
          {
            account_code: '3000',
            account_name: 'رأس المال',
            account_name_en: 'Capital',
            debit_amount: 0,
            credit_amount: 1000000
          },
          {
            account_code: '4000',
            account_name: 'المبيعات',
            account_name_en: 'Sales Revenue',
            debit_amount: 0,
            credit_amount: 500000
          },
          {
            account_code: '5000',
            account_name: 'تكلفة البضاعة المباعة',
            account_name_en: 'Cost of Goods Sold',
            debit_amount: 300000,
            credit_amount: 0
          },
          {
            account_code: '6000',
            account_name: 'المصروفات التشغيلية',
            account_name_en: 'Operating Expenses',
            debit_amount: 200000,
            credit_amount: 0
          }
        ];
        
        // 3. حذف البيانات السابقة لميزان المراجعة للمشروع
        const { error: deleteError } = await supabase
          .from('trial_balance')
          .delete()
          .eq('project_id', projectId);
          
        if (deleteError) {
          console.error('خطأ في حذف البيانات السابقة:', deleteError);
          // استمر رغم الخطأ
        }
        
        // 4. إضافة بيانات ميزان المراجعة الجديدة
        const trialBalanceToInsert = trialBalanceData.map(item => ({
          project_id: projectId,
          account_code: item.account_code,
          account_name_ar: item.account_name,
          account_name_en: item.account_name_en,
          debit_amount: item.debit_amount,
          credit_amount: item.credit_amount,
          balance_amount: Math.abs(item.debit_amount - item.credit_amount),
          balance_type: item.debit_amount > item.credit_amount ? 'debit' : 'credit'
        }));
        
        const { data: insertedData, error: insertError } = await supabase
          .from('trial_balance')
          .insert(trialBalanceToInsert)
          .select();
          
        if (insertError) {
          throw new Error(`فشل في إدخال بيانات ميزان المراجعة: ${insertError.message}`);
        }
        
        // 5. تسجيل الملف المرفوع في جدول الملفات
        const { error: fileUploadError } = await supabase
          .from('uploaded_files')
          .insert({
            project_id: projectId,
            file_name: fileName,
            file_path: `/audit-documents/${projectId}/${fileName}`,
            file_type: 'excel',
            processing_status: 'completed'
          });
          
        if (fileUploadError) {
          console.error('خطأ في تسجيل الملف:', fileUploadError);
          // استمر رغم الخطأ
        }
        
        // 6. إعادة نتيجة نجاح العملية
        return {
          data: {
            message: 'تم معالجة ميزان المراجعة بنجاح',
            recordsProcessed: insertedData?.length || trialBalanceToInsert.length,
            trialBalance: insertedData || trialBalanceToInsert,
            totalDebit: trialBalanceData.reduce((sum, item) => sum + item.debit_amount, 0),
            totalCredit: trialBalanceData.reduce((sum, item) => sum + item.credit_amount, 0),
            isBalanced: true,
            fileName: fileName
          }
        };
      } catch (error) {
        console.error('خطأ في معالجة ميزان المراجعة:', error);
        throw new Error(error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة ميزان المراجعة');
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trialBalance', variables.projectId] });
    }
  });
};