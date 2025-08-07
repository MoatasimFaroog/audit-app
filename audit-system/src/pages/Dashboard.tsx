import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  FileText,
  FolderOpen,
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart3,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useProjects } from '../hooks/useProjects';
import { formatCurrency, formatDate } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useProjects();

  const stats = React.useMemo(() => {
    if (!projects) return { total: 0, active: 0, completed: 0, draft: 0 };
    
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      draft: projects.filter(p => p.status === 'draft').length,
    };
  }, [projects]);

  const recentProjects = React.useMemo(() => {
    if (!projects) return [];
    return projects.slice(0, 5);
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-600 mt-2">
            مرحباً بك في نظام إدارة المراجعة المالية
          </p>
        </div>
        <Link to="/projects/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t('createProject')}
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاريع</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600">جميع المشاريع المسجلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشاريع نشطة</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-gray-600">قيد التنفيذ حالياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشاريع مكتملة</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <p className="text-xs text-gray-600">تم إنجازها بنجاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مسودات</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
            <p className="text-xs text-gray-600">في مرحلة الإعداد</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                المشاريع الأخيرة
              </CardTitle>
              <CardDescription>
                آخر المشاريع التي تم إنشاؤها أو تعديلها
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <Link to={`/projects/${project.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {project.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{project.company_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(project.created_at)}
                        </p>
                      </div>
                      <div className="text-left">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {project.status === 'active' ? 'نشط' :
                           project.status === 'completed' ? 'مكتمل' : 'مسودة'}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <Link to="/projects">
                      <Button variant="outline" size="sm" className="w-full">
                        عرض جميع المشاريع
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد مشاريع حالياً</p>
                  <Link to="/projects/new">
                    <Button className="mt-4">إنشاء مشروع جديد</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              عمليات سريعة
            </CardTitle>
            <CardDescription>
              مهام وعمليات متكررة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/projects/new">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  مشروع جديد
                </Button>
              </Link>
              
              <Link to="/chart-of-accounts">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  دليل الحسابات
                </Button>
              </Link>
              
              <Link to="/reports">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  التقارير والقوائم
                </Button>
              </Link>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-900 mb-2">نصائح سريعة</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• تأكد من رفع ميزان المراجعة قبل توليد القوائم</li>
                  <li>• مراجعة الإيضاحات المتممة قبل التصدير</li>
                  <li>• حفظ نسخ احتياطية من بيانات المشروع</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};