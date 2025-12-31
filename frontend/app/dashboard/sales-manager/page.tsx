'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Deal {
  id: string;
  client: string;
  value: number;
  stage: 'lead' | 'negotiation' | 'proposal' | 'closed';
  probability: number;
  owner: string;
}

export default function SalesManagerDashboard() {
  const [walletAddress] = useState('0xff516a60...f1954421');
  const [deals] = useState<Deal[]>([
    { id: 'D-001', client: 'Global Tech Inc.', value: 150000, stage: 'proposal', probability: 75, owner: 'أحمد' },
    { id: 'D-002', client: 'Innovation Labs', value: 85000, stage: 'negotiation', probability: 50, owner: 'سارة' },
    { id: 'D-003', client: 'Digital Solutions', value: 220000, stage: 'lead', probability: 25, owner: 'محمد' },
    { id: 'D-004', client: 'Smart Systems', value: 95000, stage: 'closed', probability: 100, owner: 'فاطمة' },
  ]);

  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const closedDeals = deals.filter(d => d.stage === 'closed').reduce((sum, d) => sum + d.value, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">💼 لوحة مدير المبيعات</h1>
            </div>
            <div className="text-right bg-blue-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Connected as:</div>
              <div className="font-mono text-sm text-blue-600">{walletAddress}</div>
              <div className="text-sm text-cyan-600 font-semibold">Role: مدير المبيعات</div>
              <button className="mt-1 text-xs text-red-600 hover:text-red-800">Disconnect</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Sales Target */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-2">🎯 هدف المبيعات - Q4 2024</h2>
              <div className="text-3xl font-bold">$500,000</div>
            </div>
            <div className="text-right">
              <div className="text-lg">المحقق: ${closedDeals.toLocaleString()}</div>
              <div className="text-sm text-blue-200">{((closedDeals / 500000) * 100).toFixed(1)}% من الهدف</div>
              <div className="w-48 bg-blue-400 rounded-full h-4 mt-2">
                <div className="bg-white rounded-full h-4" style={{width: `${(closedDeals / 500000) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-blue-600">${totalPipeline.toLocaleString()}</div>
            <div className="text-gray-600">إجمالي Pipeline</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">${closedDeals.toLocaleString()}</div>
            <div className="text-gray-600">صفقات مغلقة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-yellow-600">{deals.filter(d => d.stage !== 'closed').length}</div>
            <div className="text-gray-600">صفقات نشطة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-purple-600">4</div>
            <div className="text-gray-600">فريق المبيعات</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📈 صلاحيات مدير المبيعات</h3>
            <div className="space-y-3">
              <Link href="/sales" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-semibold">إدارة الفواتير</div>
                  <div className="text-sm text-gray-600">إنشاء ومتابعة الفواتير</div>
                </div>
              </Link>
              <Link href="/deals" className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                <span className="text-2xl">🤝</span>
                <div>
                  <div className="font-semibold">إدارة الصفقات</div>
                  <div className="text-sm text-gray-600">تتبع مراحل البيع</div>
                </div>
              </Link>
              <Link href="/reports" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">تقارير الأداء</div>
                  <div className="text-sm text-gray-600">تحليل أداء الفريق</div>
                </div>
              </Link>
              <Link href="/sales" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="text-2xl">📝</span>
                <div>
                  <div className="font-semibold">العقود الذكية</div>
                  <div className="text-sm text-gray-600">إنشاء عقود بيع آلية</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔔 تحديثات فورية</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="font-semibold text-green-800">🎉 صفقة جديدة مغلقة!</div>
                <div className="text-sm text-green-600">Smart Systems - $95,000</div>
                <div className="text-xs text-gray-500">منذ ساعتين</div>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="font-semibold text-blue-800">عرض سعر جديد</div>
                <div className="text-sm text-blue-600">Global Tech Inc. طلب عرض تفصيلي</div>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="font-semibold text-yellow-800">متابعة مطلوبة</div>
                <div className="text-sm text-yellow-600">Innovation Labs - لم يرد منذ 5 أيام</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Pipeline */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">🎯 Pipeline الصفقات</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ صفقة جديدة</button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">الصفقة</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">القيمة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">المرحلة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الاحتمالية</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">المسؤول</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-blue-600">{deal.id}</td>
                  <td className="px-6 py-4 font-semibold">{deal.client}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">${deal.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      deal.stage === 'closed' ? 'bg-green-100 text-green-800' :
                      deal.stage === 'proposal' ? 'bg-blue-100 text-blue-800' :
                      deal.stage === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {deal.stage === 'closed' ? 'مغلقة' :
                       deal.stage === 'proposal' ? 'عرض سعر' :
                       deal.stage === 'negotiation' ? 'مفاوضة' : 'فرصة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${
                          deal.probability >= 75 ? 'bg-green-500' :
                          deal.probability >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} style={{width: `${deal.probability}%`}}></div>
                      </div>
                      <span className="text-sm">{deal.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">{deal.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
