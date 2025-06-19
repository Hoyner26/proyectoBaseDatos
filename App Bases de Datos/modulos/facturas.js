import { supabase } from './supabaseClient.js';
export async function obtenerFacturas() {
  const { data, error } = await supabase.from('facturas').select('*');
  if (error) console.error('Error al obtener facturas:', error.message);
  return data || [];
}

export async function obtenerFacturaEspecialData(id) {
  const { data, error } = await supabase.from('view_facturas_completa').select('*').eq('numero_factura', id).single();
    if (error) {
        console.error('Error al obtener factura por ID:', error.message);
        return null;
    }
    return data;
}

export async function agregarFactura(factura) {
  const { error } = await supabase.from('facturas').insert([factura]);
  if (error) console.error('Error al insertar factura:', error.message);
}

export async function eliminarFactura(id) {
  const { error } = await supabase.from('facturas').delete().eq('id_factura', id);
  if (error) console.error('Error al eliminar factura:', error.message);
}

export async function obtenerFacturaPorId(id) {
    const { data, error } = await supabase.from('facturas').select('*').eq('id_factura', id).single();
    if (error) {
        console.error('Error al obtener factura por ID:', error.message);
        return null;
    }
    return data;
}

export async function actualizarFactura(id, facturaActualizada) {
    const { error } = await supabase.from('facturas').update(facturaActualizada).eq('id_factura', id);
    if (error) {
        console.error('Error al actualizar factura:', error.message);
    }
}
