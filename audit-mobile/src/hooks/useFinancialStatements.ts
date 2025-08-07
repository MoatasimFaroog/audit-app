import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, FinancialStatement } from '../services/supabase';

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        'https://agfnfxwfilhpbgvxiodj.supabase.co/functions/v1/generate-financial-statements',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ projectId, statementType })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Statement generation failed');
      }

      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['financialStatements', variables.projectId] });
    }
  });
};

export const useProjectSummary = (projectId: string) => {
  return useQuery({
    queryKey: ['projectSummary', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `https://agfnfxwfilhpbgvxiodj.supabase.co/functions/v1/get-project-summary?projectId=${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch project summary');
      }

      const result = await response.json();
      return result.data;
    },
    enabled: !!projectId
  });
};
