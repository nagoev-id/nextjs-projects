import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzgxijkvkfnswedrwlza.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Z3hpamt2a2Zuc3dlZHJ3bHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDg4MTAsImV4cCI6MjA2NDg4NDgxMH0.I7AkC80ar725Uzkf1q4pQrq1GJoJwcW_pzklp_iVb3w'
);

export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          date: string;
          color: string;
          completed: boolean;
          user_id: string;
          created_at: string;
        };
        Insert: {
          title: string;
          description: string;
          category: string;
          date: string;
          color: string;
          completed: boolean;
          user_id: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          date?: string;
          color?: string;
          completed?: boolean;
        };
      };
    };
  };
}; 