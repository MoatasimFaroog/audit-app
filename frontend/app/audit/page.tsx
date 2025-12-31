'use client';

import Link from 'next/link';
import { useState } from 'react';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  module: string;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
  txHash: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    if (selectedRisk !== 'all' && log.riskLevel !== selectedRisk) return false;
    if (selectedModule !== 'all' && log.module !== selectedModule) return false;
    return true;
  });

  const highRiskCount = logs.filter(l => l.riskLevel === 'high').length;
  const mediumRiskCount = logs.filter(l => l.riskLevel === 'medium').length;

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
              <h1 className="text-2xl font-bold text-gray-800">🔍 Audit & Compliance</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
            <div className="text-gray-600">Total Audit Logs</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
            <div className="text-gray-600">High Risk Events</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🔶</div>
            <div className="text-2xl font-bold text-yellow-600">{mediumRiskCount}</div>
            <div className="text-gray-600">Medium Risk Events</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-gray-600">Blockchain Verified</div>
          </div>
        </div>

        {/* Anomaly Detection Alert */}
        {highRiskCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🚨</span>
              <div>
                <h4 className="font-bold text-red-800">Anomaly Detected</h4>
                <p className="text-red-700">{highRiskCount} high-risk event(s) require immediate attention</p>
              </div>
              <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select 
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
          <select 
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            <option value="all">All Modules</option>
            <option value="Accounting">Accounting</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Auth">Authentication</option>
          </select>
          <Link href="/reports" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Export Report
          </Link>
          <Link href="/reports" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Generate Compliance Report
          </Link>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-bold">Audit Trail (Immutable Blockchain Records)</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TX Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className={`hover:bg-gray-50 ${log.riskLevel === 'high' ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium">{log.action}</td>
                  <td className="px-6 py-4 font-mono text-sm text-indigo-600">{log.user}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      log.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      log.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {log.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{log.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
