// supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";// Supabase client library

const supabaseUrl = "https://ksjrgtuelsubypybwoun.supabase.co";// tu URL de Supabase
// Reemplaza con tu URL de Supabase
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzanJndHVlbHN1YnlweWJ3b3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjAzNjgsImV4cCI6MjA2NDAzNjM2OH0._bjhrHfSIl21_HBpncn1YnhpoCnFwhV6YjHdmHHFr-E";
export const supabase = createClient(supabaseUrl, supabaseKey);
//