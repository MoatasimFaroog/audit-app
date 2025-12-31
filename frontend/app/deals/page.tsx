'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Deal {
  id: string;
  client: string;
  value: number;
  stage: 'lead' | 'contact' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  owner: string;
  nextAction: string;
  lastContact: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([
    { id: 'D-001', client: 'Global Tech Inc.', value: 150000, stage: 'proposal', probability: 75, owner: 'أحمد', nextAction: 'إرسال عرض سعر نهائي', lastContact: '2024-12-28' },
    { id: 'D-002', client: 'Innovation Labs', value: 85000, stage: 'negotiation', probability: 50, owner: 'سارة', nextAction: 'متابعة هاتفية', lastContact: '2024-12-25' },
    { id: 'D-003', client: 'Digital Solutions', value: 220000, stage: 'lead', probability: 25, owner: 'محمد', nextAction: 'جدولة اجتماع', lastContact: '2024-12-29' },
    { id: 'D-004', client: 'Smart Systems', value: 95000, stage: 'closed_won', probability: 100, owner: 'فاطمة', nextAction: '-', lastContact: '2024-12-27' },
  ]);

  const [showAdd, setShowAdd] = useState(false);

  const stages = {
    lead: { label: 'فرصة جديدة', color: 'bg-gray-100 text-gray-800' },
    contact: { label: 'تواصل أولي', color: 'bg-blue-100 text-blue-800' },
    proposal: { label: 'عرض سعر', color: 'bg-purple-100 text-purple-800' },
    negotiation: { label: 'مفاوضة', color: 'bg-yellow-100 text-yellow-800' },
    closed_won: { label: 'فازت', color: 'bg-green-100 text-green-800' },
    closed_lost: { label: 'خسرت', color: 'bg-red-100 text-red-800' },
  };

  const moveStage = (dealId: string, newStage: Deal['stage']) => {
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/sales-manager" className="text-blue-600 hover:text-blue-800">← المبيعات</Link>
            <h1 className="text-2xl font-bold text-gray-800">🤝 إدارة الصفقات</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">+ صفقة جديدة</button>
        </div>

        {showAdd && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">إضافة صفقة جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="اسم العميل" className="border rounded-lg px-4 py-2" />
              <input type="number" placeholder="قيمة الصفقة ($)" className="border rounded-lg px-4 py-2" />
              <select className="border rounded-lg px-4 py-2">
                <option>أحمد</option>
                <option>سارة</option>
                <option>محمد</option>
                <option>فاطمة</option>
              </select>
              <button className="bg-blue-600 text-white rounded-lg hover:bg-blue-700">إضافة</button>
            </div>
          </div>
        )}

        {/* Kanban-style Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {(['lead', 'contact', 'proposal', 'negotiation', 'closed_won'] as const).map((stage) => (
            <div key={stage} className="bg-gray-100 rounded-lg p-4">
              <h3 className={`font-bold mb-4 px-3 py-1 rounded-lg text-center ${stages[stage].color}`}>
                {stages[stage].label}
              </h3>
              <div className="space-y-3">
                {deals.filter(d => d.stage === stage).map((deal) => (
                  <div key={deal.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="font-semibold text-gray-800">{deal.client}</div>
                    <div className="text-lg font-bold text-green-600">${deal.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 mt-2">المسؤول: {deal.owner}</div>
                    <div className="text-xs text-gray-500 mt-1">{deal.nextAction}</div>
                    {stage !== 'closed_won' && (
                      <button 
                        onClick={() => {
                          const nextStages: Record<string, Deal['stage']> = { lead: 'contact', contact: 'proposal', proposal: 'negotiation', negotiation: 'closed_won' };
                          moveStage(deal.id, nextStages[stage]);
                        }}
                        className="mt-3 w-full bg-blue-100 text-blue-700 py-1 rounded text-sm hover:bg-blue-200"
                      >
                        نقل للمرحلة التالية →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
