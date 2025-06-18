// dashboard.js
import { supabase } from "./supabaseClient.js";

const totalPersonasElement = document.getElementById("total-personas");
const totalProductosElement = document.getElementById("total-productos");
const totalVentasElement = document.getElementById("total-ventas");

const fetchDashboardData = async () => {
  try {
    // 1. Contar personas
    const { count: totalPersonas, error: errorPersonas } = await supabase
      .from("persona")
      .select("*", { count: "exact", head: true });

    if (errorPersonas) throw errorPersonas;
    totalPersonasElement.textContent = totalPersonas;

    // 2. Contar ventas del día actual
    const today = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
    const { count: totalVentasHoy, error: errorVentas } = await supabase
      .from("venta")
      .select("*", { count: "exact", head: true })
      .eq("fecha", today);

    if (errorVentas) throw errorVentas;
    totalVentasElement.textContent = totalVentasHoy;

    // 3. Sumar cantidades del inventario
    const { data: inventario, error: errorInventario } = await supabase
      .from("inventario")
      .select("cantidad");

    if (errorInventario) throw errorInventario;

    const totalInventario = inventario.reduce(
      (sum, item) => sum + (item.cantidad || 0),
      0
    );
    totalProductosElement.textContent = totalInventario;
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error.message);
  }
};

document.addEventListener("DOMContentLoaded", fetchDashboardData);
