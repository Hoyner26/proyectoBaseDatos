// personas.js
import { supabase } from "./supabaseClient.js";

export async function agregarPersona(persona) {
  const { data: personaData, error: personaError } = await supabase
    .from("persona")
    .insert({
      id_persona: persona.id_persona,
      nombre: persona.nombre,
      apellido1: persona.apellido1,
      apellido2: persona.apellido2,
      genero: persona.genero,
      distrito: persona.distrito,
      senas: persona.senas,
    });

  if (personaError) {
    console.error("Error insertando persona:", personaError);
    throw personaError;
  }

  const telefonos = persona.telefonos.map((tel) => ({
    id_persona: persona.id_persona,
    telefono: tel,
  }));

  const { error: telError } = await supabase
    .from("telefonos_personas")
    .insert(telefonos);

  if (telError) {
    console.error("Error insertando teléfonos:", telError);
    throw telError;
  }

  const correos = persona.correos.map((corr) => ({
    id_persona: persona.id_persona,
    correo_electronico: corr,
  }));

  const { error: corrError } = await supabase
    .from("correos_personas")
    .insert(correos);

  if (corrError) {
    console.error("Error insertando correos:", corrError);
    throw corrError;
  }
}

export async function obtenerPersonas() {
  const { data, error } = await supabase.from("persona").select(`
      id_persona,
      nombre,
      apellido1,
      apellido2,
      genero,
      distrito,
      senas,
      generos (
        genero
      ),
      distritos (
        distrito,
        cantones (
          canton,
          provincias (
            provincia
          )
        )
      ),
      telefonos_personas (
        telefono
      ),
      correos_personas (
        correo_electronico
      )
    `);

  if (error) {
    console.error("Error obteniendo personas:", error);
    return [];
  }

  // Convertimos la estructura para que sea más fácil de usar en el frontend
  return data.map((p) => ({
    ...p,
    genero: p.generos?.genero || p.genero,
    distrito: p.distritos?.distrito || "",
    canton: p.distritos?.cantones?.canton || "",
    provincia: p.distritos?.cantones?.provincias?.provincia || "",
    telefonos: p.telefonos_personas || [],
    correos: p.correos_personas || [],
  }));
}

export async function eliminarPersonaPorId(id) {
  // 1. Eliminar teléfonos
  const { error: errorTelefonos } = await supabase
    .from("telefonos_personas")
    .delete()
    .eq("id_persona", id);

  if (errorTelefonos) {
    console.error("Error al eliminar teléfonos:", errorTelefonos.message);
    alert("No se pudo eliminar los teléfonos relacionados.");
    return;
  }

  // 2. Eliminar correos
  const { error: errorCorreos } = await supabase
    .from("correos_personas")
    .delete()
    .eq("id_persona", id);

  if (errorCorreos) {
    console.error("Error al eliminar correos:", errorCorreos.message);
    alert("No se pudo eliminar los correos relacionados.");
    return;
  }

  // 3. Eliminar la persona
  const { error: errorPersona } = await supabase
    .from("persona")
    .delete()
    .eq("id_persona", id);

  if (errorPersona) {
    console.error("Error al eliminar persona:", errorPersona.message);
    alert("No se pudo eliminar la persona.");
  } else {
    alert("Persona eliminada correctamente.");
    // Opcional: recargar lista o redirigir
    location.reload();
  }
}

export async function obtenerPersonaPorId(id) {
  const { data, error } = await supabase
    .from("persona")
    .select(`
      id_persona,
      nombre,
      apellido1,
      apellido2,
      genero,
      distrito,
      senas,
      telefonos_personas (
        telefono
      ),
      correos_personas (
        correo_electronico
      )
    `)
    .eq("id_persona", id)
    .single();

  if (error) {
    console.error("Error obteniendo persona por ID:", error);
    return null;
  }

  return {
    ...data,
    telefonos: data.telefonos_personas.map((t) => t.telefono),
    correos: data.correos_personas.map((c) => c.correo_electronico),
  };
}
