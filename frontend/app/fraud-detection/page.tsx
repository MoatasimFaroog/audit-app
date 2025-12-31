'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  amount: number;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  user: string;
  txHash: string;
  aiConfidence: number;
}

export default function FraudDetectionPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const runAIScan = async () => {
    setScanning(true);
    setScanProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 300));
      setScanProgress(i);
    }
    
    setScanning(false);
  };

  const updateStatus = (id: string, status: Alert['status']) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status } : a));
    setSelectedAlert(null);
  };

  const highAlerts = alerts.filter(a => a.type === 'high' && a.status !== 'resolved' && a.status !== 'false_positive').length;
  const mediumAlerts = alerts.filter(a => a.type === 'medium' && a.status !== 'resolved' && a.status !== 'false_positive').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-red-600 hover:text-red-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">🛡️ نظام كشف الاحتيال بالذكاء الاصطناعي</h1>
            </div>
            <button
              onClick={runAIScan}
              disabled={scanning}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              {scanning ? `جاري الفحص... ${scanProgress}%` : '🔍 فحص شامل'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{highAlerts}</div>
                <div className="text-gray-600">تنبيهات عالية الخطورة</div>
              </div>
              <div className="text-4xl">🚨</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{mediumAlerts}</div>
                <div className="text-gray-600">تنبيهات متوسطة</div>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">1,247</div>
                <div className="text-gray-600">معاملات آمنة</div>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">99.6%</div>
                <div className="text-gray-600">دقة الكشف</div>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">🧠 تحليلات الذكاء الاصطناعي</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="font-semibold mb-2">نمط المخاطر</div>
              <div className="text-sm">زيادة في المعاملات الليلية بنسبة 40% مقارنة بالأسبوع الماضي</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="font-semibold mb-2">توقعات</div>
              <div className="text-sm">احتمال 23% لمحاولة احتيال خلال الأيام الـ7 القادمة</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="font-semibold mb-2">توصية</div>
              <div className="text-sm">تفعيل التحقق الثنائي لجميع المعاملات فوق $50,000</div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">🚨 التنبيهات النشطة</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الخطورة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التنبيه</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">ثقة AI</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <tr key={alert.id} className={`hover:bg-gray-50 ${alert.type === 'high' ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      alert.type === 'high' ? 'bg-red-100 text-red-800' :
                      alert.type === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.type === 'high' ? '🔴 عالي' : alert.type === 'medium' ? '🟡 متوسط' : '🟢 منخفض'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{alert.title}</div>
                    <div className="text-sm text-gray-600">{alert.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{alert.timestamp}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {alert.amount > 0 ? `$${alert.amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${
                          alert.aiConfidence >= 80 ? 'bg-red-500' :
                          alert.aiConfidence >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} style={{ width: `${alert.aiConfidence}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{alert.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      alert.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      alert.status === 'investigating' ? 'bg-purple-100 text-purple-800' :
                      alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.status === 'new' ? 'جديد' :
                       alert.status === 'investigating' ? 'قيد التحقيق' :
                       alert.status === 'resolved' ? 'تم الحل' : 'إنذار كاذب'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-lg font-bold mb-4">🔍 تفاصيل التنبيه: {selectedAlert.id}</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">النوع:</span><span className="font-semibold">{selectedAlert.title}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">الوصف:</span><span>{selectedAlert.description}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">المستخدم:</span><span className="font-mono">{selectedAlert.user}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">TX Hash:</span><span className="font-mono text-indigo-600">{selectedAlert.txHash}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">ثقة AI:</span><span className="font-bold">{selectedAlert.aiConfidence}%</span></div>
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={() => updateStatus(selectedAlert.id, 'investigating')} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">تحقيق</button>
                <button onClick={() => updateStatus(selectedAlert.id, 'resolved')} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">تم الحل</button>
                <button onClick={() => updateStatus(selectedAlert.id, 'false_positive')} className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700">إنذار كاذب</button>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="mt-3 w-full bg-gray-200 text-gray-700 py-2 rounded-lg">إغلاق</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
