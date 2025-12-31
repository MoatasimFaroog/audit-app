'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CFODashboard() {
  const [walletAddress] = useState('0xff516a60...f1954421');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-teal-600 hover:text-teal-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">💰 لوحة المدير المالي (CFO)</h1>
            </div>
            <div className="text-right bg-teal-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Connected as:</div>
              <div className="font-mono text-sm text-teal-600">{walletAddress}</div>
              <div className="text-sm text-emerald-600 font-semibold">Role: المدير المالي (CFO)</div>
              <button className="mt-1 text-xs text-red-600 hover:text-red-800">Disconnect</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">💵</div>
            <div className="text-2xl font-bold text-green-600">$2,450,000</div>
            <div className="text-gray-600">إجمالي الأصول</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="text-3xl mb-2">📉</div>
            <div className="text-2xl font-bold text-red-600">$890,000</div>
            <div className="text-gray-600">إجمالي الالتزامات</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-blue-600">$1,560,000</div>
            <div className="text-gray-600">صافي حقوق الملكية</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-3xl mb-2">💹</div>
            <div className="text-2xl font-bold text-purple-600">+18.5%</div>
            <div className="text-gray-600">معدل النمو</div>
          </div>
        </div>

        {/* CFO Specific Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔐 صلاحيات المدير المالي</h3>
            <div className="space-y-3">
              <Link href="/accounting" className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="font-semibold">اعتماد القيود المحاسبية</div>
                  <div className="text-sm text-gray-600">مراجعة واعتماد القيود الكبيرة</div>
                </div>
              </Link>
              <Link href="/reports" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-semibold">التقارير المالية</div>
                  <div className="text-sm text-gray-600">إنشاء ومراجعة التقارير</div>
                </div>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl">💳</span>
                <div>
                  <div className="font-semibold">إدارة الميزانية</div>
                  <div className="text-sm text-gray-600">تخطيط وتوزيع الميزانيات</div>
                </div>
              </Link>
              <Link href="/transactions" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="text-2xl">🔒</span>
                <div>
                  <div className="font-semibold">Multi-Sig Approvals</div>
                  <div className="text-sm text-gray-600">التوقيع على المعاملات الكبيرة</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⏳ معاملات تنتظر الموافقة</h3>
            <div className="space-y-3">
              {[
                { id: 'TX-001', amount: '$50,000', type: 'تحويل بنكي', from: 'مدير المشتريات' },
                { id: 'TX-002', amount: '$125,000', type: 'دفعة موردين', from: 'قسم المحاسبة' },
                { id: 'TX-003', amount: '$35,000', type: 'رواتب', from: 'HR' },
              ].map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-semibold">{tx.id}</div>
                    <div className="text-sm text-gray-600">{tx.type} - من {tx.from}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">{tx.amount}</div>
                    <div className="flex gap-2 mt-1">
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600">اعتماد</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">رفض</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Charts Placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 التحليل المالي</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <div>رسم بياني للإيرادات</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🥧</div>
                <div>توزيع المصروفات</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📉</div>
                <div>التدفقات النقدية</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
