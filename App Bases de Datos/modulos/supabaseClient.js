// supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://bnuivotsgszcthkzqqvv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudWl2b3RzZ3N6Y3Roa3pxcXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDU5ODIsImV4cCI6MjA2NTQyMTk4Mn0.adLFIf_xu-N-yor5nJE3hUGENalxjT-VwAjed7u3Mvc";
export const supabase = createClient(supabaseUrl, supabaseKey);
