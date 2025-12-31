'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CEODashboard() {
  const [walletAddress] = useState('0xff516a60...f1954421');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">👔 لوحة الرئيس التنفيذي (CEO)</h1>
            </div>
            <div className="text-right bg-indigo-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Connected as:</div>
              <div className="font-mono text-sm text-indigo-600">{walletAddress}</div>
              <div className="text-sm text-purple-600 font-semibold">Role: الرئيس التنفيذي (CEO)</div>
              <button className="mt-1 text-xs text-red-600 hover:text-red-800">Disconnect</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">📊 ملخص تنفيذي - ديسمبر 2024</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold">$5.2M</div>
              <div className="text-indigo-200">إجمالي الإيرادات</div>
            </div>
            <div>
              <div className="text-3xl font-bold">+24%</div>
              <div className="text-indigo-200">نمو سنوي</div>
            </div>
            <div>
              <div className="text-3xl font-bold">156</div>
              <div className="text-indigo-200">موظف</div>
            </div>
            <div>
              <div className="text-3xl font-bold">98.5%</div>
              <div className="text-indigo-200">الامتثال</div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold text-indigo-600">4</div>
            <div className="text-gray-600">الأقسام النشطة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">1,247</div>
            <div className="text-gray-600">معاملات مكتملة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <div className="text-gray-600">تنتظر موافقتك</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-gray-600">تنبيهات عاجلة</div>
          </div>
        </div>

        {/* CEO Specific Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">👑 صلاحيات الرئيس التنفيذي</h3>
            <div className="space-y-3">
              <Link href="/transactions" className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-semibold">الموافقات النهائية</div>
                  <div className="text-sm text-gray-600">اعتماد المعاملات الكبرى (+$100K)</div>
                </div>
              </Link>
              <Link href="/roles" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="text-2xl">👥</span>
                <div>
                  <div className="font-semibold">إدارة الأدوار</div>
                  <div className="text-sm text-gray-600">تعيين وتغيير صلاحيات المستخدمين</div>
                </div>
              </Link>
              <Link href="/reports" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">التقارير التنفيذية</div>
                  <div className="text-sm text-gray-600">الوصول لجميع التقارير والتحليلات</div>
                </div>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl">⚙️</span>
                <div>
                  <div className="font-semibold">إعدادات النظام</div>
                  <div className="text-sm text-gray-600">تكوين Smart Contracts والسياسات</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🚨 تنبيهات تتطلب انتباهك</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="font-semibold text-red-800">معاملة كبيرة تنتظر الموافقة</div>
                <div className="text-sm text-red-600">تحويل $250,000 - من المدير المالي</div>
                <div className="flex gap-2 mt-2">
                  <button className="bg-green-500 text-white px-4 py-1 rounded text-sm">اعتماد</button>
                  <button className="bg-gray-500 text-white px-4 py-1 rounded text-sm">مراجعة</button>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="font-semibold text-yellow-800">تغيير صلاحيات مطلوب</div>
                <div className="text-sm text-yellow-600">طلب ترقية محاسب لمدير مالي</div>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="font-semibold text-blue-800">عقد ذكي جديد</div>
                <div className="text-sm text-blue-600">عقد شراكة يحتاج توقيعك</div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏢 نظرة عامة على الأقسام</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/accounting" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold">المحاسبة</div>
              <div className="text-sm text-green-600">✓ نشط</div>
            </Link>
            <Link href="/hr" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="font-semibold">الموارد البشرية</div>
              <div className="text-sm text-green-600">✓ نشط</div>
            </Link>
            <Link href="/sales" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-center">
              <div className="text-3xl mb-2">💼</div>
              <div className="font-semibold">المبيعات</div>
              <div className="text-sm text-green-600">✓ نشط</div>
            </Link>
            <Link href="/audit" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold">التدقيق</div>
              <div className="text-sm text-green-600">✓ نشط</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
