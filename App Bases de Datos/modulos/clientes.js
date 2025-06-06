// modulos/clientes.js
import { supabase } from './supabaseClient.js';

export async function obtenerClientes() {
  const { data, error } = await supabase.from('cliente').select('*');
  if (error) console.error('Error al obtener clientes:', error.message);
  return data || [];
}

//obtener id_personas para relacionar con cliente
export async function obtenerIdPersonas() {
  const { data, error } = await supabase.from('persona').select('id_persona');
  if (error) console.error('Error al obtener id_personas:', error.message);
  return data || [];
}

export async function agregarCliente(cliente) {
  const { error } = await supabase.from('cliente').insert([cliente]);
  if (error) console.error('Error al insertar cliente:', error.message);
}


export async function eliminarClientePorId(id) {
  const { error } = await supabase.from('cliente').delete().eq('id_cliente', id);
  if (error) {
    console.error('Error al eliminar cliente:', error.message);
    alert('No se pudo eliminar el cliente.');
  }
}