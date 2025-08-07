import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, FinancialStatement } from '../lib/supabase';

export const useFinancialStatements = (projectId: string) => {
  return useQuery({
    queryKey: ['financialStatements', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('financial_statements')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FinancialStatement[];
    },
    enabled: !!projectId
  });
};

export const useGenerateStatement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, statementType }: {
      projectId: string;
      statementType: string;
    }) => {
      try {
        // 1. الحصول على بيانات ميزان المراجعة
        const { data: trialBalanceData, error: trialBalanceError } = await supabase
          .from('trial_balance')
          .select('*')
          .eq('project_id', projectId)
          .order('account_code');

        if (trialBalanceError) {
          throw new Error(`فشل في جلب بيانات ميزان المراجعة: ${trialBalanceError.message}`);
        }

        if (!trialBalanceData || trialBalanceData.length === 0) {
          throw new Error('ميزان المراجعة فارغ أو غير موجود لهذا المشروع');
        }

        // 2. الحصول على بيانات المشروع
        const { data: projectData, error: projectError } = await supabase
          .from('audit_projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) {
          throw new Error(`فشل في جلب بيانات المشروع: ${projectError.message}`);
        }

        // 3. توليد القوائم المالية
        const statements = {
          balance_sheet: generateBalanceSheet(trialBalanceData, projectData),
          income_statement: generateIncomeStatement(trialBalanceData, projectData),
          cash_flow: generateCashFlowStatement(trialBalanceData, projectData),
          equity_changes: generateEquityChangesStatement(trialBalanceData, projectData)
        };

        // 4. حفظ أو تحديث القوائم في قاعدة البيانات
        for (const [type, data] of Object.entries(statements)) {
          if (statementType && statementType !== type) continue;

          // التحقق من وجود قائمة مالية من نفس النوع
          const { data: existingStatements, error: checkError } = await supabase
            .from('financial_statements')
            .select('id')
            .eq('project_id', projectId)
            .eq('statement_type', type);

          if (checkError) {
            console.error('خطأ في التحقق من القوائم الموجودة:', checkError);
            continue;
          }

          const statement = {
            project_id: projectId,
            statement_type: type,
            statement_data: data,
            updated_at: new Date().toISOString()
          };

          if (existingStatements && existingStatements.length > 0) {
            // تحديث القائمة الموجودة
            const { error: updateError } = await supabase
              .from('financial_statements')
              .update({
                statement_data: data,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingStatements[0].id);

            if (updateError) {
              console.error('خطأ في تحديث القائمة المالية:', updateError);
            }
          } else {
            // إنشاء قائمة جديدة
            const { error: insertError } = await supabase
              .from('financial_statements')
              .insert({
                ...statement,
                created_at: new Date().toISOString()
              });

            if (insertError) {
              console.error('خطأ في إنشاء القائمة المالية:', insertError);
            }
          }
        }

        return {
          data: {
            message: 'تم توليد القوائم المالية بنجاح',
            statements: statements,
            generatedAt: new Date().toISOString()
          }
        };
      } catch (error) {
        console.error('خطأ في توليد القوائم المالية:', error);
        throw new Error(error instanceof Error ? error.message : 'فشل في توليد القوائم المالية');
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['financialStatements', variables.projectId] });
    }
  });
};

