// supabase-config.js — Supabase client initialisation
const SUPABASE_URL = 'https://akasnggfsxumghxzqheg.supabase.co';
const SUPABASE_ANON = 'sb_publishable_XUxotM0Vr72BuBTkdR80aA_Y82J9Dlo';

let _supabase = null;

try {
  if (typeof supabase !== 'undefined' && supabase.createClient && SUPABASE_URL && SUPABASE_ANON) {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    console.log('[Supabase] Client initialized successfully:', !!_supabase);
  } else {
    console.warn('[Supabase] supabase global not available or missing credentials. supabase typeof:', typeof supabase);
  }
} catch (e) {
  console.error('[Supabase] Initialization error:', e);
}
