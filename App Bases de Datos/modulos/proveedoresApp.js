// modulos/proveedoresApp.js
import { obtenerProveedores, agregarProveedor, eliminarProveedorPorId } from './proveedores.js';

const form = document.getElementById('proveedor-form');
const lista = document.getElementById('lista-proveedores');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevo = {

    id_proveedor: document.getElementById('id_proveedor').value,
    nombre_proveedor: document.getElementById('nombre').value,
    razon_social: document.getElementById('razonSocial').value,
    telefono: document.getElementById('telefono').value,
    correo_electronico: document.getElementById('correo_electronico').value,
    direccion: document.getElementById('direccion').value,
  };
  await agregarProveedor(nuevo);
  form.reset();
  cargarProveedores();
});

async function cargarProveedores() {
  const proveedores = await obtenerProveedores();
  const lista = document.getElementById('lista-proveedores');
  lista.innerHTML = '';

  proveedores.forEach(proveedor => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${proveedor.id_proveedor}</td>
      <td>${proveedor.nombre_proveedor}</td>
      <td>${proveedor.razon_social}</td>
      <td>${proveedor.telefono}</td>
      <td>${proveedor.correo_electronico}</td>
      <td>${proveedor.direccion}</td>
      <td><button class="btn-eliminar" data-id="${proveedor.id_proveedor}">Eliminar</button></td>
      
    `;
    lista.appendChild(fila);
  });

  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar la persona con ID ${id}?`)) {
        await eliminarProveedorPorId(parseInt(id));
        cargarProveedores();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', cargarProveedores);

cargarProveedores();

