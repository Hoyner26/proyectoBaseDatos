// modulos/empleados.js
import { supabase } from "./supabaseClient.js";

export async function obtenerEmpleados() {// Esta función obtiene todos los empleados de la base de datos
  const { data, error } = await supabase.from("empleado").select("*");
  if (error) console.error("Error al obtener empleados:", error.message);
  return data || [];
}

export async function agregarEmpleado(empleado) {// Esta función agrega un nuevo empleado a la base de datos
  const { error } = await supabase.from("empleado").insert([empleado]);
  if (error) console.error("Error al insertar empleado:", error.message);
}

export async function eliminarEmpleado(id) {// Esta función elimina un empleado por su id_empleado
  const { error } = await supabase
    .from("empleado")
    .delete()
    .eq("id_empleado", id);
  if (error) console.error("Error al eliminar empleado:", error.message);
}
