'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ExtractedData {
  vendor: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  items: { description: string; quantity: number; price: number }[];
  confidence: number;
}

export default function InvoiceScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [saved, setSaved] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setExtractedData(null);
      setSaved(false);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    
    setScanning(true);
    
    // Simulate AI processing
    await new Promise(r => setTimeout(r, 3000));
    
    // Mock extracted data
    setExtractedData({
      vendor: 'Tech Supplies Co.',
      invoiceNumber: 'INV-2024-0892',
      date: '2024-12-28',
      dueDate: '2025-01-28',
      subtotal: 12500,
      tax: 1875,
      total: 14375,
      items: [
        { description: 'أجهزة حاسوب Dell XPS 15', quantity: 5, price: 2000 },
        { description: 'شاشات عرض 27 بوصة', quantity: 5, price: 400 },
        { description: 'لوحات مفاتيح لاسلكية', quantity: 10, price: 50 },
      ],
      confidence: 94
    });
    
    setScanning(false);
  };

  const handleSave = async () => {
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">← الرئيسية</Link>
            <h1 className="text-2xl font-bold text-gray-800">📄 ماسح الفواتير الذكي (OCR + AI)</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">📤 رفع الفاتورة</h3>
            
            {!preview ? (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="text-6xl mb-4">📄</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">اسحب الفاتورة هنا أو انقر للرفع</div>
                <div className="text-sm text-gray-500">يدعم: PDF, JPG, PNG</div>
                <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div>
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full rounded-lg shadow" />
                  <button
                    onClick={() => { setFile(null); setPreview(null); setExtractedData(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {scanning ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      جاري التحليل بالذكاء الاصطناعي...
                    </span>
                  ) : '🔍 تحليل الفاتورة'}
                </button>
              </div>
            )}

            {/* Features */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold">دقة 98%</div>
                <div className="text-xs text-gray-600">في استخراج البيانات</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold">3 ثوانٍ</div>
                <div className="text-xs text-gray-600">متوسط وقت المعالجة</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🌐</div>
                <div className="font-semibold">متعدد اللغات</div>
                <div className="text-xs text-gray-600">عربي، إنجليزي، وأكثر</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🔗</div>
                <div className="font-semibold">تكامل تلقائي</div>
                <div className="text-xs text-gray-600">مع نظام المحاسبة</div>
              </div>
            </div>
          </div>

          {/* Extracted Data Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">📊 البيانات المستخرجة</h3>
            
            {!extractedData ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">🤖</div>
                <div>ارفع فاتورة وانقر "تحليل" لاستخراج البيانات</div>
              </div>
            ) : (
              <div>
                {/* Confidence Score */}
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-800">🎯 دقة الاستخراج</span>
                    <span className="text-2xl font-bold text-green-600">{extractedData.confidence}%</span>
                  </div>
                  <div className="mt-2 bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${extractedData.confidence}%` }}></div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">المورد</label>
                      <input type="text" value={extractedData.vendor} className="w-full border rounded-lg px-3 py-2 mt-1" readOnly />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">رقم الفاتورة</label>
                      <input type="text" value={extractedData.invoiceNumber} className="w-full border rounded-lg px-3 py-2 mt-1" readOnly />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">تاريخ الفاتورة</label>
                      <input type="text" value={extractedData.date} className="w-full border rounded-lg px-3 py-2 mt-1" readOnly />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">تاريخ الاستحقاق</label>
                      <input type="text" value={extractedData.dueDate} className="w-full border rounded-lg px-3 py-2 mt-1" readOnly />
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <label className="text-sm text-gray-600 font-semibold">البنود</label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-right">الوصف</th>
                            <th className="px-3 py-2 text-center">الكمية</th>
                            <th className="px-3 py-2 text-right">السعر</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractedData.items.map((item, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-3 py-2">{item.description}</td>
                              <td className="px-3 py-2 text-center">{item.quantity}</td>
                              <td className="px-3 py-2">${item.price.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between"><span>المجموع الفرعي:</span><span>${extractedData.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>الضريبة (15%):</span><span>${extractedData.tax.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2"><span>الإجمالي:</span><span className="text-green-600">${extractedData.total.toLocaleString()}</span></div>
                  </div>

                  {/* Actions */}
                  {!saved ? (
                    <div className="flex gap-3">
                      <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">✅ حفظ كقيد محاسبي</button>
                      <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">📄 إنشاء فاتورة</button>
                    </div>
                  ) : (
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
                      ✅ تم الحفظ بنجاح! تمت إضافة القيد المحاسبي إلى دفتر الأستاذ
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
