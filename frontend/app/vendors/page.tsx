'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Vendor {
  id: string;
  name: string;
  category: string;
  wallet: string;
  rating: number;
  totalOrders: number;
  status: 'active' | 'pending' | 'blocked';
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'V-001', name: 'Tech Supplies Co.', category: 'إلكترونيات', wallet: '0xabc...123', rating: 4.8, totalOrders: 45, status: 'active' },
    { id: 'V-002', name: 'Office World', category: 'أثاث مكتبي', wallet: '0xbcd...234', rating: 4.5, totalOrders: 32, status: 'active' },
    { id: 'V-003', name: 'Cloud Services Ltd', category: 'خدمات سحابية', wallet: '0xcde...345', rating: 4.9, totalOrders: 12, status: 'active' },
    { id: 'V-004', name: 'Safety Equipment', category: 'معدات سلامة', wallet: '0xdef...456', rating: 4.2, totalOrders: 8, status: 'pending' },
  ]);

  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/procurement" className="text-orange-600 hover:text-orange-800">← المشتريات</Link>
            <h1 className="text-2xl font-bold text-gray-800">🏢 إدارة الموردين</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setShowAdd(!showAdd)} className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">+ إضافة مورد جديد</button>
        </div>

        {showAdd && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">إضافة مورد جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="اسم المورد" className="border rounded-lg px-4 py-2" />
              <input type="text" placeholder="عنوان المحفظة (0x...)" className="border rounded-lg px-4 py-2" />
              <select className="border rounded-lg px-4 py-2">
                <option>إلكترونيات</option>
                <option>أثاث مكتبي</option>
                <option>خدمات سحابية</option>
                <option>معدات سلامة</option>
                <option>مستلزمات مكتبية</option>
              </select>
            </div>
            <button className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">تسجيل على البلوكشين</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">🏢</div>
                <span className={`px-2 py-1 text-xs rounded-full ${vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {vendor.status === 'active' ? 'نشط' : 'معلق'}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{vendor.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{vendor.category}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>التقييم:</span><span className="text-yellow-600">{'⭐'.repeat(Math.floor(vendor.rating))} {vendor.rating}</span></div>
                <div className="flex justify-between"><span>إجمالي الطلبات:</span><span className="font-semibold">{vendor.totalOrders}</span></div>
                <div className="text-xs text-gray-500 font-mono">{vendor.wallet}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">تعديل</button>
                <button className="flex-1 bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200">طلب جديد</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
