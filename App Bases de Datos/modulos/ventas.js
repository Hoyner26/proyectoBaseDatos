import { supabase } from "./supabaseClient.js";

/**
 * Obtiene todas las ventas con información del cliente y empleado.
 */
export async function obtenerVentas() {// Esta función obtiene todas las ventas de la base de datos
  const { data, error } = await supabase.from("venta").select(`
    id_venta,
    fecha,
    tipo_pago,
    estado_pago,
    total,
    cliente (
      id_cliente,
      persona (
        nombre,
        apellido1,
        apellido2
      )
    ),
    empleado (
      id_empleado,
      persona (
        nombre,
        apellido1,
        apellido2
      )
    )
  `);

  if (error) {
    console.error("Error obteniendo ventas:", error);
    return [];
  }

  // Aplanamos la data para que sea más fácil de usar en el frontend
  return data.map((venta) => ({
    ...venta,
    nombre_cliente: `${venta.cliente.persona.nombre} ${venta.cliente.persona.apellido1}`,
    nombre_empleado: `${venta.empleado.persona.nombre} ${venta.empleado.persona.apellido1}`,
  }));
}

/**
 * Agrega una venta completa (venta y sus detalles).
 * @param {object} ventaData - Datos de la tabla 'venta'.
 * @param {Array} detallesData - Array de objetos para la tabla 'detalle_venta'.
 */
export async function agregarVentaCompleta(ventaData, detallesData) {
  // 1. Insertar la venta principal y obtener su ID
  const { data: ventaResult, error: ventaError } = await supabase
    .from("venta")
    .insert(ventaData)
    .select("id_venta")
    .single(); // .single() para obtener un objeto en lugar de un array

  if (ventaError) {
    console.error("Error insertando venta:", ventaError);
    throw new Error("Fallo al crear la venta principal.");
  }

  const idNuevaVenta = ventaResult.id_venta;

  // 2. Preparar los detalles con el ID de la nueva venta
  const detallesParaInsertar = detallesData.map((detalle) => ({
    ...detalle,
    id_venta: idNuevaVenta,
  }));

  // 3. Insertar todos los detalles de la venta
  const { error: detallesError } = await supabase
    .from("detalle_venta")
    .insert(detallesParaInsertar);

  if (detallesError) {
    console.error("Error insertando detalles de venta:", detallesError);
    // Como fallaron los detalles, eliminamos la venta que creamos para no dejar datos huérfanos.
    await supabase.from("venta").delete().eq("id_venta", idNuevaVenta);
    throw new Error("Fallo al guardar los productos de la venta.");
  }

  return ventaResult;
}

/**
 * Elimina una venta por su ID.
 * Gracias al "ON DELETE CASCADE" en la base de datos, los detalles se eliminan automáticamente.
 * @param {number} id - El ID de la venta a eliminar.
 */
export async function eliminarVentaPorId(id) {
  const { error } = await supabase.from("venta").delete().eq("id_venta", id);

  if (error) {
    console.error("Error eliminando venta:", error.message);
    throw new Error("No se pudo eliminar la venta.");
  }
}

export async function obtenerVentaPorId(id) {// Esta función obtiene una venta específica por su id_venta
  const { data, error } = await supabase.from('venta').select('*')
    .eq("id_venta", id)
    .single();

  if (error) {
    console.error(`Error obteniendo la venta con ID ${id}:`, error.message);
    return null;
  }
  return data;
}
