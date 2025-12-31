'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const reports = [
    { id: 'financial', icon: '📊', title: 'التقارير المالية', desc: 'الميزانية العمومية، قائمة الدخل', category: 'مالي' },
    { id: 'trial-balance', icon: '⚖️', title: 'ميزان المراجعة', desc: 'جميع الحسابات والأرصدة', category: 'محاسبة' },
    { id: 'sales', icon: '💼', title: 'تقارير المبيعات', desc: 'أداء المبيعات والفواتير', category: 'مبيعات' },
    { id: 'hr', icon: '👥', title: 'تقارير الموارد البشرية', desc: 'الحضور والرواتب', category: 'HR' },
    { id: 'audit', icon: '🔍', title: 'تقارير التدقيق', desc: 'سجل العمليات والامتثال', category: 'تدقيق' },
    { id: 'procurement', icon: '📦', title: 'تقارير المشتريات', desc: 'أوامر الشراء والموردين', category: 'مشتريات' },
    { id: 'inventory', icon: '🏭', title: 'تقارير المخزون', desc: 'حركة وتقادم المخزون', category: 'مستودع' },
    { id: 'compliance', icon: '✅', title: 'تقارير الامتثال', desc: 'التوافق مع المعايير', category: 'تدقيق' },
  ];

  const handleGenerate = async (reportId: string) => {
    setSelectedReport(reportId);
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800">← الرئيسية</Link>
            <h1 className="text-2xl font-bold text-gray-800">📋 مركز التقارير</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">{report.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{report.desc}</p>
              <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded mb-4">{report.category}</span>
              <button
                onClick={() => handleGenerate(report.id)}
                disabled={generating && selectedReport === report.id}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {generating && selectedReport === report.id ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
              </button>
            </div>
          ))}
        </div>

        {selectedReport && !generating && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">📄 التقرير جاهز</h3>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">⬇️ تحميل PDF</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">📧 إرسال بالبريد</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600">معاينة التقرير ستظهر هنا</p>
              <p className="text-sm text-gray-500 mt-2">TX Hash: 0x{Math.random().toString(16).slice(2, 18)}...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
