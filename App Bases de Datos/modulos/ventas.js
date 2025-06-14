// ventas.js
import { supabase } from "./supabaseClient.js";

export async function agregarVenta(venta) {
  await supabase.from("venta").insert([venta]);
}

export async function obtenerVentas() {
  const { data } = await supabase.from("venta").select("*");
  return data;
}

export async function eliminarVentaPorId(id) {
  const { error } = await supabase.from("venta").delete().eq("id_venta", id);
  if (error) {
    console.error("Error al eliminar venta:", error.message);
    alert("No se pudo eliminar la venta.");
  }
}
