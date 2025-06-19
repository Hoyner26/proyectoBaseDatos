import {obtenerFacturas, agregarFactura, eliminarFactura, obtenerFacturaPorId, actualizarFactura, obtenerFacturaEspecialData} from './facturas.js';

async function cargarDetallesFactura() {
  const urlParams = new URLSearchParams(window.location.search);
  const idFactura = urlParams.get("id"); // Obtenemos el ID de la URL

  if (!idFactura) {
    document.getElementById("factura-details").innerHTML =
      "<p>No se ha especificado un ID de factura.</p>";
    return;
  }

  const factura = await obtenerFacturaEspecialData(idFactura);

  if (factura) {
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

document.addEventListener("DOMContentLoaded", cargarDetallesFactura);