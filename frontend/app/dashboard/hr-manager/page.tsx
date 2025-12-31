'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  department: string;
  status: 'active' | 'onleave' | 'pending';
  joinDate: string;
}

export default function HRManagerDashboard() {
  const [walletAddress] = useState('0xff516a60...f1954421');
  const [employees] = useState<Employee[]>([
    { id: 'EMP-001', name: 'أحمد محمد', department: 'الهندسة', status: 'active', joinDate: '2023-01-15' },
    { id: 'EMP-002', name: 'سارة علي', department: 'المبيعات', status: 'active', joinDate: '2022-06-20' },
    { id: 'EMP-003', name: 'محمد إبراهيم', department: 'المالية', status: 'onleave', joinDate: '2023-03-10' },
    { id: 'EMP-004', name: 'فاطمة عمر', department: 'IT', status: 'pending', joinDate: '2024-12-01' },
  ]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-green-600 hover:text-green-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">👥 لوحة مدير الموارد البشرية</h1>
            </div>
            <div className="text-right bg-green-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Connected as:</div>
              <div className="font-mono text-sm text-green-600">{walletAddress}</div>
              <div className="text-sm text-emerald-600 font-semibold">Role: مدير الموارد البشرية</div>
              <button className="mt-1 text-xs text-red-600 hover:text-red-800">Disconnect</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-gray-600">إجمالي الموظفين</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-gray-600">الأقسام</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <div className="text-gray-600">طلبات معلقة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-purple-600">$485K</div>
            <div className="text-gray-600">الرواتب الشهرية</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">👤 صلاحيات مدير الموارد البشرية</h3>
            <div className="space-y-3">
              <Link href="/hr" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl">➕</span>
                <div>
                  <div className="font-semibold">إضافة موظف جديد</div>
                  <div className="text-sm text-gray-600">تسجيل موظف على البلوكشين</div>
                </div>
              </Link>
              <Link href="/payroll" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl">💵</span>
                <div>
                  <div className="font-semibold">معالجة الرواتب</div>
                  <div className="text-sm text-gray-600">تنفيذ دفعات الرواتب</div>
                </div>
              </Link>
              <Link href="/leaves" className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <span className="text-2xl">🏖️</span>
                <div>
                  <div className="font-semibold">إدارة الإجازات</div>
                  <div className="text-sm text-gray-600">الموافقة على طلبات الإجازة</div>
                </div>
              </Link>
              <Link href="/reports" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">تقارير الموظفين</div>
                  <div className="text-sm text-gray-600">الحضور والأداء</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📬 طلبات تحتاج موافقة</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="font-semibold">طلب إجازة</div>
                <div className="text-sm text-gray-600">محمد إبراهيم - 5 أيام</div>
                <div className="flex gap-2 mt-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">موافقة</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">رفض</button>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="font-semibold">طلب ترقية</div>
                <div className="text-sm text-gray-600">سارة علي - مدير مبيعات</div>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="font-semibold">موظف جديد</div>
                <div className="text-sm text-gray-600">فاطمة عمر - تأكيد التعيين</div>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">👥 سجل الموظفين</h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ موظف جديد</button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">الرقم</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">الاسم</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">القسم</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">تاريخ التعيين</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-green-600">{emp.id}</td>
                  <td className="px-6 py-4 font-semibold">{emp.name}</td>
                  <td className="px-6 py-4">{emp.department}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      emp.status === 'active' ? 'bg-green-100 text-green-800' :
                      emp.status === 'onleave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {emp.status === 'active' ? 'نشط' : emp.status === 'onleave' ? 'إجازة' : 'معلق'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">{emp.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
