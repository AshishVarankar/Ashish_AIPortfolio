// Supabase configuration
const SUPABASE_URL = 'https://bgmdolxtvomezuowfgtg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbWRvbHh0dm9tZXp1b3dmZ3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDE2NTcsImV4cCI6MjA5MTk3NzY1N30.UaL5-01xTTniWPYxHj-YsUGC5lvkKxgqwVB7ov3eLRA';

// Initialize Supabase client safely
const supabaseClient = window.supabase && typeof window.supabase.createClient === 'function'
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

window.supabaseClient = supabaseClient;