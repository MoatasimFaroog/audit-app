'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  txHash: string;
  smartContract: string;
}

export default function SalesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

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
              <h1 className="text-2xl font-bold text-gray-800">💼 Sales & Invoicing</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</div>
            <div className="text-gray-600">Pending Payments</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</div>
            <div className="text-gray-600">Overdue</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-blue-600">{invoices.length}</div>
            <div className="text-gray-600">Smart Contracts</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowNewInvoice(!showNewInvoice)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Create Invoice
          </button>
          <Link href="/settings" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Deploy Smart Contract
          </Link>
          <Link href="/reports" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Sales Report
          </Link>
        </div>

        {/* New Invoice Form */}
        {showNewInvoice && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Create New Invoice (Smart Contract)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="Client Name" className="border rounded-lg px-4 py-2" />
              <input type="text" placeholder="Client Wallet (0x...)" className="border rounded-lg px-4 py-2" />
              <input type="number" placeholder="Amount ($)" className="border rounded-lg px-4 py-2" />
              <input type="date" placeholder="Due Date" className="border rounded-lg px-4 py-2" />
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Smart Contract Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Auto-execute payment on due date</li>
                <li>✓ Late fee calculation (2% per week)</li>
                <li>✓ Escrow protection for both parties</li>
                <li>✓ Immutable payment record on blockchain</li>
              </ul>
            </div>
            <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Deploy Invoice Contract
            </button>
          </div>
        )}

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">Invoices & Smart Contracts</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Contract</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TX Hash</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{invoice.id}</td>
                  <td className="px-6 py-4">{invoice.client}</td>
                  <td className="px-6 py-4 text-right font-semibold">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">{invoice.dueDate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded ${
                      invoice.smartContract === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {invoice.smartContract}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-indigo-600">{invoice.txHash}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm">View</button>
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
