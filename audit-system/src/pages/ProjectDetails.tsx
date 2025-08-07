import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Upload,
  FileText,
  BarChart3,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Building,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useProject } from '../hooks/useProjects';
import { useProjectSummary } from '../hooks/useFinancialStatements';
import { formatCurrency, formatDate, formatNumber } from '../lib/utils';
import { FileUploadZone } from '../components/project/FileUploadZone';
import { TrialBalanceTable } from '../components/project/TrialBalanceTable';
import { FinancialStatementsPanel } from '../components/project/FinancialStatementsPanel';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: project, isLoading: projectLoading } = useProject(id!);
  const { data: summary, isLoading: summaryLoading } = useProjectSummary(id!);

  const [activeTab, setActiveTab] = React.useState<'overview' | 'trial-balance' | 'statements' | 'reports'>('overview');

  if (projectLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">المشروع غير موجود</h2>
        <p className="text-gray-600 mb-6">لم يتم العثور على المشروع المطلوب</p>
        <Link to="/projects">
          <Button>العودة للمشاريع</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Building },
    { id: 'trial-balance', label: 'ميزان المراجعة', icon: FileText },
    { id: 'statements', label: 'القوائم المالية', icon: BarChart3 },
    { id: 'reports', label: 'التقارير', icon: Download }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.company_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            تعديل
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            حذف
          </Button>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">السنة المالية</p>
                <p className="font-semibold">{project.financial_year}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">العملة</p>
                <p className="font-semibold">{project.currency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">عدد الحسابات</p>
                <p className="font-semibold">{summary?.trial_balance_count || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                project.status === 'active' ? 'bg-green-100' :
                project.status === 'completed' ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <CheckCircle className={`w-5 h-5 ${
                  project.status === 'active' ? 'text-green-600' :
                  project.status === 'completed' ? 'text-blue-600' : 'text-orange-600'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <p className="font-semibold">
                  {project.status === 'active' ? 'نشط' :
                   project.status === 'completed' ? 'مكتمل' : 'مسودة'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <ProjectOverview project={project} summary={summary} />
        )}
        {activeTab === 'trial-balance' && (
          <TrialBalanceSection projectId={project.id} />
        )}
        {activeTab === 'statements' && (
          <FinancialStatementsPanel projectId={project.id} />
        )}
        {activeTab === 'reports' && (
          <ReportsSection projectId={project.id} />
        )}
      </div>
    </div>
  );
};

const ProjectOverview: React.FC<{ project: any; summary: any }> = ({ project, summary }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات المشروع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">اسم المشروع</label>
            <p className="text-gray-900">{project.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">اسم الشركة</label>
            <p className="text-gray-900">{project.company_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">تاريخ الإنشاء</label>
            <p className="text-gray-900">{formatDate(project.created_at)}</p>
          </div>
        </CardContent>
      </Card>
      
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>ملخص مالي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">إجمالي الأصول</label>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(summary?.total_assets || 0, project.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">إجمالي الالتزامات</label>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(summary?.total_liabilities || 0, project.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">الإيرادات</label>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(summary?.total_revenue || 0, project.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">صافي الدخل</label>
                <p className={`text-lg font-semibold ${
                  (summary?.net_income || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(summary?.net_income || 0, project.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const TrialBalanceSection: React.FC<{ projectId: string }> = ({ projectId }) => {
  return (
    <div className="space-y-6">
      <FileUploadZone projectId={projectId} />
      <TrialBalanceTable projectId={projectId} />
    </div>
  );
};

const ReportsSection: React.FC<{ projectId: string }> = ({ projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>التقارير والتصدير</CardTitle>
        <CardDescription>تصدير التقارير بصيغ مختلفة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">قسم التقارير قيد التطوير</p>
        </div>
      </CardContent>
    </Card>
  );
};