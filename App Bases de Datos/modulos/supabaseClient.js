

// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://ksjrgtuelsubypybwoun.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzanJndHVlbHN1YnlweWJ3b3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjAzNjgsImV4cCI6MjA2NDAzNjM2OH0._bjhrHfSIl21_HBpncn1YnhpoCnFwhV6YjHdmHHFr-E'; // tu clave completa

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);