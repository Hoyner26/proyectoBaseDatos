// modulos/clientes.js
import { supabase } from "./supabaseClient.js";

export async function obtenerClientes() {
  const { data, error } = await supabase.from("cliente").select("*");
  if (error) console.error("Error al obtener clientes:", error.message);
  return data || [];
}

//obtener id_personas para relacionar con cliente
export async function obtenerIdPersonas() {
  const { data, error } = await supabase.from("persona").select("id_persona");
  if (error) console.error("Error al obtener id_personas:", error.message);
  return data || [];
}

export async function agregarCliente(cliente) {
  const { error } = await supabase.from("cliente").insert([cliente]);
  if (error) console.error("Error al insertar cliente:", error.message);
}

export async function eliminarClientePorId(id) {
  const { error } = await supabase
    .from("cliente")
    .delete()
    .eq("id_cliente", id);
  if (error) {
    console.error("Error al eliminar cliente:", error.message);
    alert("No se pudo eliminar el cliente.");
  }
}

export async function obtenerClientesFull() {
  const { data, error } = await supabase.from("view_clientes_info_full").select(`*`);
  if (error) {
    console.error("Error obteniendo personas desde el view:", error);
    return [];
  }

  const personasMap = new Map();

  data.forEach((row) => {
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

  return Array.from(personasMap.values());
}