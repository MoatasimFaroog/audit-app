import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Building, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCreateProject } from '../hooks/useProjects';
import { cn } from '../lib/utils';

interface CreateProjectForm {
  name: string;
  company_name: string;
  financial_year: string;
  currency: string;
  status: 'draft' | 'active' | 'completed';
}

export const CreateProject: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createProject = useCreateProject();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateProjectForm>({
    defaultValues: {
      currency: 'SAR',
      status: 'draft',
      financial_year: new Date().getFullYear().toString()
    }
  });

  const onSubmit = async (data: CreateProjectForm) => {
    try {
      const project = await createProject.mutateAsync(data);
      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('createProject')}</h1>
          <p className="text-gray-600">إنشاء مشروع مراجعة جديد</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            معلومات المشروع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('projectName')}
              </label>
              <Input
                {...register('name', { required: 'اسم المشروع مطلوب' })}
                placeholder="أدخل اسم المشروع"
                className={cn(errors.name && 'border-red-500')}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('companyName')}
              </label>
              <Input
                {...register('company_name', { required: 'اسم الشركة مطلوب' })}
                placeholder="أدخل اسم الشركة"
                className={cn(errors.company_name && 'border-red-500')}
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>
              )}
            </div>

            {/* Financial Year & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {t('financialYear')}
                </label>
                <Input
                  {...register('financial_year', { required: 'السنة المالية مطلوبة' })}
                  placeholder="2024"
                  className={cn(errors.financial_year && 'border-red-500')}
                />
                {errors.financial_year && (
                  <p className="text-red-500 text-sm mt-1">{errors.financial_year.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  {t('currency')}
                </label>
                <select
                  {...register('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                  <option value="EUR">يورو (EUR)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('status')}
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="draft">مسودة</option>
                <option value="active">نشط</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Link to="/projects">
                <Button type="button" variant="outline">
                  {t('cancel')}
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? 'جاري الحفظ...' : t('save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};