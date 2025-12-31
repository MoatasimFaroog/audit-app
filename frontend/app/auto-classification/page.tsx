'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  suggestedAccount: string;
  confidence: number;
  category: string;
}

const accountCategories = {
  'مصروفات': ['مصروفات رواتب', 'مصروفات إيجار', 'مصروفات مرافق', 'مصروفات تسويق', 'مصروفات صيانة'],
  'إيرادات': ['إيرادات مبيعات', 'إيرادات خدمات', 'إيرادات استثمارات', 'إيرادات أخرى'],
  'أصول': ['النقدية', 'البنك', 'المخزون', 'الذمم المدينة', 'الأصول الثابتة'],
  'خصوم': ['الذمم الدائنة', 'قروض قصيرة الأجل', 'قروض طويلة الأجل', 'مستحقات'],
};

export default function AutoClassificationPage() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const classifyTransaction = () => {
    if (!description || !amount) return;
    
    setIsProcessing(true);
    
    // محاكاة تصنيف AI
    setTimeout(() => {
      const lowerDesc = description.toLowerCase();
      let suggestedAccount = '';
      let category = '';
      let type: 'debit' | 'credit' = 'debit';
      let confidence = 0;

      if (lowerDesc.includes('راتب') || lowerDesc.includes('أجور') || lowerDesc.includes('salary')) {
        suggestedAccount = 'مصروفات رواتب';
        category = 'مصروفات';
        confidence = 95;
      } else if (lowerDesc.includes('إيجار') || lowerDesc.includes('rent')) {
        suggestedAccount = 'مصروفات إيجار';
        category = 'مصروفات';
        confidence = 92;
      } else if (lowerDesc.includes('كهرباء') || lowerDesc.includes('ماء') || lowerDesc.includes('utility')) {
        suggestedAccount = 'مصروفات مرافق';
        category = 'مصروفات';
        confidence = 88;
      } else if (lowerDesc.includes('مبيعات') || lowerDesc.includes('بيع') || lowerDesc.includes('sale')) {
        suggestedAccount = 'إيرادات مبيعات';
        category = 'إيرادات';
        type = 'credit';
        confidence = 94;
      } else if (lowerDesc.includes('شراء') || lowerDesc.includes('مورد') || lowerDesc.includes('purchase')) {
        suggestedAccount = 'الذمم الدائنة';
        category = 'خصوم';
        confidence = 85;
      } else if (lowerDesc.includes('تسويق') || lowerDesc.includes('إعلان') || lowerDesc.includes('marketing')) {
        suggestedAccount = 'مصروفات تسويق';
        category = 'مصروفات';
        confidence = 90;
      } else {
        suggestedAccount = 'مصروفات أخرى';
        category = 'مصروفات';
        confidence = 65;
      }

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        type,
        suggestedAccount,
        confidence,
        category,
      };

      setTransactions([newTransaction, ...transactions]);
      setDescription('');
      setAmount('');
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800">🏷️ تصنيف المعاملات التلقائي</h1>
            <p className="text-emerald-600 mt-2">تصنيف القيود المحاسبية واقتراح الحسابات المناسبة بالذكاء الاصطناعي</p>
          </div>
          <Link href="/" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            ← العودة
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* إدخال المعاملة */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">إدخال معاملة جديدة</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وصف المعاملة</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: دفع راتب شهر ديسمبر للموظفين"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ (ريال)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={classifyTransaction}
                disabled={isProcessing || !description || !amount}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    جاري التصنيف...
                  </>
                ) : (
                  <>🤖 تصنيف تلقائي</>
                )}
              </button>
            </div>
          </div>

          {/* نتائج التصنيف */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">نتائج التصنيف</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">🏷️</div>
                <p>أدخل معاملة للحصول على اقتراحات التصنيف</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">{tx.description}</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-1">
                          {tx.amount.toLocaleString()} ريال
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        tx.type === 'debit' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {tx.type === 'debit' ? 'مدين' : 'دائن'}
                      </span>
                    </div>
                    
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">الحساب المقترح:</p>
                          <p className="font-bold text-emerald-700">{tx.suggestedAccount}</p>
                          <p className="text-xs text-gray-500">التصنيف: {tx.category}</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${
                            tx.confidence >= 90 ? 'text-green-600' : 
                            tx.confidence >= 75 ? 'text-yellow-600' : 'text-orange-600'
                          }`}>
                            {tx.confidence}%
                          </div>
                          <p className="text-xs text-gray-500">نسبة الثقة</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700">
                        ✓ قبول التصنيف
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-300">
                        ✎ تعديل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* دليل الحسابات */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📚 دليل الحسابات المتاحة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(accountCategories).map(([category, accounts]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">{category}</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {accounts.map((account) => (
                    <li key={account}>• {account}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
