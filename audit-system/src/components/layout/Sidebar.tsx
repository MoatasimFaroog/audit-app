import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  FolderOpen,
  Settings,
  LayoutDashboard,
  BookOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  {
    name: 'dashboard',
    href: '/',
    icon: LayoutDashboard
  },
  {
    name: 'projects',
    href: '/projects',
    icon: FolderOpen
  },
  {
    name: 'chartOfAccounts',
    href: '/chart-of-accounts',
    icon: BookOpen
  },
  {
    name: 'reports',
    href: '/reports',
    icon: BarChart3
  },
  {
    name: 'settings',
    href: '/settings',
    icon: Settings
  }
];

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className={cn(
      'bg-white shadow-lg transition-all duration-300 border-l border-gray-200',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4">
        <div className={cn(
          'flex items-center gap-3',
          collapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="text-right">
              <h1 className="text-lg font-bold text-gray-900">نظام المراجعة</h1>
              <p className="text-sm text-gray-600">إدارة مالية متقدمة</p>
            </div>
          )}
        </div>
      </div>
      
      <nav className="mt-8 px-2">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    collapsed && 'justify-center',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  title={collapsed ? t(item.name) : undefined}
                >
                  <item.icon className={cn(
                    'flex-shrink-0',
                    collapsed ? 'w-6 h-6' : 'w-5 h-5'
                  )} />
                  {!collapsed && (
                    <span className="font-medium text-right flex-1">
                      {t(item.name)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};