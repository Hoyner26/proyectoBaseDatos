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
async function cargarProvincias() {
  const { data } = await supabase.from("provincias").select("*");
  const select = document.getElementById("provincia");
  select.innerHTML =
    '<option value="" disabled selected>Seleccione Provincia</option>';
  data.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id_provincia;
    option.textContent = p.provincia;
    select.appendChild(option);
  });
}

document.getElementById("provincia").addEventListener("change", async (e) => {
  const idProvincia = e.target.value;
  const { data } = await supabase
    .from("cantones")
    .select("*")
    .eq("id_provincia", idProvincia);
  const selectCanton = document.getElementById("canton");
  selectCanton.innerHTML =
    "<option disabled selected>Seleccione Cantón</option>";
  selectCanton.disabled = false;
  document.getElementById("distrito").disabled = true;
  document.getElementById("distrito").innerHTML =
    "<option disabled selected>Seleccione Distrito</option>";
  data.forEach((c) => {
    const option = document.createElement("option");
    option.value = c.id_canton;
    option.textContent = c.canton;
    selectCanton.appendChild(option);
  });
});

document.getElementById("canton").addEventListener("change", async (e) => {
  const idCanton = e.target.value;
  const { data } = await supabase
    .from("distritos")
    .select("*")
    .eq("id_canton", idCanton);
  const selectDistrito = document.getElementById("distrito");
  selectDistrito.innerHTML =
    "<option disabled selected>Seleccione Distrito</option>";
  selectDistrito.disabled = false;
  data.forEach((d) => {
    const option = document.createElement("option");
    option.value = d.id_distrito;
    option.textContent = d.distrito;
    selectDistrito.appendChild(option);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  cargarProveedores();
  cargarProvincias();
});
