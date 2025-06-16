import { obtenerProveedores, agregarProveedor, eliminarProveedorPorId } from './proveedores.js';

const form = document.getElementById("proveedor-form");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoProveedor = {
    id_proveedor: parseInt(form.id_proveedor.value),
    nombre_proveedor: form.nombre.value.trim(),
    razon_social: form.razonSocial.value.trim(),
    telefono: form.telefono.value.trim(),
    correo_electronico: form.correo_electronico.value.trim(),
    direccion: form.direccion.value.trim()
  };

  // Validación: evitar duplicados por ID
  const proveedores = await obtenerProveedores();
  if (proveedores.some(p => p.id_proveedor === nuevoProveedor.id_proveedor)) {
    alert("⚠️ Ya existe un proveedor con ese ID.");
    return;
  }

  await agregarProveedor(nuevoProveedor);
  alert("✅ Proveedor agregado correctamente.");
  form.reset();
  cargarProveedores();
});

async function cargarProveedores() {
  const proveedores = await obtenerProveedores();
  const lista = document.getElementById("lista-proveedores");
  lista.innerHTML = "";

  proveedores.forEach(p => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${p.id_proveedor}</td>
      <td>${p.nombre_proveedor}</td>
      <td>${p.razon_social}</td>
      <td>${p.telefono}</td>
      <td>${p.correo_electronico}</td>
      <td>${p.direccion}</td>
      <td>
        <button class="accion-btn ver-btn" data-id="${p.id_proveedor}"><i class="fa-solid fa-eye"></i></button>
        <button class="accion-btn editar-btn" data-id="${p.id_proveedor}"><i class="fa-solid fa-edit"></i></button>
        <button class="accion-btn eliminar-btn" data-id="${p.id_proveedor}"><i class="fa-solid fa-trash-can"></i></button>
      </td>
    `;
    lista.appendChild(fila);
  });

  document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm(`¿Eliminar proveedor con ID ${id}?`)) {
        await eliminarProveedorPorId(parseInt(id));
        cargarProveedores();
      }
    });
  });

  
}

document.addEventListener("DOMContentLoaded", cargarProveedores);
