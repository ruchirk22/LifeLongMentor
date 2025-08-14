// 1. Create this file at: src/services/api/supabaseClient.ts
// This file initializes the Supabase client.

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Basic validation to ensure environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env file');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);