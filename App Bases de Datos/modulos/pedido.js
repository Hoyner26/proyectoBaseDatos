import { supabase } from './supabaseClient.js';

export async function obtenerPedidos() {
  const { data, error } = await supabase.from('pedido').select('*');
  if (error) {
    console.error('Error al obtener pedidos:', error.message);
    return [];
  }
  return data;
}