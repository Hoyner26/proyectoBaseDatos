import { obtenerInventario, agregarInventario, eliminarInventario } from "./inventario.js";
import { obtenerProductos } from "./productos.js";

const form = document.getElementById('form-inventario');
const idSelect = document.getElementById('id_producto_select');
const nombreSelect = document.getElementById('nombre_producto_select');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevo = {
    id_producto: parseInt(document.getElementById('id_producto_select').value),
    nombre: document.getElementById('nombre_producto_select').value,
    cantidad: parseInt(document.getElementById('cantidad').value),
    fecha_ingreso: document.getElementById('fecha_ingreso').value
  };

  await agregarInventario(nuevo);
  form.reset();
  cargarInventarios();
});

async function cargarInventarios() {
  const inventarios = await obtenerInventario();
  const lista = document.getElementById('tabla-inventario');
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

async function cargarProductosSelects() {
  const productos = await obtenerProductos();
  if (!idSelect || !nombreSelect) return;
  idSelect.innerHTML = '<option value="" disabled selected>Seleccione ID</option>';
  nombreSelect.innerHTML = '<option value="" disabled selected>Seleccione Nombre</option>';

  productos.forEach(p => {
    const optId = document.createElement('option');
    optId.value = p.id_producto;
    optId.textContent = p.id_producto;
    idSelect.appendChild(optId);

    const optNombre = document.createElement('option');
    optNombre.value = p.nombre_producto || p.nombre;
    optNombre.textContent = p.nombre_producto || p.nombre;
    nombreSelect.appendChild(optNombre);
  });

  idSelect.addEventListener('change', () => {
    const selected = productos.find(p => String(p.id_producto) === idSelect.value);
    if (selected) nombreSelect.value = selected.nombre_producto || selected.nombre;
  });

  nombreSelect.addEventListener('change', () => {
    const selected = productos.find(p => (p.nombre_producto || p.nombre) === nombreSelect.value);
    if (selected) idSelect.value = selected.id_producto;
  });
}

document.addEventListener('DOMContentLoaded', cargarProductosSelects);
