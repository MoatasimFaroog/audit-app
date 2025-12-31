'use client';

import Link from 'next/link';
import { useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
  status: 'ok' | 'low' | 'critical';
}

export default function WarehouseDashboard() {
  const [walletAddress] = useState('0xff516a60...f1954421');
  const [inventory] = useState<InventoryItem[]>([
    { id: 'SKU-001', name: 'أجهزة حاسوب Dell', category: 'إلكترونيات', quantity: 45, minStock: 10, location: 'A-01', status: 'ok' },
    { id: 'SKU-002', name: 'طابعات HP', category: 'إلكترونيات', quantity: 8, minStock: 15, location: 'A-02', status: 'low' },
    { id: 'SKU-003', name: 'ورق A4', category: 'مستلزمات', quantity: 500, minStock: 100, location: 'B-01', status: 'ok' },
    { id: 'SKU-004', name: 'كراسي مكتبية', category: 'أثاث', quantity: 3, minStock: 10, location: 'C-01', status: 'critical' },
    { id: 'SKU-005', name: 'شاشات عرض', category: 'إلكترونيات', quantity: 22, minStock: 20, location: 'A-03', status: 'ok' },
  ]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-amber-600 hover:text-amber-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">🏭 لوحة مدير المستودع</h1>
            </div>
            <div className="text-right bg-amber-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Connected as:</div>
              <div className="font-mono text-sm text-amber-600">{walletAddress}</div>
              <div className="text-sm text-yellow-600 font-semibold">Role: مدير المستودع</div>
              <button className="mt-1 text-xs text-red-600 hover:text-red-800">Disconnect</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-amber-500">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-amber-600">1,247</div>
            <div className="text-gray-600">إجمالي الأصناف</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">1,180</div>
            <div className="text-gray-600">مخزون كافي</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-yellow-600">45</div>
            <div className="text-gray-600">مخزون منخفض</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-2xl font-bold text-red-600">22</div>
            <div className="text-gray-600">نفاد وشيك</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📦 صلاحيات مدير المستودع</h3>
            <div className="space-y-3">
              <Link href="/create-transaction" className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <span className="text-2xl">📥</span>
                <div>
                  <div className="font-semibold">استلام البضائع</div>
                  <div className="text-sm text-gray-600">تسجيل الواردات على البلوكشين</div>
                </div>
              </Link>
              <Link href="/transactions" className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <span className="text-2xl">📤</span>
                <div>
                  <div className="font-semibold">صرف البضائع</div>
                  <div className="text-sm text-gray-600">تسجيل الصادرات والتحويلات</div>
                </div>
              </Link>
              <Link href="/audit" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-semibold">جرد المخزون</div>
                  <div className="text-sm text-gray-600">مطابقة الكميات الفعلية</div>
                </div>
              </Link>
              <Link href="/reports" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">تقارير المخزون</div>
                  <div className="text-sm text-gray-600">حركة وتقادم المخزون</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🚨 تنبيهات المخزون</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="font-semibold text-red-800">نفاد وشيك!</div>
                <div className="text-sm text-red-600">كراسي مكتبية - المتبقي 3 فقط</div>
                <button className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm">طلب شراء عاجل</button>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="font-semibold text-yellow-800">مخزون منخفض</div>
                <div className="text-sm text-yellow-600">طابعات HP - المتبقي 8 (الحد الأدنى 15)</div>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="font-semibold text-blue-800">شحنة واردة</div>
                <div className="text-sm text-blue-600">PO-002 - تصل غداً</div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">📦 جرد المخزون</h3>
            <div className="flex gap-2">
              <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">📥 استلام</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">📤 صرف</button>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">الصنف</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">الفئة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الكمية</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحد الأدنى</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الموقع</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${item.status === 'critical' ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 font-mono text-amber-600">{item.id}</td>
                  <td className="px-6 py-4 font-semibold">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{item.minStock}</td>
                  <td className="px-6 py-4 text-center font-mono">{item.location}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      item.status === 'ok' ? 'bg-green-100 text-green-800' :
                      item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'ok' ? '✅ كافي' : item.status === 'low' ? '⚠️ منخفض' : '🚨 حرج'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
