'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AIAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">📈 التحليلات التنبؤية بالذكاء الاصطناعي</h1>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg ${timeRange === range ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  {range === 'week' ? 'أسبوع' : range === 'month' ? 'شهر' : range === 'quarter' ? 'ربع سنة' : 'سنة'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* AI Predictions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">💰 توقع الإيرادات</h3>
              <span className="text-green-500 text-sm">↑ 15%</span>
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">$6.2M</div>
            <div className="text-sm text-gray-600">المتوقع للربع القادم</div>
            <div className="mt-4 bg-green-100 rounded-lg p-3">
              <div className="text-xs text-green-800">🤖 AI Insight: بناءً على الاتجاهات الحالية، الإيرادات ستتجاوز التوقعات بنسبة 8%</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">💸 توقع التدفق النقدي</h3>
              <span className="text-yellow-500 text-sm">→ مستقر</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">$890K</div>
            <div className="text-sm text-gray-600">الرصيد المتوقع نهاية الشهر</div>
            <div className="mt-4 bg-yellow-100 rounded-lg p-3">
              <div className="text-xs text-yellow-800">⚠️ AI Warning: احتمال نقص سيولة بنسبة 12% في أسبوع 3</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">📊 توقع المصروفات</h3>
              <span className="text-red-500 text-sm">↑ 8%</span>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">$2.1M</div>
            <div className="text-sm text-gray-600">المتوقع للربع القادم</div>
            <div className="mt-4 bg-blue-100 rounded-lg p-3">
              <div className="text-xs text-blue-800">💡 AI Tip: يمكن تقليل 15% من تكاليف التشغيل بتحسين العمليات</div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">📉 تحليل الاتجاهات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">📈</div>
                  <div>
                    <div className="font-semibold">نمو المبيعات</div>
                    <div className="text-sm text-gray-600">آخر 6 أشهر</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold">+24.5%</div>
                  <div className="text-xs text-gray-500">أعلى من المتوسط</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">👥</div>
                  <div>
                    <div className="font-semibold">تكلفة اكتساب العميل</div>
                    <div className="text-sm text-gray-600">آخر 6 أشهر</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 font-bold">-12%</div>
                  <div className="text-xs text-gray-500">تحسن ملحوظ</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">💎</div>
                  <div>
                    <div className="font-semibold">هامش الربح</div>
                    <div className="text-sm text-gray-600">آخر 6 أشهر</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-600 font-bold">28.3%</div>
                  <div className="text-xs text-gray-500">مستقر</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">🎯 توصيات الذكاء الاصطناعي</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="font-semibold text-green-800">زيادة الاستثمار في التسويق الرقمي</div>
                <div className="text-sm text-green-700 mt-1">ROI المتوقع: 340% | الثقة: 87%</div>
                <button className="mt-2 text-green-600 text-sm font-semibold">تنفيذ →</button>
              </div>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="font-semibold text-blue-800">إعادة التفاوض مع الموردين الرئيسيين</div>
                <div className="text-sm text-blue-700 mt-1">وفر متوقع: $45,000/شهر | الثقة: 78%</div>
                <button className="mt-2 text-blue-600 text-sm font-semibold">تنفيذ →</button>
              </div>
              <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <div className="font-semibold text-purple-800">أتمتة عمليات الفوترة</div>
                <div className="text-sm text-purple-700 mt-1">توفير وقت: 20 ساعة/أسبوع | الثقة: 92%</div>
                <button className="mt-2 text-purple-600 text-sm font-semibold">تنفيذ →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">🔍 كشف الشذوذ التلقائي</h3>
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {analyzing ? '⏳ جاري التحليل...' : '🔄 تحليل جديد'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-semibold text-green-800">1,234</div>
              <div className="text-sm text-green-600">معاملات طبيعية</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="font-semibold text-yellow-800">8</div>
              <div className="text-sm text-yellow-600">تحتاج مراجعة</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🚨</div>
              <div className="font-semibold text-red-800">2</div>
              <div className="text-sm text-red-600">شذوذ مكتشف</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-blue-800">99.2%</div>
              <div className="text-sm text-blue-600">دقة الكشف</div>
            </div>
          </div>
        </div>

        {/* Auto Classification */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="font-bold text-xl mb-4">🏷️ التصنيف التلقائي للمعاملات</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">156</div>
              <div className="text-violet-200">معاملات تم تصنيفها اليوم</div>
              <div className="mt-2 text-sm">دقة التصنيف: 97.8%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">12</div>
              <div className="text-violet-200">فئات محاسبية مستخدمة</div>
              <div className="mt-2 text-sm">الأكثر شيوعاً: المصروفات التشغيلية</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">3 ثوانٍ</div>
              <div className="text-violet-200">متوسط وقت التصنيف</div>
              <div className="mt-2 text-sm">توفير 45 دقيقة يومياً</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
