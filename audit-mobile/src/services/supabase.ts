import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// خيارات للتخزين المستمر
const supabaseUrl = 'https://agfnfxwfilhpbgvxiodj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZm5meHdmaWxocGJndnhpb2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjYzOTgsImV4cCI6MjA2OTU0MjM5OH0.9edbQy05IBefCGZ7gR02ADWDaNvfV6yNgsjv3FZOB3U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// أنواع البيانات
export interface AuditProject {
  id: string;
  name: string;
  company_name: string;
  financial_year: string;
  status: 'draft' | 'active' | 'completed';
  currency: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface TrialBalanceItem {
  id: string;
  project_id: string;
  account_code: string;
  account_name: string;
  account_name_en?: string;
  debit_amount: number;
  credit_amount: number;
  created_at: string;
}

export interface FinancialStatement {
  id: string;
  project_id: string;
  statement_type: string;
  statement_data: any;
  pdf_url?: string;
  excel_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialNote {
  id: string;
  project_id: string;
  note_number?: number;
  note_title: string;
  note_title_en?: string;
  note_content: string;
  note_content_en?: string;
  category?: string;
  created_at: string;
}

export interface UploadedFile {
  id: string;
  project_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  upload_date: string;
  uploaded_by?: string;
  processing_status: 'pending' | 'completed' | 'failed';
}
