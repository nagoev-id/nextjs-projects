import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '@/app/projects/hard/pets-tinder/utils';

export const supabase = createClient(
  CONFIG.SUPABASE.URL,
  CONFIG.SUPABASE.ANON_KEY,
  { auth: CONFIG.SUPABASE.AUTH },
);
