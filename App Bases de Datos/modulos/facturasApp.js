import {obtenerFacturas, agregarFactura, eliminarFactura, obtenerFacturaPorId, actualizarFactura} from './facturas.js';
import {obtenerEmpleados} from './empleados.js';
import {obtenerPersonaPorId} from './personas.js';
import {obtenerPedidos,obtenerPedidoPorId} from './pedido.js';
import {obtenerVentaPorId} from './ventas.js';

const form = document.getElementById('factura-form');// Asegúrate de que el formulario tenga este ID en tu HTML

form?.addEventListener('submit', async (event) => {// Esta función se ejecuta al enviar el formulario
    event.preventDefault();
    const selectPedido = document.getElementById('pedido_id').value;
    const pedido = await obtenerPedidoPorId(selectPedido);
    if(pedido.cantidad_faltante == 0) {// Si el pedido está completado, no se permite cambiar moneda ni estado de pago
        const tal = await obtenerVentaPorId(pedido.id_venta);
        const factura = {
        id_pedido: parseInt(document.getElementById('pedido_id').value),
        id_empleado: parseInt(document.getElementById('empleado_id').value),
        moneda: 'Colones',
        estado_pago: 'Completado',
        total_pago: tal.total,
        fecha_emision: document.getElementById('fecha_emision').value
        };
        await agregarFactura(factura);// Agregar la factura a la base de datos
        form.reset();
        cargarFacturas();
        alIniciar();
    }
    else{
        const factura = {// Obtenemos los datos del formulario
        id_pedido: parseInt(document.getElementById('pedido_id').value),
        id_empleado: parseInt(document.getElementById('empleado_id').value),
        moneda: document.getElementById('moneda_id').value,
        estado_pago: document.getElementById('estado_pago_id').value,
        total_pago: parseInt(document.getElementById('total').value),
        fecha_emision: document.getElementById('fecha_emision').value
        };
        await agregarFactura(factura);
        form.reset();
        cargarFacturas();
        alIniciar();
    }
});



async function cargarFacturas() {// Esta función carga las facturas desde la base de datos y las muestra en la tabla
    const facturas = await obtenerFacturas();
    const lista = document.getElementById('facturas-list');
    lista.innerHTML = '';

    facturas.forEach(factura => {// Por cada factura, creamos una fila en la tabla
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${factura.id_factura}</td>
            <td>${factura.id_pedido}</td>
            <td>${factura.id_empleado}</td>
            <td>${factura.moneda}</td>
            <td>${factura.estado_pago}</td>
            <td>₡${factura.total_pago.toFixed(2)}</td>
            <td>${factura.fecha_emision}</td>

            <td class="actions-column">            
                <a href="detalle-facturas.html?id=${factura.id_factura}" class="show-more-button-link"><i class="fa-solid fa-eye"></i> Mostrar Más</a>
                <button class="accion-btn eliminar-btn" data-id="${factura.id_factura}"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
        lista.appendChild(fila);
    });

    document.querySelectorAll('.eliminar-btn').forEach(boton => {// Añadimos un evento de clic a cada botón de eliminar
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            await eliminarFactura(id);
            cargarFacturas();
        });
    });
}

async function cargarEmpleados() {// Esta función carga los empleados desde la base de datos y los muestra en el select
    const empleados = await obtenerEmpleados();
    const selectEmpleado = document.getElementById('empleado_id');
    empleados.forEach(async empleado => {// Por cada empleado, creamos una opción en el select
        if(empleado.cargo=='Cajero'){// Solo mostramos los empleados que son cajeros
            const option = document.createElement('option');
            option.value = empleado.id_empleado;
            const persona = await obtenerPersonaPorId(empleado.id_persona);
            option.textContent = `ID: ${empleado.id_empleado} - Nombre: ${persona.nombre} ${persona.apellido1} ${persona.apellido2}`;
            selectEmpleado.appendChild(option);
        }
    });
}

async function cargarPedidos() {// Esta función carga los pedidos desde la base de datos y los muestra en el select
    const pedidos = await obtenerPedidos();
    const selectPedido = document.getElementById('pedido_id');
    pedidos.forEach(pedido => {
        const option = document.createElement('option');
        option.value = pedido.id_pedido;
        option.textContent = `Pedido: ${pedido.id_pedido} - Estado: ${(pedido.cantidad_faltante==0) ? "Completado" : "Pendiente"}`;
        selectPedido.appendChild(option);
    });
    
}

async function siCompletado() {// Esta función se ejecuta al cambiar el pedido seleccionado
    const selectPedido = document.getElementById('pedido_id').value;
    const pedido = await obtenerPedidoPorId(selectPedido);
    if(pedido.cantidad_faltante == 0) {
        const estadoPago = document.getElementById('estado_pago_id');
        estadoPago.style.display = 'none';
        estadoPago.disabled = true;
        const moneda = document.getElementById('moneda_id');
        moneda.style.display = 'none';
        moneda.disabled = true;
        const totalPago = document.getElementById('total');
        totalPago.style.display = 'none';
        totalPago.disabled = true;
    }
    else {
        const estadoPago = document.getElementById('estado_pago_id');
        estadoPago.style.display = '';
        estadoPago.disabled = false;
        const moneda = document.getElementById('moneda_id');
        moneda.style.display = '';
        moneda.disabled = false;
        const totalPago = document.getElementById('total');
        totalPago.style.display = '';
        totalPago.disabled = false;
    }
}

async function alIniciar() {// Esta función se ejecuta al iniciar la página
    const estadoPago = document.getElementById('estado_pago_id');
    estadoPago.style.display = 'none';
    estadoPago.disabled = true;
    const moneda = document.getElementById('moneda_id');
    moneda.style.display = 'none';
    moneda.disabled = true;
    const totalPago = document.getElementById('total');
    totalPago.style.display = 'none';
    totalPago.disabled = true;
}

// ✅ Solo esta línea para esperar al DOM
document.addEventListener('DOMContentLoaded', cargarFacturas);
document.addEventListener('DOMContentLoaded', cargarEmpleados);
document.addEventListener('DOMContentLoaded', cargarPedidos);
document.addEventListener('DOMContentLoaded', alIniciar);
document.getElementById('pedido_id').addEventListener('change', siCompletado);


