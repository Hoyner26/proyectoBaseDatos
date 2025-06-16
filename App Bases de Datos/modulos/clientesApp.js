// modulos/clientesApp.js
import { obtenerClientes, agregarCliente, eliminarClientePorId } from './clientes.js';



const form = document.getElementById('cliente-form');
//const lista = document.getElementById('lista-clientes');




form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevoCliente = {
    id_persona: parseInt(document.getElementById('id_persona').value),
    tipo_cliente: document.getElementById('tipo_cliente').value,
    codigo_frecuente: document.getElementById('codigo_frecuente').value,
    estado_pago_preferido: document.getElementById('estado_pago_preferido').value,
    limite_credito: parseFloat(document.getElementById('limite_credito').value)
  };

  // ✅ VALIDACIÓN: evitar duplicados por id_persona
  const clientes = await obtenerClientes();
  const yaExiste = clientes.some(c => c.id_persona === nuevoCliente.id_persona);


  if (yaExiste) {
    alert("⚠️ Ya existe un cliente con ese ID de persona.");
    return;
  }
  // ✅ VALIDACIÓN: evitar duplicados por id_cliente
  const idExiste = clientes.some(c => c.id_cliente === nuevoCliente.id_cliente);
  if (idExiste) {
    alert("⚠️ Ya existe un cliente con ese ID de cliente.");
    return;
  }
  // ✅ VALIDACIÓN: evitar duplicados por codigo_frecuente
  const codigoExiste = clientes.some(c => c.codigo_frecuente === nuevoCliente.codigo_frecuente);
  if (codigoExiste) {
    alert("⚠️ Ya existe un cliente con ese código frecuente.");
    return;
  }


  await agregarCliente(nuevoCliente);
  form.reset();
  cargarClientes();
});

async function cargarClientes() {
  const clientes = await obtenerClientes();
  const lista = document.getElementById('lista-clientes');
  lista.innerHTML = '';

  clientes.forEach(cliente => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
    <td>${cliente.id_cliente}</td>
    <td>${cliente.id_persona}</td>
    <td>${cliente.tipo_cliente}</td>
    <td>${cliente.codigo_frecuente}</td>
    <td>${cliente.estado_pago_preferido}</td>
    <td>₡${cliente.limite_credito}</td>
    <td>
      <button class="accion-btn ver-btn" data-id="${cliente.id_cliente}"><i class="fa-solid fa-eye"></i></button>
      <button class="accion-btn editar-btn" data-id="${cliente.id_cliente}"><i class="fa-solid fa-edit"></i></button>
      <button class="accion-btn eliminar-btn" data-id="${cliente.id_cliente}"><i class="fa-solid fa-trash-can"></i></button>
    </td>
  `;
    lista.appendChild(fila);
  });

  document.querySelectorAll('.eliminar-btn').forEach(boton => {
    boton.addEventListener('click', async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar el cliente con ID ${id}?`)) {
        await eliminarClientePorId(parseInt(id));
        cargarClientes();
      }
    });
  });

}

document.addEventListener('DOMContentLoaded', cargarClientes);


// Cargar clientes al iniciar
cargarClientes();

import { supabase } from './supabaseClient.js';

async function cargarPersonasEnSelect() {
  const { data, error } = await supabase.from("persona").select("*");
  if (error) {
    console.error("Error al cargar personas:", error.message);
    return;
  }

  const select = document.getElementById("id_persona");
  data.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id_persona;
    option.textContent = `Id: ${p.id_persona} - ${p.nombre} ${p.apellido1} ${p.apellido2}`;
    select.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", cargarPersonasEnSelect);