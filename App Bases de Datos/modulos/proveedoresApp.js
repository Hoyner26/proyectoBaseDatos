import {
  obtenerProveedores,
  agregarProveedor,
  eliminarProveedorPorId,
} from "./proveedores.js";
import { supabase } from "./supabaseClient.js";
const form = document.getElementById("proveedor-form");
// Asegúrate de que el formulario tenga el ID correcto en tu HTML
form?.addEventListener("submit", async (e) => {// Esta función se ejecuta al enviar el formulario
  e.preventDefault();

  const nuevoProveedor = {
    nombre_proveedor: form.nombre.value.trim(),
    razon_social: form.razonSocial.value.trim(),
    telefono: form.telefono.value.trim(),
    correo_electronico: form.correo_electronico.value.trim(),
    direccion: `${
      document.getElementById("distrito").selectedOptions[0].textContent
    }, ${document.getElementById("canton").selectedOptions[0].textContent}, ${
      document.getElementById("provincia-select").selectedOptions[0].textContent
    }`,
  };

  await agregarProveedor(nuevoProveedor);
  alert("✅ Proveedor agregado correctamente.");
  form.reset();
  cargarProveedores();
});

async function cargarProveedores() {// Esta función carga los proveedores desde la base de datos y los muestra en la tabla
  const proveedores = await obtenerProveedores();
  const lista = document.getElementById("lista-proveedores");
  lista.innerHTML = "";

  proveedores.forEach((p) => {
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

  document.querySelectorAll(".eliminar-btn").forEach((btn) => {// Añadimos un evento de clic a cada botón de eliminar
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm(`¿Eliminar proveedor con ID ${id}?`)) {
        await eliminarProveedorPorId(parseInt(id));
        cargarProveedores();
      }
    });
  });
}

async function cargarProvincias() {// Esta función carga las provincias desde la base de datos y las añade al select
  const { data, error } = await supabase.from("provincias").select("*");
  if (error) {
    console.error("Error al cargar provincias:", error);
    return;
  }

  const selectProvincia = document.getElementById("provincia-select");
  selectProvincia.innerHTML = '<option value="">Seleccione Provincia</option>';

  data.forEach((prov) => {
    const option = document.createElement("option");
    option.value = prov.id_provincia;
    option.textContent = prov.provincia;
    selectProvincia.appendChild(option);
  });

  // Habilitar cantones cuando se seleccione una provincia
  selectProvincia.addEventListener("change", async (e) => {// Esta función se ejecuta al cambiar la provincia
    const idProvincia = e.target.value;
    await cargarCantones(idProvincia);
    document.getElementById("canton").disabled = false;
    document.getElementById("distrito").innerHTML =
      '<option value="">Seleccione Distrito</option>';
    document.getElementById("distrito").disabled = true;
  });
}

async function cargarCantones(idProvincia) {// Esta función carga los cantones según la provincia seleccionada
  const { data, error } = await supabase
    .from("cantones")
    .select("*")
    .eq("id_provincia", idProvincia);

  const selectCanton = document.getElementById("canton");
  selectCanton.innerHTML = '<option value="">Seleccione Cantón</option>';

  if (data) {
    data.forEach((canton) => {// Por cada cantón, creamos una opción en el select
      const option = document.createElement("option");
      option.value = canton.id_canton;
      option.textContent = canton.canton;
      selectCanton.appendChild(option);
    });

    // Activar evento al cambiar el cantón
    selectCanton.addEventListener("change", async (e) => {
      const idCanton = e.target.value;
      await cargarDistritos(idCanton);
      document.getElementById("distrito").disabled = false;
    });
  }
}

async function cargarDistritos(idCanton) {// Esta función carga los distritos según el cantón seleccionado
  const { data, error } = await supabase
    .from("distritos")
    .select("*")
    .eq("id_canton", idCanton);

  const selectDistrito = document.getElementById("distrito");
  selectDistrito.innerHTML = '<option value="">Seleccione Distrito</option>';

  if (data) {
    data.forEach((distrito) => {
      const option = document.createElement("option");
      option.value = distrito.id_distrito;
      option.textContent = distrito.distrito;
      selectDistrito.appendChild(option);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProvincias();
  cargarProveedores(); // si ya lo tenés, dejalo como está
});
