// modulos/inventario.js
import { supabase } from './supabaseClient.js';

export async function obtenerInventario() {
  const { data, error } = await supabase.from('inventario').select('*');
  if (error) console.error('Error al obtener inventarios:', error.message);
  return data || [];
}

export async function agregarInventario(inventario) {
  const { error } = await supabase.from('inventario').insert([inventario]);
  if (error) console.error('Error al insertar inventario:', error.message);
}

export async function eliminarInventario(id) {
  const { error } = await supabase.from('inventario').delete().eq('id_producto', id);
  if (error) console.error('Error al eliminar inventario:', error.message);
}
