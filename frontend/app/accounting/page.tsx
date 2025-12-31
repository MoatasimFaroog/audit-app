'use client';

import Link from 'next/link';
import { useState } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  account: string;
  status: 'pending' | 'confirmed' | 'rejected';
  txHash: string;
}

export default function AccountingPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ description: '', debit: '', credit: '', account: 'Assets' });

  const handleAddEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: newEntry.description,
      debit: parseFloat(newEntry.debit) || 0,
      credit: parseFloat(newEntry.credit) || 0,
      account: newEntry.account,
      status: 'pending',
      txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...'
    };
    setEntries([entry, ...entries]);
    setNewEntry({ description: '', debit: '', credit: '', account: 'Assets' });
    setShowNewEntry(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">📊 Accounting Module</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-600">$45,230</div>
            <div className="text-gray-600">Total Assets</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">📉</div>
            <div className="text-2xl font-bold text-red-600">$12,450</div>
            <div className="text-gray-600">Total Liabilities</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-blue-600">$32,780</div>
            <div className="text-gray-600">Net Equity</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-gray-600">Blockchain Entries</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowNewEntry(!showNewEntry)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + New Journal Entry
          </button>
          <Link href="/reports" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Generate Report
          </Link>
          <Link href="/reports" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Trial Balance
          </Link>
        </div>

        {/* New Entry Form */}
        {showNewEntry && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">New Journal Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Description"
                value={newEntry.description}
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="number"
                placeholder="Debit Amount"
                value={newEntry.debit}
                onChange={(e) => setNewEntry({...newEntry, debit: e.target.value})}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="number"
                placeholder="Credit Amount"
                value={newEntry.credit}
                onChange={(e) => setNewEntry({...newEntry, credit: e.target.value})}
                className="border rounded-lg px-4 py-2"
              />
              <select
                value={newEntry.account}
                onChange={(e) => setNewEntry({...newEntry, account: e.target.value})}
                className="border rounded-lg px-4 py-2"
              >
                <option value="Assets">Assets</option>
                <option value="Liabilities">Liabilities</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expenses">Expenses</option>
              </select>
            </div>
            <button 
              onClick={handleAddEntry}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Submit to Blockchain
            </button>
          </div>
        )}

        {/* Journal Entries Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">Journal Entries (Blockchain Verified)</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TX Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.date}</td>
                  <td className="px-6 py-4 text-sm">{entry.description}</td>
                  <td className="px-6 py-4 text-sm">{entry.account}</td>
                  <td className="px-6 py-4 text-sm text-right text-red-600">{entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : '-'}</td>
                  <td className="px-6 py-4 text-sm text-right text-green-600">{entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      entry.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-indigo-600">{entry.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
