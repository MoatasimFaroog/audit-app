'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PayrollRecord {
  id: string;
  employee: string;
  wallet: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([
    { id: 'P-001', employee: 'أحمد محمد', wallet: '0x1234...5678', baseSalary: 8500, allowances: 1500, deductions: 500, netSalary: 9500, status: 'pending' },
    { id: 'P-002', employee: 'سارة علي', wallet: '0x2345...6789', baseSalary: 9200, allowances: 1800, deductions: 600, netSalary: 10400, status: 'pending' },
    { id: 'P-003', employee: 'محمد إبراهيم', wallet: '0x3456...7890', baseSalary: 6500, allowances: 800, deductions: 300, netSalary: 7000, status: 'paid' },
    { id: 'P-004', employee: 'فاطمة عمر', wallet: '0x4567...8901', baseSalary: 7800, allowances: 1200, deductions: 400, netSalary: 8600, status: 'processed' },
  ]);

  const [processing, setProcessing] = useState(false);

  const handleProcessAll = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setPayroll(payroll.map(p => ({ ...p, status: 'paid' as const })));
    setProcessing(false);
  };

  const totalPayroll = payroll.reduce((sum, p) => sum + p.netSalary, 0);
  const pendingPayroll = payroll.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/hr-manager" className="text-green-600 hover:text-green-800">← الموارد البشرية</Link>
            <h1 className="text-2xl font-bold text-gray-800">💵 معالجة الرواتب</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">${totalPayroll.toLocaleString()}</div>
            <div className="text-gray-600">إجمالي الرواتب</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">${pendingPayroll.toLocaleString()}</div>
            <div className="text-gray-600">قيد المعالجة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">{payroll.length}</div>
            <div className="text-gray-600">عدد الموظفين</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-600">ديسمبر 2024</div>
            <div className="text-gray-600">فترة الرواتب</div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleProcessAll}
            disabled={processing}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {processing ? '⏳ جاري المعالجة...' : '💳 معالجة جميع الرواتب'}
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">📊 تقرير الرواتب</button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموظف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المحفظة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الراتب الأساسي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">البدلات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الخصومات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصافي</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payroll.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{record.employee}</td>
                  <td className="px-6 py-4 font-mono text-indigo-600 text-sm">{record.wallet}</td>
                  <td className="px-6 py-4">${record.baseSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-green-600">+${record.allowances.toLocaleString()}</td>
                  <td className="px-6 py-4 text-red-600">-${record.deductions.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold">${record.netSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${record.status === 'paid' ? 'bg-green-100 text-green-800' : record.status === 'processed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {record.status === 'paid' ? 'تم الدفع' : record.status === 'processed' ? 'تمت المعالجة' : 'معلق'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {record.status !== 'paid' && (
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">دفع</button>
                    )}
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
