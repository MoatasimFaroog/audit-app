'use client';

import Link from 'next/link';
import { useState } from 'react';

interface User {
  id: string;
  wallet: string;
  name: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
}

export default function RolesPage() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', wallet: '0x1234...5678', name: 'أحمد محمد', role: 'مدير مالي', status: 'active' },
    { id: '2', wallet: '0x2345...6789', name: 'سارة علي', role: 'محاسب', status: 'active' },
    { id: '3', wallet: '0x3456...7890', name: 'محمد إبراهيم', role: 'مدير مبيعات', status: 'active' },
    { id: '4', wallet: '0x4567...8901', name: 'فاطمة عمر', role: 'مدخل بيانات', status: 'pending' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const roles = ['الرئيس التنفيذي', 'مدير مالي', 'مدير مبيعات', 'مدير مشتريات', 'مدير HR', 'مدير IT', 'مدير مستودع', 'محاسب', 'مدخل بيانات'];

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800">← الرئيسية</Link>
            <h1 className="text-2xl font-bold text-gray-800">🔐 إدارة الأدوار والصلاحيات</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">👥 المستخدمين والأدوار</h3>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ إضافة مستخدم</button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المحفظة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الدور</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-indigo-600">{user.wallet}</td>
                  <td className="px-6 py-4 font-semibold">{user.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status === 'active' ? 'نشط' : user.status === 'pending' ? 'معلق' : 'موقوف'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => { setSelectedUser(user); setShowModal(true); }} className="text-indigo-600 hover:text-indigo-800 mx-2">تغيير الدور</button>
                    <button className="text-red-600 hover:text-red-800 mx-2">إيقاف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">تغيير دور: {selectedUser.name}</h3>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button key={role} onClick={() => handleRoleChange(selectedUser.id, role)} className={`w-full p-3 rounded-lg text-right ${selectedUser.role === role ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    {role}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowModal(false)} className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-lg">إلغاء</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
