'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    multiSigThreshold: 2,
    largeTransactionLimit: 100000,
    autoApprovalLimit: 1000,
    auditRetention: 365,
    blockConfirmations: 3,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-600 hover:text-slate-800">← الرئيسية</Link>
            <h1 className="text-2xl font-bold text-gray-800">⚙️ إعدادات النظام</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Smart Contract Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📜 إعدادات العقود الذكية</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">حد التوقيع المتعدد (Multi-Sig)</div>
                  <div className="text-sm text-gray-600">عدد التوقيعات المطلوبة للمعاملات الكبيرة</div>
                </div>
                <input type="number" value={settings.multiSigThreshold} onChange={(e) => setSettings({...settings, multiSigThreshold: parseInt(e.target.value)})} className="border rounded-lg px-4 py-2 w-24 text-center" />
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">حد المعاملات الكبيرة ($)</div>
                  <div className="text-sm text-gray-600">المبلغ الذي يتطلب موافقة إضافية</div>
                </div>
                <input type="number" value={settings.largeTransactionLimit} onChange={(e) => setSettings({...settings, largeTransactionLimit: parseInt(e.target.value)})} className="border rounded-lg px-4 py-2 w-32 text-center" />
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">حد الموافقة التلقائية ($)</div>
                  <div className="text-sm text-gray-600">المعاملات تحت هذا المبلغ لا تحتاج موافقة</div>
                </div>
                <input type="number" value={settings.autoApprovalLimit} onChange={(e) => setSettings({...settings, autoApprovalLimit: parseInt(e.target.value)})} className="border rounded-lg px-4 py-2 w-32 text-center" />
              </div>
            </div>
          </div>

          {/* Blockchain Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 إعدادات البلوكشين</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">عدد التأكيدات المطلوبة</div>
                  <div className="text-sm text-gray-600">Block confirmations قبل اعتماد المعاملة</div>
                </div>
                <input type="number" value={settings.blockConfirmations} onChange={(e) => setSettings({...settings, blockConfirmations: parseInt(e.target.value)})} className="border rounded-lg px-4 py-2 w-24 text-center" />
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">فترة الاحتفاظ بسجلات التدقيق (أيام)</div>
                  <div className="text-sm text-gray-600">مدة الاحتفاظ بالسجلات على البلوكشين</div>
                </div>
                <input type="number" value={settings.auditRetention} onChange={(e) => setSettings({...settings, auditRetention: parseInt(e.target.value)})} className="border rounded-lg px-4 py-2 w-24 text-center" />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-red-800 mb-4">⚠️ منطقة الخطر</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">إعادة تعيين جميع الأدوار</div>
                  <div className="text-sm text-gray-600">إزالة جميع صلاحيات المستخدمين</div>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">تنفيذ</button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">إيقاف العقود الذكية</div>
                  <div className="text-sm text-gray-600">تجميد جميع العمليات مؤقتاً</div>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">تنفيذ</button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {saving ? '⏳ جاري الحفظ...' : '💾 حفظ الإعدادات على البلوكشين'}
          </button>
        </div>
      </main>
    </div>
  );
}
