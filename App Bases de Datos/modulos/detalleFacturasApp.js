import {obtenerFacturas, agregarFactura, eliminarFactura, obtenerFacturaPorId, actualizarFactura, obtenerFacturaEspecialData} from './facturas.js';

async function cargarDetallesFactura() {// Esta función carga los detalles de una factura específica al cargar la página
  const urlParams = new URLSearchParams(window.location.search);
  const idFactura = urlParams.get("id"); // Obtenemos el ID de la URL

  if (!idFactura) {// Si no se especifica un ID, mostramos un mensaje de error
    document.getElementById("factura-details").innerHTML =
      "<p>No se ha especificado un ID de factura.</p>";
    return;
  }

  const factura = await obtenerFacturaEspecialData(idFactura);

  if (factura) {// Si se encuentra la factura, mostramos sus detalles
    document.getElementById("detail-id").textContent = factura.numero_factura;
    document.getElementById("detail-pedido").textContent = factura.numero_pedido;
    document.getElementById("detail-cashier").textContent = factura.nombre_empleado;
    document.getElementById("detail-client").textContent = factura.nombre_cliente;
    //document.getElementById("detail-moneda").textContent = factura.moneda;
    document.getElementById("detail-estado").textContent = factura.estado_pago;
    document.getElementById("detail-pago").textContent = `₡${factura.pago}`;
    document.getElementById("detail-total").textContent = factura.saldo_capital_inicial;
    document.getElementById("detail-date").textContent = factura.fecha;
  } else {
    document.getElementById("factura-details").innerHTML =
      "<p>Factura no encontrada.</p>";
  }
}
// Añadimos un evento para cargar los detalles de la factura al cargar la página
document.addEventListener("DOMContentLoaded", cargarDetallesFactura);