'use client';

import Link from 'next/link';
import { useState } from 'react';

interface SystemStatus {
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  lastCheck: string;
}

export default function ITManagerDashboard() {
  const [walletAddress] = useState('0xff516a60...f1954421');
  const [systems] = useState<SystemStatus[]>([
    { name: 'Blockchain Node', status: 'online', uptime: '99.9%', lastCheck: 'منذ دقيقة' },
    { name: 'Smart Contracts', status: 'online', uptime: '100%', lastCheck: 'منذ دقيقة' },
    { name: 'API Server', status: 'online', uptime: '99.5%', lastCheck: 'منذ دقيقتين' },
    { name: 'Database', status: 'warning', uptime: '98.2%', lastCheck: 'منذ 5 دقائق' },
    { name: 'IPFS Storage', status: 'online', uptime: '99.8%', lastCheck: 'منذ دقيقة' },
  ]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-600 hover:text-slate-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">💻 لوحة مدير تقنية المعلومات</h1>
            </div>
            <div className="text-right bg-slate-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Connected as:</div>
              <div className="font-mono text-sm text-slate-600">{walletAddress}</div>
              <div className="text-sm text-zinc-600 font-semibold">Role: مدير تقنية المعلومات</div>
              <button className="mt-1 text-xs text-red-600 hover:text-red-800">Disconnect</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* System Health */}
        <div className="bg-gradient-to-r from-slate-700 to-zinc-800 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-2">🖥️ صحة النظام</h2>
              <div className="text-3xl font-bold text-green-400">✓ جميع الأنظمة تعمل</div>
            </div>
            <div className="text-right">
              <div className="text-lg">4/5 أنظمة نشطة 100%</div>
              <div className="text-sm text-slate-300">تحذير واحد في قاعدة البيانات</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-gray-600">Blockchain Blocks</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-gray-600">Smart Contracts</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-3xl mb-2">👛</div>
            <div className="text-2xl font-bold text-purple-600">89</div>
            <div className="text-gray-600">Wallets نشطة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-gray-600">تحذيرات</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⚙️ صلاحيات مدير IT</h3>
            <div className="space-y-3">
              <Link href="/roles" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-semibold">إدارة الوصول</div>
                  <div className="text-sm text-gray-600">صلاحيات المستخدمين والمحافظ</div>
                </div>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl">📜</span>
                <div>
                  <div className="font-semibold">نشر Smart Contracts</div>
                  <div className="text-sm text-gray-600">إضافة وتحديث العقود</div>
                </div>
              </Link>
              <Link href="/audit" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl">💾</span>
                <div>
                  <div className="font-semibold">النسخ الاحتياطي</div>
                  <div className="text-sm text-gray-600">Blockchain backup و recovery</div>
                </div>
              </Link>
              <Link href="/reports" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold">مراقبة الأداء</div>
                  <div className="text-sm text-gray-600">Logs وتحليل الأداء</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔔 تنبيهات النظام</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="font-semibold text-yellow-800">⚠️ تحذير قاعدة البيانات</div>
                <div className="text-sm text-yellow-600">استخدام المساحة 85% - يُنصح بالتوسيع</div>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="font-semibold text-blue-800">🔄 تحديث متاح</div>
                <div className="text-sm text-blue-600">Smart Contract v2.1 جاهز للنشر</div>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="font-semibold text-green-800">✅ نسخ احتياطي مكتمل</div>
                <div className="text-sm text-green-600">آخر نسخة: اليوم 03:00 AM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Systems Status */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">🖥️ حالة الأنظمة</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">النظام</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Uptime</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">آخر فحص</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {systems.map((sys, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{sys.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      sys.status === 'online' ? 'bg-green-100 text-green-800' :
                      sys.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sys.status === 'online' ? '🟢 نشط' : sys.status === 'warning' ? '🟡 تحذير' : '🔴 متوقف'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-green-600">{sys.uptime}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{sys.lastCheck}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">تفاصيل</button>
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
