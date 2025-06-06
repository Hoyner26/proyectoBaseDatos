import { obtenerInventario, agregarInventario, eliminarInventario } from "./inventario.js";

const form = document.getElementById('inventario-form');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevo = {
    id_producto: parseInt(document.getElementById('id_producto').value),
    nombre: document.getElementById('nombre').value,
    cantidad: parseInt(document.getElementById('cantidad').value),
    fecha_ingreso: document.getElementById('fecha_ingreso').value
  };

  await agregarInventario(nuevo);
  form.reset();
  cargarInventarios();
});

async function cargarInventarios() {
  const inventarios = await obtenerInventario();
  const lista = document.getElementById('lista-inventarios');
  lista.innerHTML = '';

  inventarios.forEach(inventario => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${inventario.id_producto}</td>
      <td>${inventario.nombre}</td>
      <td>${inventario.cantidad}</td>
      <td>${inventario.fecha_ingreso}</td>
      <td><button class="btn-eliminar" data-id="${inventario.id_producto}">Eliminar</button></td>
    `;
    lista.appendChild(fila);
  });

  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar el producto con ID ${id}?`)) {
        await eliminarInventario(parseInt(id));
        cargarInventarios();
      }
    });
  });
}

// ✅ Solo esta línea para esperar al DOM
document.addEventListener('DOMContentLoaded', cargarInventarios);
