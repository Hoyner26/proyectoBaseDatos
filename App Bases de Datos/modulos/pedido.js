import { supabase } from './supabaseClient.js';

export async function obtenerPedidos() {
  const { data, error } = await supabase.from('pedido').select('*');
  if (error) {
    console.error('Error al obtener pedidos:', error.message);
    return [];
  }
  return data;
}

export async function obtenerPedidoPorId(id) {
  const { data, error } = await supabase.from('pedido').select('*').eq('id_pedido', id).single();
  if (error) {
    console.error(`Error al obtener el pedido con ID ${id}:`, error.message);
    return null;
  }
  return data;
}