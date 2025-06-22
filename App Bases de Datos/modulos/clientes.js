// modulos/clientes.js
import { supabase } from "./supabaseClient.js";

export async function obtenerClientes() {// Esta función obtiene todos los clientes de la tabla "cliente"
  const { data, error } = await supabase.from("cliente").select("*");
  if (error) console.error("Error al obtener clientes:", error.message);
  return data || [];
}


export async function obtenerIdPersonas() {// Esta función obtiene todos los id_persona de la tabla "persona"
  const { data, error } = await supabase.from("persona").select("id_persona");
  if (error) console.error("Error al obtener id_personas:", error.message);
  return data || [];
}

export async function agregarCliente(cliente) {// Esta función agrega un nuevo cliente a la tabla "cliente"
  const { error } = await supabase.from("cliente").insert([cliente]);
  if (error) console.error("Error al insertar cliente:", error.message);
}

export async function eliminarClientePorId(id) {// Esta función elimina un cliente por su id_cliente
  const { error } = await supabase
    .from("cliente")
    .delete()
    .eq("id_cliente", id);
  if (error) {// Si hay un error al eliminar el cliente, lo mostramos en la consola y alertamos al usuario
    console.error("Error al eliminar cliente:", error.message);
    alert("No se pudo eliminar el cliente.");
  }
}

export async function obtenerClientesFull() {// Esta función obtiene todos los clientes con información completa desde el view "view_clientes_info_full"
  const { data, error } = await supabase.from("view_clientes_info_full").select(`*`);
  if (error) {
    console.error("Error obteniendo personas desde el view:", error);
    return [];
  }

  const personasMap = new Map();

  data.forEach((row) => {// Iteramos sobre cada fila de datos obtenidos
    // Creamos un mapa para evitar duplicados basados en id_persona
    const key = row.id_persona;
    if (!personasMap.has(key)) {
      personasMap.set(key, {
        id_cliente: row.id_cliente,
        tipo_cliente: row.tipo_cliente,
        codigo_frecuente: row.codigo_frecuente,
        estado_pago_preferido: row.estado_pago_preferido,
        limite_credito: row.limite_credito,
        id_persona: row.id_persona,
        nombre_completo: row.nombre_completo,
        genero: row.genero,
        direccion: row.direccion,
        correos: [],
        telefonos: [],
      });
    }
    const persona = personasMap.get(key);

    // Sólo agregamos si no existe ya en el array
    if (row.correo_electronico && !persona.correos.includes(row.correo_electronico)) {
      persona.correos.push(row.correo_electronico);
    }
    if (row.telefono && !persona.telefonos.includes(row.telefono)) {
      persona.telefonos.push(row.telefono);
    }
  });

  return Array.from(personasMap.values());// Convertimos el mapa a un array y lo retornamos
}