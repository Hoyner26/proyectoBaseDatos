// ventasApp.js
import { agregarVenta, obtenerVentas, eliminarVentaPorId } from "./ventas.js";

const form = document.getElementById("venta-form");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nuevaVenta = {
    id_venta: document.getElementById("id_venta").value,
    fecha: document.getElementById("fecha").value,
    cliente: document.getElementById("cliente").value,
    producto: document.getElementById("producto").value,
    cantidad: parseInt(document.getElementById("cantidad").value),
    precio_unitario: parseFloat(
      document.getElementById("precio_unitario").value
    ),
  };

  // Validar ID único
  const ventas = await obtenerVentas();
  const yaExiste = ventas.some((v) => v.id_venta === nuevaVenta.id_venta);
  if (yaExiste) {
    alert("⚠️ Ya existe una venta con ese ID.");
    return;
  }

  await agregarVenta(nuevaVenta);
  form.reset();
  cargarVentas();
});

async function cargarVentas() {
  const ventas = await obtenerVentas();
  const lista = document.getElementById("lista-ventas");
  lista.innerHTML = "";

  ventas.forEach((venta) => {
    const total = venta.cantidad * venta.precio_unitario;
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${venta.id_venta}</td>
      <td>${venta.fecha}</td>
      <td>${venta.cliente}</td>
      <td>${venta.producto}</td>
      <td>${venta.cantidad}</td>
      <td>₡${venta.precio_unitario.toFixed(2)}</td>
      <td>₡${total.toFixed(2)}</td>
      <td><button class="btn-eliminar" data-id="${
        venta.id_venta
      }">Eliminar</button></td>
    `;
    lista.appendChild(fila);
  });

  document.querySelectorAll(".btn-eliminar").forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Eliminar la venta con ID ${id}?`)) {
        await eliminarVentaPorId(id);
        cargarVentas();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", cargarVentas);
