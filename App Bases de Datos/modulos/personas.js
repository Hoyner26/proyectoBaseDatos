// personas.js
import { supabase } from './supabaseClient.js';

export async function agregarPersona(persona) {
  await supabase.from('persona').insert([persona]);
}

export async function obtenerPersonas() {
  const { data } = await supabase.from('persona').select('*');
  return data;
}

export async function eliminarPersonaPorId(id) {
  const { error } = await supabase
    .from('persona') // nombre de la tabla
    .delete()
    .eq('id_persona', id); // campo clave primaria

  if (error) {
    console.error('Error al eliminar persona:', error.message);
    alert('No se pudo eliminar la persona.');
  }
}