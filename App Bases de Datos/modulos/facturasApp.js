import {obtenerFacturas, agregarFactura, eliminarFactura, obtenerFacturaPorId, actualizarFactura} from './facturas.js';
import {obtenerEmpleados} from './empleados.js';
import {obtenerPersonaPorId} from './personas.js';
import {obtenerPedidos} from './pedido.js';

const form = document.getElementById('form-factura');

form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(form);
    const factura = {
        id_pedido: formData.get('pedido_id'),
        id_empleado: formData.get('empleado_id'),
        moneda: formData.get('moneda'),
        estado_pago: formData.get('estado_pago'),
        total_pago: parseFloat(formData.get('total')),
        fecha_emision: formData.get('fecha_emision')
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
            <td>${factura.id_empleado}</td>
            <td>${factura.fecha_emision}</td>
            <td>${factura.id_pedido}</td>
            <td>${factura.moneda}</td>
            <td>${factura.estado_pago}</td>
            <td>₡${factura.total_pago.toFixed(2)}</td>
            <td>
                <button class="accion-btn ver-btn" data-id="${factura.id_factura}"><i class="fa-solid fa-eye"></i></button>
                <button class="accion-btn editar-btn" data-id="${factura.id_factura}"><i class="fa-solid fa-edit"></i></button>
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

    document.querySelectorAll('.editar-btn').forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            const factura = await obtenerFacturaPorId(id);
            if (factura) {
                form.id_factura.value = factura.id_factura;
                form.fecha.value = factura.fecha;
                form.id_empleado.value = factura.id_empleado;
                form.total.value = factura.total;
            }
        });
    });
}

async function cargarEmpleados() {
    const empleados = await obtenerEmpleados();
    const selectEmpleado = document.getElementById('empleado_id');
    selectEmpleado.innerHTML = '';

    empleados.forEach(async empleado => {
        if(empleado.cargo=='Cajero') {
            const persona = await obtenerPersonaPorId(empleado.id_persona);
            const option = document.createElement('option');
            option.value = empleado.id_empleado;
            option.textContent = `id: ${empleado.id_empleado} ${persona.nombre} ${persona.apellido1} ${persona.apellido2}`;
            selectEmpleado.appendChild(option);
        }
    });
}

async function cargarPedidos() {
    const pedidos = await obtenerPedidos();
    const selectPedido = document.getElementById('pedido_id');
    selectPedido.innerHTML = '';
    pedidos.forEach(pedido => {
        const option = document.createElement('option');
        option.value = pedido.id_pedido;
        option.textContent = `Pedido: ${pedido.id_pedido} - Fecha: ${pedido.fechahora}`;
        selectPedido.appendChild(option);
    });
}

// ✅ Solo esta línea para esperar al DOM
document.addEventListener('DOMContentLoaded', cargarFacturas);
document.addEventListener('DOMContentLoaded', cargarEmpleados);
document.addEventListener('DOMContentLoaded', prueba);
document.addEventListener('DOMContentLoaded', cargarPedidos);

