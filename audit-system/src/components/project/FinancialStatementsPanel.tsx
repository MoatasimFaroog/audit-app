import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  FileText,
  TrendingUp,
  Download,
  Plus,
  Eye,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useFinancialStatements, useGenerateStatement } from '../../hooks/useFinancialStatements';
import { formatCurrency, formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface FinancialStatementsPanelProps {
  projectId: string;
}

export const FinancialStatementsPanel: React.FC<FinancialStatementsPanelProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { data: statements, isLoading } = useFinancialStatements(projectId);
  const generateStatement = useGenerateStatement();
  const [selectedStatement, setSelectedStatement] = React.useState<any>(null);
  const [generatingType, setGeneratingType] = React.useState<string>('');

  const statementTypes = [
    { 
      id: 'balance_sheet', 
      name: 'قائمة المركز المالي', 
      icon: BarChart3,
      description: 'عرض الأصول والالتزامات وحقوق الملكية'
    },
    { 
      id: 'income_statement', 
      name: 'قائمة الدخل', 
      icon: TrendingUp,
      description: 'عرض الإيرادات والمصروفات وصافي الدخل'
    },
    { 
      id: 'cash_flow', 
      name: 'قائمة التدفقات النقدية', 
      icon: FileText,
      description: 'عرض التدفقات النقدية الداخلة والخارجة'
    }
  ];

  const handleGenerateStatement = async (statementType: string) => {
    setGeneratingType(statementType);
    try {
      await generateStatement.mutateAsync({ projectId, statementType });
    } catch (error) {
      console.error('Error generating statement:', error);
    } finally {
      setGeneratingType('');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">جاري تحميل القوائم المالية...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statement Generation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statementTypes.map((type) => {
          const Icon = type.icon;
          const existingStatement = statements?.find(s => s.statement_type === type.id);
          const isGenerating = generatingType === type.id;
          
          return (
            <Card key={type.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className="w-5 h-5 text-blue-600" />
                  {type.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{type.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingStatement ? (
                    <>
                      <div className="text-sm text-gray-600">
                        <p><strong>تاريخ التوليد:</strong> {formatDate(existingStatement.created_at)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedStatement(existingStatement)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          عرض
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={isGenerating}
                          onClick={() => handleGenerateStatement(type.id)}
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleGenerateStatement(type.id)}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          جاري التوليد...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          توليد القائمة
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Generated Statements List */}
      {statements && statements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>القوائم المالية المولدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statements.map((statement) => {
                const statementType = statementTypes.find(t => t.id === statement.statement_type);
                return (
                  <div key={statement.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {statementType && <statementType.icon className="w-5 h-5 text-blue-600" />}
                      <div>
                        <p className="font-medium">{statementType?.name || statement.statement_type}</p>
                        <p className="text-sm text-gray-600">{formatDate(statement.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedStatement(statement)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        عرض
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        تصدير
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statement Viewer Modal */}
      {selectedStatement && (
        <StatementViewer 
          statement={selectedStatement}
          onClose={() => setSelectedStatement(null)}
        />
      )}
    </div>
  );
};

const StatementViewer: React.FC<{ statement: any; onClose: () => void }> = ({ statement, onClose }) => {
  const statementData = statement.statement_data;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{statementData.title_ar}</h2>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
        </div>
        
        <div className="p-6">
          {statement.statement_type === 'balance_sheet' && (
            <BalanceSheetView data={statementData} />
          )}
          {statement.statement_type === 'income_statement' && (
            <IncomeStatementView data={statementData} />
          )}
          {statement.statement_type === 'cash_flow' && (
            <CashFlowView data={statementData} />
          )}
        </div>
      </div>
    </div>
  );
};

const BalanceSheetView: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-700">{data.assets.title_ar}</h3>
          <div className="space-y-2">
            {data.assets.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                <span>{item.account_name}</span>
                <span className="font-mono">{formatCurrency(item.balance_amount, 'SAR')}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t-2 border-green-200 font-bold text-green-700">
              <span>إجمالي الأصول</span>
              <span className="font-mono">{formatCurrency(data.assets.total, 'SAR')}</span>
            </div>
          </div>
        </div>
        
        {/* Liabilities & Equity */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-700">{data.liabilities.title_ar}</h3>
          <div className="space-y-2 mb-4">
            {data.liabilities.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                <span>{item.account_name}</span>
                <span className="font-mono">{formatCurrency(item.balance_amount, 'SAR')}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t border-red-200 font-semibold text-red-700">
              <span>إجمالي الالتزامات</span>
              <span className="font-mono">{formatCurrency(data.liabilities.total, 'SAR')}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-3 text-purple-700">{data.equity.title_ar}</h3>
          <div className="space-y-2">
            {data.equity.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                <span>{item.account_name}</span>
                <span className="font-mono">{formatCurrency(item.balance_amount, 'SAR')}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t border-purple-200 font-semibold text-purple-700">
              <span>إجمالي حقوق الملكية</span>
              <span className="font-mono">{formatCurrency(data.equity.total, 'SAR')}</span>
            </div>
            
            <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold">
              <span>إجمالي الالتزامات وحقوق الملكية</span>
              <span className="font-mono">{formatCurrency(data.total_liabilities_equity, 'SAR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IncomeStatementView: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Revenues */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-700">{data.revenues.title_ar}</h3>
        <div className="space-y-2">
          {data.revenues.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between py-1 border-b border-gray-100">
              <span>{item.account_name}</span>
              <span className="font-mono">{formatCurrency(item.balance_amount, 'SAR')}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 border-t-2 border-blue-200 font-bold text-blue-700">
            <span>إجمالي الإيرادات</span>
            <span className="font-mono">{formatCurrency(data.revenues.total, 'SAR')}</span>
          </div>
        </div>
      </div>
      
      {/* Expenses */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-red-700">{data.expenses.title_ar}</h3>
        <div className="space-y-2">
          {data.expenses.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between py-1 border-b border-gray-100">
              <span>{item.account_name}</span>
              <span className="font-mono">{formatCurrency(item.balance_amount, 'SAR')}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 border-t-2 border-red-200 font-bold text-red-700">
            <span>إجمالي المصروفات</span>
            <span className="font-mono">{formatCurrency(data.expenses.total, 'SAR')}</span>
          </div>
        </div>
      </div>
      
      {/* Net Income */}
      <div className="border-t-2 border-gray-300 pt-4">
        <div className={cn(
          "flex justify-between py-3 px-4 rounded-lg font-bold text-lg",
          data.net_income.amount >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          <span>{data.net_income.title_ar}</span>
          <span className="font-mono">{formatCurrency(data.net_income.amount, 'SAR')}</span>
        </div>
      </div>
    </div>
  );
};

const CashFlowView: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">قائمة التدفقات النقدية قيد التطوير</p>
      </div>
    </div>
  );
};