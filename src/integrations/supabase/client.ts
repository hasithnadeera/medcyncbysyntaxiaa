
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://svpyzojlgpihzzxdiaex.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cHl6b2psZ3BpaHp6eGRpYWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODQ3NDEsImV4cCI6MjA2MTI2MDc0MX0.LCnA52vfkoGHk7ODXjUlKqJ_VNIH8jh0dX6bL7RugPA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
