import {obtenerFacturas, agregarFactura, eliminarFactura, obtenerFacturaPorId, actualizarFactura} from './facturas.js';
import {obtenerEmpleados} from './empleados.js';
import {obtenerPersonaPorId} from './personas.js';
import {obtenerPedidos} from './pedido.js';
import { supabase } from './supabaseClient.js';

const form = document.getElementById('factura-form');

form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(form);
    const factura = {
        //generar un id_factura autoincremental
        id_factura: formData.get('id_factura') ? parseInt(formData.get('id_factura')) : null,
        id_pedido: parseInt(formData.get('pedido_id')),
        id_empleado: parseInt(formData.get('empleado_id')),
        moneda: formData.get('moneda'),
        estado_pago: formData.get('estado_pago'),
        total_pago: parseFloat(formData.get('total_pago')),
        fecha_emision: formData.get('fecha_emision') ? new Date(formData.get('fecha_emision')).toISOString() : new Date().toISOString()

    };

    if (factura.id_factura) {
        await actualizarFactura(factura.id_factura, factura);
    } else {
        await agregarFactura(factura);
    }

    form.reset();
    cargarFacturas();
});

async function prueba() {
    const lista = document.getElementById('facturas-list');
    const fila = document.createElement('tr');
    fila.innerHTML='<td>mmm</td>';
    lista.appendChild(fila);
}

async function cargarFacturas() {
    const facturas = await obtenerFacturas();
    const lista = document.getElementById('facturas-list');
    lista.innerHTML = '';

    facturas.forEach(factura => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${factura.id_factura}</td>
            <td>${factura.id_pedido}</td>
            <td>${factura.id_empleado}</td>
            <td>${factura.moneda}</td>
            <td>${factura.estado_pago}</td>
            <td>₡${factura.total_pago.toFixed(2)}</td>
            <td>${factura.fecha_emision}</td>
            <td>
                
                <button class="accion-btn eliminar-btn" data-id="${factura.id_factura}"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
        lista.appendChild(fila);
    });

    document.querySelectorAll('.eliminar-btn').forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            await eliminarFactura(id);
            cargarFacturas();
        });
    });

    
}

async function cargarEmpleadosSelect() {
    const empleados = await obtenerEmpleados();
    const selectEmpleado = document.getElementById('empleado_id');
    empleados.forEach(empleado => {
        const option = document.createElement('option');
        option.value = empleado.id_empleado;
        option.textContent = `ID_Empleado: ${empleado.id_empleado}`;
        selectEmpleado.appendChild(option);
    });
}

async function cargarPedidosSelect() {
    const pedidos = await obtenerPedidos();
    const selectPedido = document.getElementById('pedido_id');
    pedidos.forEach(pedido => {
        const option = document.createElement('option');
        option.value = pedido.id_pedido;
        option.textContent = `ID: ${pedido.id_pedido}`;
        selectPedido.appendChild(option);
    });
    
}

// ✅ Solo esta línea para esperar al DOM
document.addEventListener("DOMContentLoaded", cargarPedidosSelect);
document.addEventListener('DOMContentLoaded', cargarFacturas);
document.addEventListener('DOMContentLoaded', cargarEmpleadosSelect);
document.addEventListener('DOMContentLoaded', prueba);
document.addEventListener('DOMContentLoaded', cargarPedidos);

