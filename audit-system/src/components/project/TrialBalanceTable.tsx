import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTrialBalance } from '../../hooks/useTrialBalance';
import { formatNumber, getAccountTypeColor, getAccountTypeName } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface TrialBalanceTableProps {
  projectId: string;
}

export const TrialBalanceTable: React.FC<TrialBalanceTableProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { data: trialBalance, isLoading } = useTrialBalance(projectId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">جاري تحميل بيانات ميزان المراجعة...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trialBalance || trialBalance.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            ميزان المراجعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">لم يتم رفع ميزان المراجعة بعد</p>
            <p className="text-sm text-gray-500">قم برفع ملف Excel من أعلى لعرض البيانات هنا</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totals = trialBalance.reduce(
    (acc, item) => {
      acc.debit += parseFloat(item.debit_amount?.toString() || '0');
      acc.credit += parseFloat(item.credit_amount?.toString() || '0');
      return acc;
    },
    { debit: 0, credit: 0 }
  );

  const isBalanced = Math.abs(totals.debit - totals.credit) < 0.01;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            ميزان المراجعة
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
            isBalanced ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}>
            {isBalanced ? (
              <>
                <TrendingUp className="w-4 h-4" />
                متوازن
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4" />
                غير متوازن
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-right p-3 font-medium text-gray-700">رمز الحساب</th>
                <th className="text-right p-3 font-medium text-gray-700">اسم الحساب</th>
                <th className="text-right p-3 font-medium text-gray-700">نوع الحساب</th>
                <th className="text-right p-3 font-medium text-gray-700">مدين</th>
                <th className="text-right p-3 font-medium text-gray-700">دائن</th>
              </tr>
            </thead>
            <tbody>
              {trialBalance.map((item, index) => (
                <tr key={item.id} className={cn(
                  "border-b border-gray-100 hover:bg-gray-50",
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}>
                  <td className="p-3 font-medium text-gray-900">{item.account_code}</td>
                  <td className="p-3 text-gray-900">{item.account_name}</td>
                  <td className="p-3">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getAccountTypeColor(item.account_code)
                    )}>
                      {getAccountTypeName(item.account_code, 'ar')}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono">
                    {item.debit_amount ? formatNumber(parseFloat(item.debit_amount.toString())) : '-'}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {item.credit_amount ? formatNumber(parseFloat(item.credit_amount.toString())) : '-'}
                  </td>
                </tr>
              ))}
              
              {/* Totals Row */}
              <tr className="border-t-2 border-gray-300 bg-blue-50 font-bold">
                <td className="p-3" colSpan={3}>
                  <span className="text-blue-900">الإجمالي</span>
                </td>
                <td className="p-3 text-right font-mono text-blue-900">
                  {formatNumber(totals.debit)}
                </td>
                <td className="p-3 text-right font-mono text-blue-900">
                  {formatNumber(totals.credit)}
                </td>
              </tr>
              
              {/* Balance Check Row */}
              <tr className={cn(
                "border-t border-gray-200 font-medium",
                isBalanced ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
              )}>
                <td className="p-3" colSpan={3}>
                  <span>الفرق</span>
                </td>
                <td className="p-3 text-right font-mono" colSpan={2}>
                  {formatNumber(Math.abs(totals.debit - totals.credit))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {!isBalanced && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <TrendingDown className="w-5 h-5" />
              <strong>تحذير: ميزان المراجعة غير متوازن</strong>
            </div>
            <p className="text-red-700 text-sm mt-1">
              يجب أن يكون إجمالي المدين مساوياً لإجمالي الدائن. يرجى مراجعة البيانات.
            </p>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>عدد الحسابات:</strong> {trialBalance.length}</p>
        </div>
      </CardContent>
    </Card>
  );
};