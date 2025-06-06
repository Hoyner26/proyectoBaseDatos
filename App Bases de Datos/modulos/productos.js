// modulos/productos.js
import { supabase } from './supabaseClient.js';

export async function obtenerProductos() {
  const { data, error } = await supabase.from('producto').select('*');
  if (error) console.error('Error al obtener productos:', error.message);
  return data || [];
}

export async function agregarProducto(producto) {
  const { error } = await supabase.from('producto').insert([producto]);
  if (error) console.error('Error al insertar producto:', error.message);
}


export async function eliminarProductoPorId(id) {
  const { error } = await supabase
    .from('producto')                // nombre correcto de la tabla
    .delete()
    .eq('id_producto', id);         // campo correcto

  if (error) {
    console.error('Error al eliminar:', error.message);
    alert('No se pudo eliminar el producto.');
  } else {
    console.log(`Producto con ID ${id} eliminado`);
  }
}