// دوال توليد القوائم المالية
function generateBalanceSheet(trialBalanceData: any[], project: any) {
  const assets = {
    current_assets: {} as any,
    non_current_assets: {} as any,
    total_current_assets: 0,
    total_non_current_assets: 0,
    total_assets: 0
  };

  const liabilities = {
    current_liabilities: {} as any,
    non_current_liabilities: {} as any,
    total_current_liabilities: 0,
    total_non_current_liabilities: 0,
    total_liabilities: 0
  };

  const equity = {
    capital: 0,
    reserves: 0,
    retained_earnings: 0,
    total_equity: 0
  };

  trialBalanceData.forEach(account => {
    const firstDigit = account.account_code.charAt(0);
    const amount = account.balance_amount || 0;

    if (firstDigit === '1') { // الأصول
      if (account.account_code.startsWith('15') || account.account_code.startsWith('14')) {
        assets.non_current_assets[account.account_code] = {
          name: account.account_name_ar,
          name_en: account.account_name_en,
          amount: amount
        };
        assets.total_non_current_assets += amount;
      } else {
        assets.current_assets[account.account_code] = {
          name: account.account_name_ar,
          name_en: account.account_name_en,
          amount: amount
        };
        assets.total_current_assets += amount;
      }
    } else if (firstDigit === '2') { // الخصوم
      if (account.account_code.startsWith('24') || account.account_code.startsWith('25')) {
        liabilities.non_current_liabilities[account.account_code] = {
          name: account.account_name_ar,
          name_en: account.account_name_en,
          amount: amount
        };
        liabilities.total_non_current_liabilities += amount;
      } else {
        liabilities.current_liabilities[account.account_code] = {
          name: account.account_name_ar,
          name_en: account.account_name_en,
          amount: amount
        };
        liabilities.total_current_liabilities += amount;
      }
    } else if (firstDigit === '3') { // حقوق الملكية
      if (account.account_code.startsWith('30')) {
        equity.capital += amount;
      } else if (account.account_code.startsWith('31') || account.account_code.startsWith('32')) {
        equity.reserves += amount;
      } else {
        equity.retained_earnings += amount;
      }
    }
  });

  assets.total_assets = assets.total_current_assets + assets.total_non_current_assets;
  liabilities.total_liabilities = liabilities.total_current_liabilities + liabilities.total_non_current_liabilities;
  equity.total_equity = equity.capital + equity.reserves + equity.retained_earnings;

  return {
    company_name: project?.company_name || 'شركة نموذجية',
    financial_year: project?.financial_year || '2024',
    currency: project?.currency || 'SAR',
    generated_at: new Date().toISOString(),
    assets,
    liabilities,
    equity,
    total_liabilities_equity: liabilities.total_liabilities + equity.total_equity
  };
}

function generateIncomeStatement(trialBalanceData: any[], project: any) {
  let revenues = 0;
  let cogs = 0;
  let expenses = 0;
  const revenueDetails = {} as any;
  const expenseDetails = {} as any;

  trialBalanceData.forEach(account => {
    const firstDigit = account.account_code.charAt(0);
    const amount = account.balance_amount || 0;

    if (firstDigit === '4') { // الإيرادات
      revenues += amount;
      revenueDetails[account.account_code] = {
        name: account.account_name_ar,
        name_en: account.account_name_en,
        amount: amount
      };
    } else if (firstDigit === '5') { // تكلفة البضاعة المباعة
      cogs += amount;
    } else if (firstDigit === '6') { // المصروفات
      expenses += amount;
      expenseDetails[account.account_code] = {
        name: account.account_name_ar,
        name_en: account.account_name_en,
        amount: amount
      };
    }
  });

  const grossProfit = revenues - cogs;
  const netIncome = grossProfit - expenses;

  return {
    company_name: project?.company_name || 'شركة نموذجية',
    financial_year: project?.financial_year || '2024',
    currency: project?.currency || 'SAR',
    generated_at: new Date().toISOString(),
    revenues: {
      total: revenues,
      details: revenueDetails
    },
    cost_of_goods_sold: cogs,
    gross_profit: grossProfit,
    expenses: {
      total: expenses,
      details: expenseDetails
    },
    net_income: netIncome,
    gross_profit_margin: revenues > 0 ? (grossProfit / revenues * 100) : 0,
    net_profit_margin: revenues > 0 ? (netIncome / revenues * 100) : 0
  };
}

function generateCashFlowStatement(trialBalanceData: any[], project: any) {
  const netIncome = calculateNetIncome(trialBalanceData);
  const cashFromOperations = netIncome;
  const cashFromInvesting = 0;
  const cashFromFinancing = 0;

  return {
    company_name: project?.company_name || 'شركة نموذجية',
    financial_year: project?.financial_year || '2024',
    currency: project?.currency || 'SAR',
    generated_at: new Date().toISOString(),
    operating_activities: {
      net_income: netIncome,
      adjustments: [],
      net_cash_from_operations: cashFromOperations
    },
    investing_activities: {
      activities: [],
      net_cash_from_investing: cashFromInvesting
    },
    financing_activities: {
      activities: [],
      net_cash_from_financing: cashFromFinancing
    },
    net_increase_in_cash: cashFromOperations + cashFromInvesting + cashFromFinancing
  };
}

