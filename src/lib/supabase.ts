import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yhdiecmklfmxcfnlerwz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZGllY21rbGZteGNmbmxlcnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDkzNDQsImV4cCI6MjEwMjk4NTM0NH0.mZsZhgcypaDzrpdL8eIQYKynDsOX2pR0guxPXewNbD8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public',
  },
});
