import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, TrialBalanceItem } from '../services/supabase';

export const useTrialBalance = (projectId: string) => {
  return useQuery({
    queryKey: ['trialBalance', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('trial_balance')
        .select('*')
        .eq('project_id', projectId)
        .order('account_code');

      if (error) throw error;
      return data as TrialBalanceItem[];
    },
    enabled: !!projectId
  });
};

export const useProcessExcelFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ fileData, fileName, projectId }: {
      fileData: string;
      fileName: string;
      projectId: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        'https://agfnfxwfilhpbgvxiodj.supabase.co/functions/v1/process-excel-trial-balance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ fileData, fileName, projectId })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Processing failed');
      }

      return await response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trialBalance', variables.projectId] });
    }
  });
};
