'use client';

import Link from 'next/link';
import { useState } from 'react';

interface User {
  id: string;
  walletAddress: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin: string;
}

const availableRoles = [
  { id: 'admin', name: 'مدير النظام', nameEn: 'System Admin', permissions: ['all'] },
  { id: 'ceo', name: 'الرئيس التنفيذي', nameEn: 'CEO', permissions: ['view_all', 'approve', 'reports'] },
  { id: 'cfo', name: 'المدير المالي', nameEn: 'CFO', permissions: ['accounting', 'reports', 'approve_financial'] },
  { id: 'hr_manager', name: 'مدير الموارد البشرية', nameEn: 'HR Manager', permissions: ['hr', 'payroll', 'employees'] },
  { id: 'sales_manager', name: 'مدير المبيعات', nameEn: 'Sales Manager', permissions: ['sales', 'invoices', 'clients'] },
  { id: 'accountant', name: 'محاسب', nameEn: 'Accountant', permissions: ['accounting', 'journal_entries'] },
  { id: 'auditor', name: 'مدقق', nameEn: 'Auditor', permissions: ['audit', 'view_all', 'reports'] },
  { id: 'employee', name: 'موظف', nameEn: 'Employee', permissions: ['view_own'] },
];

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ walletAddress: '', name: '', email: '', role: 'employee' });
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');

  const handleAddUser = () => {
    if (!newUser.walletAddress || !newUser.name) return;
    
    const user: User = {
      id: Date.now().toString(),
      walletAddress: newUser.walletAddress,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: '-'
    };
    
    setUsers([...users, user]);
    setNewUser({ walletAddress: '', name: '', email: '', role: 'employee' });
    setShowAddUser(false);
  };

  const handleUpdateRole = (userId: string, newRole: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">← الرئيسية</Link>
              <h1 className="text-2xl font-bold text-gray-800">⚙️ لوحة إدارة النظام</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            <div className="text-gray-600">إجمالي المستخدمين</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</div>
            <div className="text-gray-600">مستخدمون نشطون</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🔐</div>
            <div className="text-2xl font-bold text-purple-600">{availableRoles.length}</div>
            <div className="text-gray-600">الأدوار المتاحة</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</div>
            <div className="text-gray-600">بانتظار الموافقة</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👥 المستخدمون
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'roles' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔐 الأدوار والصلاحيات
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'permissions' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🛡️ إعدادات الأمان
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">إدارة المستخدمين</h3>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                + إضافة مستخدم
              </button>
            </div>

            {users.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-5xl mb-4">👥</div>
                <p>لا يوجد مستخدمون حالياً</p>
                <p className="text-sm mt-2">انقر على "إضافة مستخدم" لإنشاء مستخدم جديد</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عنوان المحفظة</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الدور</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الحالة</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">آخر دخول</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-indigo-600">{user.walletAddress}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => { setSelectedUser(user); setShowRoleModal(true); }}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200"
                        >
                          {availableRoles.find(r => r.id === user.role)?.name || user.role}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status === 'active' ? 'نشط' : user.status === 'pending' ? 'معلق' : 'غير نشط'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableRoles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-xl">
                    {role.id === 'admin' ? '👑' : role.id === 'ceo' ? '👔' : role.id === 'cfo' ? '💰' : '👤'}
                  </div>
                  <div>
                    <div className="font-bold">{role.name}</div>
                    <div className="text-sm text-gray-500">{role.nameEn}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700">الصلاحيات:</div>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((perm) => (
                      <span key={perm} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {users.filter(u => u.role === role.id).length} مستخدم
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-6">🛡️ إعدادات الأمان</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">التحقق بخطوتين (2FA)</div>
                  <div className="text-sm text-gray-600">إلزام جميع المستخدمين بالتحقق بخطوتين</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">موافقة متعددة التوقيعات</div>
                  <div className="text-sm text-gray-600">طلب أكثر من توقيع للمعاملات الكبيرة</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">تسجيل جميع الأنشطة</div>
                  <div className="text-sm text-gray-600">تسجيل كل الإجراءات على البلوكتشين</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-2">حد المعاملات بدون موافقة</div>
                <div className="flex items-center gap-4">
                  <input type="number" defaultValue="10000" className="border rounded-lg px-4 py-2 w-40" />
                  <span className="text-gray-600">ريال</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">➕ إضافة مستخدم جديد</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المحفظة *</label>
                  <input
                    type="text"
                    value={newUser.walletAddress}
                    onChange={(e) => setNewUser({ ...newUser, walletAddress: e.target.value })}
                    placeholder="0x..."
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="الاسم"
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    {availableRoles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={handleAddUser} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                  إضافة
                </button>
                <button onClick={() => setShowAddUser(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Role Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">🔐 تغيير دور: {selectedUser.name}</h3>
              <div className="space-y-2">
                {availableRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleUpdateRole(selectedUser.id, role.id)}
                    className={`w-full p-4 rounded-lg text-right flex items-center gap-3 transition-colors ${
                      selectedUser.role === role.id ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      {role.id === 'admin' ? '👑' : role.id === 'ceo' ? '👔' : '👤'}
                    </div>
                    <div>
                      <div className="font-semibold">{role.name}</div>
                      <div className="text-sm text-gray-500">{role.nameEn}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setShowRoleModal(false); setSelectedUser(null); }}
                className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
