'use client';

import Link from 'next/link';
import { useState } from 'react';

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export default function LeavesPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: 'L-001', employee: 'محمد إبراهيم', type: 'إجازة سنوية', startDate: '2025-01-05', endDate: '2025-01-10', days: 5, status: 'pending', reason: 'إجازة عائلية' },
    { id: 'L-002', employee: 'سارة علي', type: 'إجازة مرضية', startDate: '2024-12-28', endDate: '2024-12-30', days: 2, status: 'approved', reason: 'مراجعة طبية' },
    { id: 'L-003', employee: 'أحمد محمد', type: 'إجازة طارئة', startDate: '2025-01-02', endDate: '2025-01-03', days: 1, status: 'pending', reason: 'ظروف شخصية' },
  ]);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/hr-manager" className="text-green-600 hover:text-green-800">← الموارد البشرية</Link>
            <h1 className="text-2xl font-bold text-gray-800">🏖️ إدارة الإجازات</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="text-gray-600">طلبات معلقة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'approved').length}</div>
            <div className="text-gray-600">موافق عليها</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-600">{requests.filter(r => r.status === 'rejected').length}</div>
            <div className="text-gray-600">مرفوضة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">{requests.reduce((sum, r) => sum + r.days, 0)}</div>
            <div className="text-gray-600">إجمالي الأيام</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">📋 طلبات الإجازات</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموظف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">من</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">إلى</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الأيام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السبب</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{req.employee}</td>
                  <td className="px-6 py-4">{req.type}</td>
                  <td className="px-6 py-4 text-center">{req.startDate}</td>
                  <td className="px-6 py-4 text-center">{req.endDate}</td>
                  <td className="px-6 py-4 text-center font-bold">{req.days}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.reason}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${req.status === 'approved' ? 'bg-green-100 text-green-800' : req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {req.status === 'approved' ? 'موافق' : req.status === 'pending' ? 'معلق' : 'مرفوض'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {req.status === 'pending' && (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleAction(req.id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded text-sm">موافقة</button>
                        <button onClick={() => handleAction(req.id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm">رفض</button>
                      </div>
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
