// modulos/inventario.js
import { supabase } from './supabaseClient.js';

export async function obtenerInventario() {// Esta función obtiene todos los inventarios de la base de datos
  const { data, error } = await supabase.from('inventario').select('*');
  if (error) console.error('Error al obtener inventarios:', error.message);
  return data || [];
}

export async function agregarInventario(inventario) {// Esta función agrega un nuevo inventario a la base de datos
  const { error } = await supabase.from('inventario').insert([inventario]);
  if (error) console.error('Error al insertar inventario:', error.message);
}

export async function eliminarInventario(id) {// Esta función elimina un inventario por su id_producto
  const { error } = await supabase.from('inventario').delete().eq('id_producto', id);
  if (error) console.error('Error al eliminar inventario:', error.message);
}
