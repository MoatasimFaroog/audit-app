'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CreateTransactionPage() {
  const [txType, setTxType] = useState('journal');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    debitAccount: 'Assets',
    creditAccount: 'Revenue',
    recipient: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Transaction Submitted!</h2>
          <p className="text-gray-600 mb-4">Your transaction has been submitted to the blockchain and is awaiting confirmation.</p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600">Transaction Hash:</div>
            <div className="font-mono text-indigo-600">0x{Math.random().toString(16).slice(2, 18)}...</div>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
              Dashboard
            </Link>
            <button 
              onClick={() => {setSubmitted(false); setFormData({description: '', amount: '', debitAccount: 'Assets', creditAccount: 'Revenue', recipient: '', notes: ''});}}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              New Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">➕ Create Transaction</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Transaction Type Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Select Transaction Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'journal', icon: '📝', label: 'Journal Entry' },
              { id: 'payment', icon: '💸', label: 'Payment' },
              { id: 'invoice', icon: '📄', label: 'Invoice' },
              { id: 'transfer', icon: '🔄', label: 'Transfer' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setTxType(type.id)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  txType === type.id 
                    ? 'border-indigo-600 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Transaction Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter transaction description"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              {txType === 'payment' || txType === 'transfer' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Wallet</label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                    placeholder="0x..."
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              ) : null}
            </div>

            {txType === 'journal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Debit Account</label>
                  <select
                    value={formData.debitAccount}
                    onChange={(e) => setFormData({...formData, debitAccount: e.target.value})}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="Assets">Assets</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Accounts Receivable">Accounts Receivable</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Account</label>
                  <select
                    value={formData.creditAccount}
                    onChange={(e) => setFormData({...formData, creditAccount: e.target.value})}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="Revenue">Revenue</option>
                    <option value="Liabilities">Liabilities</option>
                    <option value="Accounts Payable">Accounts Payable</option>
                    <option value="Equity">Equity</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes..."
                className="w-full border rounded-lg px-4 py-2 h-24"
              />
            </div>
          </div>
        </div>

        {/* Blockchain Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">🔗 Blockchain Transaction</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• This transaction will be permanently recorded on the blockchain</li>
            <li>• You will be asked to sign with your wallet (MetaMask)</li>
            <li>• Multi-signature approval may be required for large amounts</li>
            <li>• Gas fees will be calculated automatically</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.description || !formData.amount}
          className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Submitting to Blockchain...
            </span>
          ) : (
            'Sign & Submit Transaction'
          )}
        </button>
      </main>
    </div>
  );
}
