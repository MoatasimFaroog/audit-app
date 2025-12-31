'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  walletAddress: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [showAddEmployee, setShowAddEmployee] = useState(false);

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
              <h1 className="text-2xl font-bold text-gray-800">👥 HR Management</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">👤</div>
            <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
            <div className="text-gray-600">Total Employees</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold text-green-600">4</div>
            <div className="text-gray-600">Departments</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">💵</div>
            <div className="text-2xl font-bold text-purple-600">$32,000</div>
            <div className="text-gray-600">Monthly Payroll</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-bold text-indigo-600">100%</div>
            <div className="text-gray-600">Wallet Linked</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowAddEmployee(!showAddEmployee)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Employee
          </button>
          <Link href="/payroll" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Process Payroll
          </Link>
          <Link href="/reports" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Attendance Report
          </Link>
        </div>

        {/* Add Employee Form */}
        {showAddEmployee && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Add New Employee</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Full Name" className="border rounded-lg px-4 py-2" />
              <input type="text" placeholder="Position" className="border rounded-lg px-4 py-2" />
              <select className="border rounded-lg px-4 py-2">
                <option>Engineering</option>
                <option>Product</option>
                <option>Finance</option>
                <option>HR</option>
                <option>Sales</option>
              </select>
              <input type="number" placeholder="Salary" className="border rounded-lg px-4 py-2" />
              <input type="text" placeholder="Wallet Address (0x...)" className="border rounded-lg px-4 py-2" />
              <input type="date" className="border rounded-lg px-4 py-2" />
            </div>
            <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Register on Blockchain
            </button>
          </div>
        )}

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{emp.name}</h4>
                  <p className="text-sm text-gray-600">{emp.position}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{emp.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary:</span>
                  <span className="font-medium text-green-600">${emp.salary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Join Date:</span>
                  <span className="font-medium">{emp.joinDate}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-gray-600 text-xs">Wallet:</span>
                  <div className="font-mono text-xs text-indigo-600">{emp.walletAddress}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">
                  Edit
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200">
                  Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
