'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PurchaseOrder {
  id: string;
  vendor: string;
  items: string;
  amount: number;
  status: 'draft' | 'pending' | 'approved' | 'delivered';
  date: string;
}

export default function ProcurementDashboard() {
  const [walletAddress] = useState('0xff516a60...f1954421');
  const [orders] = useState<PurchaseOrder[]>([
    { id: 'PO-001', vendor: 'Tech Supplies Co.', items: 'أجهزة حاسوب (10)', amount: 25000, status: 'approved', date: '2024-12-28' },
    { id: 'PO-002', vendor: 'Office World', items: 'أثاث مكتبي', amount: 8500, status: 'pending', date: '2024-12-29' },
    { id: 'PO-003', vendor: 'Cloud Services Ltd', items: 'اشتراك سنوي', amount: 15000, status: 'draft', date: '2024-12-29' },
    { id: 'PO-004', vendor: 'Safety Equipment', items: 'معدات سلامة', amount: 3200, status: 'delivered', date: '2024-12-25' },
  ]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-orange-600 hover:text-orange-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">📦 لوحة مدير المشتريات</h1>
            </div>
            <div className="text-right bg-orange-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Connected as:</div>
              <div className="font-mono text-sm text-orange-600">{walletAddress}</div>
              <div className="text-sm text-amber-600 font-semibold">Role: مدير المشتريات</div>
              <button className="mt-1 text-xs text-red-600 hover:text-red-800">Disconnect</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-orange-600">{orders.length}</div>
            <div className="text-gray-600">أوامر الشراء</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</div>
            <div className="text-gray-600">قيد الموافقة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">${orders.filter(o => o.status === 'approved' || o.status === 'delivered').reduce((s,o) => s + o.amount, 0).toLocaleString()}</div>
            <div className="text-gray-600">مشتريات معتمدة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-gray-600">الموردون النشطون</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🛒 صلاحيات مدير المشتريات</h3>
            <div className="space-y-3">
              <Link href="/create-transaction" className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <span className="text-2xl">➕</span>
                <div>
                  <div className="font-semibold">إنشاء أمر شراء</div>
                  <div className="text-sm text-gray-600">طلب شراء جديد على البلوكشين</div>
                </div>
              </Link>
              <Link href="/vendors" className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <span className="text-2xl">🏢</span>
                <div>
                  <div className="font-semibold">إدارة الموردين</div>
                  <div className="text-sm text-gray-600">إضافة وتعديل بيانات الموردين</div>
                </div>
              </Link>
              <Link href="/reports" className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">تقارير المشتريات</div>
                  <div className="text-sm text-gray-600">تحليل الإنفاق والموردين</div>
                </div>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-semibold">العقود الذكية</div>
                  <div className="text-sm text-gray-600">إنشاء عقود شراء تلقائية</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📬 طلبات تحتاج إجراء</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="font-semibold">عرض سعر من مورد جديد</div>
                <div className="text-sm text-gray-600">Cloud Services Ltd - $15,000</div>
                <div className="flex gap-2 mt-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">قبول</button>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">مفاوضة</button>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="font-semibold">طلب تجديد عقد</div>
                <div className="text-sm text-gray-600">Office World - ينتهي في 15 يناير</div>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="font-semibold">شحنة وصلت</div>
                <div className="text-sm text-gray-600">PO-004 - تأكيد الاستلام</div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">📦 أوامر الشراء</h3>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">+ أمر شراء جديد</button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">رقم الأمر</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">المورد</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">الأصناف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-orange-600">{order.id}</td>
                  <td className="px-6 py-4">{order.vendor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                  <td className="px-6 py-4 text-right font-semibold">${order.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      order.status === 'approved' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'approved' ? 'معتمد' : 
                       order.status === 'pending' ? 'قيد الموافقة' :
                       order.status === 'delivered' ? 'تم التسليم' : 'مسودة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
