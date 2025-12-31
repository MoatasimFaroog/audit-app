'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Transaction {
  id: string;
  hash: string;
  type: string;
  from: string;
  to: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
  block: number;
  gasUsed: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', hash: '0xabc123...def456', type: 'Journal Entry', from: '0x1234...5678', to: 'Contract', amount: 5000, status: 'confirmed', timestamp: '2024-12-29 14:32:15', block: 156, gasUsed: '21,000' },
    { id: '2', hash: '0xbcd234...efg567', type: 'Payment', from: '0x2345...6789', to: '0x8765...4321', amount: 15000, status: 'confirmed', timestamp: '2024-12-29 14:28:03', block: 155, gasUsed: '42,000' },
    { id: '3', hash: '0xcde345...fgh678', type: 'Approval', from: '0x3456...7890', to: 'MultiSig', amount: 0, status: 'pending', timestamp: '2024-12-29 13:45:22', block: 0, gasUsed: '-' },
    { id: '4', hash: '0xdef456...ghi789', type: 'Payroll', from: 'HR Contract', to: '0x4567...8901', amount: 8500, status: 'confirmed', timestamp: '2024-12-29 12:15:00', block: 154, gasUsed: '65,000' },
    { id: '5', hash: '0xefg567...hij890', type: 'Invoice', from: '0x5678...9012', to: 'Sales Contract', amount: 22000, status: 'pending', timestamp: '2024-12-29 11:30:45', block: 0, gasUsed: '-' },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredTx = filter === 'all' ? transactions : transactions.filter(tx => tx.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">📜 View Transactions</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-blue-600">{transactions.length}</div>
            <div className="text-gray-600">Total Transactions</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{transactions.filter(t => t.status === 'confirmed').length}</div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">{transactions.filter(t => t.status === 'pending').length}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-purple-600">${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
            <div className="text-gray-600">Total Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Pending
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TX Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Block</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-indigo-600">{tx.hash}</td>
                  <td className="px-6 py-4">{tx.type}</td>
                  <td className="px-6 py-4 font-mono text-sm">{tx.from}</td>
                  <td className="px-6 py-4 font-mono text-sm">{tx.to}</td>
                  <td className="px-6 py-4 text-right font-semibold">{tx.amount > 0 ? `$${tx.amount.toLocaleString()}` : '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      tx.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{tx.block > 0 ? `#${tx.block}` : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
