import { supabase } from "./supabaseClient.js";

async function cargarDetalleVenta() {// Esta función carga los detalles de una venta específica al cargar la página
  const params = new URLSearchParams(window.location.search);
  const idVenta = params.get("id");
  if (!idVenta) return;

  const { data: venta, error } = await supabase
    .from("venta")// Consultamos la tabla 'venta' para obtener los detalles de la venta
    .select(
      `
      id_venta, fecha, tipo_pago, estado_pago, total,
      cliente (persona (nombre, apellido1, apellido2)),
      empleado (persona (nombre, apellido1, apellido2)),
      detalle_venta (
        cantidad,
        precio_unitario,
        producto (
          nombre_producto,
          unidad_medida,
          tipo_producto
        )
      )
    `
    )
    .eq("id_venta", idVenta)
    .single();

  if (error) {// Si hay un error al cargar la venta, lo mostramos en la consola
    console.error("Error cargando venta:", error);
    return;
  }

  // document.getElementById("venta-id").textContent = venta.id_venta;
  document.getElementById("venta-fecha").textContent = new Date(
    venta.fecha
  ).toLocaleDateString("es-CR");
  document.getElementById(
    "venta-cliente"
  ).textContent = `${venta.cliente.persona.nombre} ${venta.cliente.persona.apellido1} ${venta.cliente.persona.apellido2}`;
  document.getElementById(
    "venta-empleado"
  ).textContent = `${venta.empleado.persona.nombre} ${venta.empleado.persona.apellido1} ${venta.empleado.persona.apellido2}`;
  document.getElementById("venta-tipo-pago").textContent = venta.tipo_pago;
  document.getElementById("venta-estado-pago").textContent = venta.estado_pago;
  document.getElementById("venta-total").textContent = parseFloat(
    venta.total
  ).toFixed(2);

  const tbody = document.getElementById("productos-tbody");
  venta.detalle_venta.forEach((det) => {// Por cada detalle de venta, creamos una fila en la tabla
    const subtotal = det.precio_unitario * det.cantidad;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${det.producto.nombre_producto}</td>
      <td>${det.producto.unidad_medida}</td>
      <td>${det.producto.tipo_producto}</td>
      <td>₡${parseFloat(det.precio_unitario).toFixed(2)}</td>
      <td>${det.cantidad}</td>
      <td>₡${subtotal.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", cargarDetalleVenta);
