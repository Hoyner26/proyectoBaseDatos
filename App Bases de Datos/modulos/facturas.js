import { supabase } from './supabaseClient.js';
export async function obtenerFacturas() {// Esta función obtiene todas las facturas de la base de datos
  const { data, error } = await supabase.from('facturas').select('*');
  if (error) console.error('Error al obtener facturas:', error.message);
  return data || [];
}

export async function obtenerFacturaEspecialData(id) {// Esta función obtiene una factura específica por su número de factura desde la vista 'view_facturas_completa'
  const { data, error } = await supabase.from('view_facturas_completa').select('*').eq('numero_factura', id).single();
    if (error) {
        console.error('Error al obtener factura por ID:', error.message);
        return null;
    }
    return data;
}

export async function agregarFactura(factura) {// Esta función agrega una nueva factura a la base de datos
  const { error } = await supabase.from('facturas').insert([factura]);
  if (error) console.error('Error al insertar factura:', error.message);
}

export async function eliminarFactura(id) {// Esta función elimina una factura por su id_factura
  const { error } = await supabase.from('facturas').delete().eq('id_factura', id);
  if (error) console.error('Error al eliminar factura:', error.message);
}

export async function obtenerFacturaPorId(id) {// Esta función obtiene una factura específica por su id_factura
    const { data, error } = await supabase.from('facturas').select('*').eq('id_factura', id).single();
    if (error) {
        console.error('Error al obtener factura por ID:', error.message);
        return null;
    }
    return data;
}

export async function actualizarFactura(id, facturaActualizada) {// Esta función actualiza una factura existente por su id_factura
    const { error } = await supabase.from('facturas').update(facturaActualizada).eq('id_factura', id);
    if (error) {
        console.error('Error al actualizar factura:', error.message);
    }
}