function generateEquityChangesStatement(trialBalanceData: any[], project: any) {
  let capital = 0;
  let reserves = 0;
  let retainedEarnings = 0;

  trialBalanceData.forEach(account => {
    if (account.account_code.charAt(0) === '3') {
      const amount = account.balance_amount || 0;
      if (account.account_code.startsWith('30')) {
        capital += amount;
      } else if (account.account_code.startsWith('31') || account.account_code.startsWith('32')) {
        reserves += amount;
      } else {
        retainedEarnings += amount;
      }
    }
  });

  const netIncome = calculateNetIncome(trialBalanceData);
  const totalEquity = capital + reserves + retainedEarnings;

  return {
    company_name: project?.company_name || 'شركة نموذجية',
    financial_year: project?.financial_year || '2024',
    currency: project?.currency || 'SAR',
    generated_at: new Date().toISOString(),
    beginning_balance: {
      capital: capital,
      reserves: reserves,
      retained_earnings: retainedEarnings - netIncome,
      total: totalEquity - netIncome
    },
    changes: {
      capital_increase: 0,
      reserves_increase: 0,
      net_income: netIncome,
      dividends: 0
    },
    ending_balance: {
      capital: capital,
      reserves: reserves,
      retained_earnings: retainedEarnings,
      total: totalEquity
    }
  };
}

function calculateNetIncome(trialBalanceData: any[]) {
  let revenues = 0;
  let cogs = 0;
  let expenses = 0;

  trialBalanceData.forEach(account => {
    const firstDigit = account.account_code.charAt(0);
    const amount = account.balance_amount || 0;

    if (firstDigit === '4') revenues += amount;
    else if (firstDigit === '5') cogs += amount;
    else if (firstDigit === '6') expenses += amount;
  });

  return revenues - cogs - expenses;
}

export const useProjectSummary = (projectId: string) => {
  return useQuery({
    queryKey: ['projectSummary', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      try {
        // الحصول على بيانات المشروع
        const { data: projectData, error: projectError } = await supabase
          .from('audit_projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) {
          throw new Error(`فشل في جلب بيانات المشروع: ${projectError.message}`);
        }

        // الحصول على بيانات ميزان المراجعة
        const { data: trialBalanceData, error: trialBalanceError } = await supabase
          .from('trial_balance')
          .select('*')
          .eq('project_id', projectId);

        if (trialBalanceError) {
          console.error('خطأ في جلب ميزان المراجعة:', trialBalanceError);
        }

        // الحصول على القوائم المالية
        const { data: statementsData, error: statementsError } = await supabase
          .from('financial_statements')
          .select('*')
          .eq('project_id', projectId);

        if (statementsError) {
          console.error('خطأ في جلب القوائم المالية:', statementsError);
        }

        // حساب الملخص
        const summary = {
          project: projectData,
          trial_balance_count: trialBalanceData?.length || 0,
          statements_count: statementsData?.length || 0,
          total_assets: 0,
          total_liabilities: 0,
          total_equity: 0,
          total_revenue: 0,
          net_income: 0,
          is_balanced: false
        };

        if (trialBalanceData && trialBalanceData.length > 0) {
          let totalDebit = 0;
          let totalCredit = 0;

          trialBalanceData.forEach(account => {
            const firstDigit = account.account_code.charAt(0);
            const amount = account.balance_amount || 0;

            totalDebit += account.debit_amount || 0;
            totalCredit += account.credit_amount || 0;

            if (firstDigit === '1') { // الأصول
              summary.total_assets += amount;
            } else if (firstDigit === '2') { // الخصوم
              summary.total_liabilities += amount;
            } else if (firstDigit === '3') { // حقوق الملكية
              summary.total_equity += amount;
            } else if (firstDigit === '4') { // الإيرادات
              summary.total_revenue += amount;
            }
          });

          summary.is_balanced = Math.abs(totalDebit - totalCredit) < 0.01;
          summary.net_income = calculateNetIncome(trialBalanceData);
        }

        return summary;
      } catch (error) {
        console.error('خطأ في جلب ملخص المشروع:', error);
        throw new Error(error instanceof Error ? error.message : 'فشل في جلب ملخص المشروع');
      }
    },
    enabled: !!projectId
  });
};