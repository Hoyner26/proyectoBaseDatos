// modulos/proveedores.js
import { supabase } from './supabaseClient.js';

export async function obtenerProveedores() {// Esta función obtiene todos los proveedores de la base de datos
  const { data, error } = await supabase.from('proveedor').select('*');
  if (error) console.error('Error al obtener proveedores:', error.message);
  return data || [];
}

export async function agregarProveedor(proveedor) {// Esta función agrega un nuevo proveedor a la base de datos
  const { error } = await supabase.from('proveedor').insert([proveedor]);
  if (error) console.error('Error al insertar proveedor:', error.message);
}

export async function eliminarProveedorPorId(id) {// Esta función elimina un proveedor por su id_proveedor
  const { error } = await supabase.from('proveedor').delete().eq('id_proveedor', id);
  if (error) console.error('Error al eliminar proveedor:', error.message);
}