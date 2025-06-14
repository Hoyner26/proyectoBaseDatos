import {
  agregarPersona,
  obtenerPersonas,
  eliminarPersonaPorId,
} from "./personas.js";
import { supabase } from "./supabaseClient.js";

const form = document.getElementById("persona-form");

async function cargarGeneros() {
  const { data, error } = await supabase.from("genero").select("*");
  if (error) {
    console.error("Error cargando géneros:", error);
    return;
  }
  const select = document.getElementById("genero");
  select.innerHTML =
    '<option value="" disabled selected>Seleccione Género</option>';
  data.forEach((g) => {
    const option = document.createElement("option");
    option.value = g.id_genero;
    option.textContent = g.genero;
    select.appendChild(option);
  });
}

async function cargarProvincias() {
  const { data, error } = await supabase.from("provincias").select("*");
  if (error) {
    console.error("Error cargando provincias:", error);
    return;
  }
  const select = document.getElementById("provincia");
  select.innerHTML =
    '<option value="" disabled selected>Seleccione Provincia</option>';
  data.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id_provincia;
    option.textContent = p.provincia;
    select.appendChild(option);
  });
  document.getElementById("canton").innerHTML =
    '<option value="" disabled selected>Seleccione Cantón</option>';
  document.getElementById("canton").disabled = true;
  document.getElementById("distrito").innerHTML =
    '<option value="" disabled selected>Seleccione Distrito</option>';
  document.getElementById("distrito").disabled = true;
}

document.getElementById("provincia").addEventListener("change", async (e) => {
  const provinciaId = e.target.value;
  const { data, error } = await supabase
    .from("cantones")
    .select("*")
    .eq("id_provincia", provinciaId);
  if (error) {
    console.error("Error cargando cantones:", error);
    return;
  }
  const selectCanton = document.getElementById("canton");
  selectCanton.innerHTML =
    '<option value="" disabled selected>Seleccione Cantón</option>';
  data.forEach((c) => {
    const option = document.createElement("option");
    option.value = c.id_canton;
    option.textContent = c.canton;
    selectCanton.appendChild(option);
  });
  selectCanton.disabled = false;
  // Reset distrito
  const selectDistrito = document.getElementById("distrito");
  selectDistrito.innerHTML =
    '<option value="" disabled selected>Seleccione Distrito</option>';
  selectDistrito.disabled = true;
});

document.getElementById("canton").addEventListener("change", async (e) => {
  const cantonId = e.target.value;
  const { data, error } = await supabase
    .from("distritos")
    .select("*")
    .eq("id_canton", cantonId);
  if (error) {
    console.error("Error cargando distritos:", error);
    return;
  }
  const selectDistrito = document.getElementById("distrito");
  selectDistrito.innerHTML =
    '<option value="" disabled selected>Seleccione Distrito</option>';
  data.forEach((d) => {
    const option = document.createElement("option");
    option.value = d.id_distrito;
    option.textContent = d.distrito;
    selectDistrito.appendChild(option);
  });
  selectDistrito.disabled = false;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevaPersona = {
    id_persona: form.id_persona.value.trim(),
    nombre: form.nombre.value.trim(),
    apellido1: form.apellido1.value.trim(),
    apellido2: form.apellido2.value.trim(),
    genero: parseInt(form.genero.value),
    distrito: parseInt(form.distrito.value),
    senas: form.senas.value.trim(),
  };

  // Validar campos mínimos
  if (
    !nuevaPersona.id_persona ||
    !nuevaPersona.nombre ||
    !nuevaPersona.apellido1 ||
    !nuevaPersona.genero ||
    !nuevaPersona.distrito
  ) {
    alert("Por favor complete todos los campos requeridos.");
    return;
  }

  // Validar que no exista la persona ya
  const personas = await obtenerPersonas();
  if (personas.some((p) => p.id_persona === nuevaPersona.id_persona)) {
    alert("Ya existe una persona con esa cédula.");
    return;
  }

  try {
    await agregarPersona(nuevaPersona);
    alert("Persona agregada correctamente.");
    form.reset();
    cargarPersonas();
    // Reset selects canton y distrito
    document.getElementById("canton").innerHTML =
      '<option value="" disabled selected>Seleccione Cantón</option>';
    document.getElementById("canton").disabled = true;
    document.getElementById("distrito").innerHTML =
      '<option value="" disabled selected>Seleccione Distrito</option>';
    document.getElementById("distrito").disabled = true;
  } catch (error) {
    console.error("Error agregando persona:", error);
    alert("Error agregando persona. Revise la consola.");
  }
});

async function cargarPersonas() {
  const personas = await obtenerPersonas();
  const lista = document.getElementById("lista-personas");
  lista.innerHTML = "";

  personas.forEach((p) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${p.id_persona}</td>
      <td>${p.nombre} ${p.apellido1} ${p.apellido2}</td>
      <td>${p.genero}</td>
      <td>${p.distrito}</td>
      <td>${p.senas}</td>
      <td><button class="btn-eliminar" data-id="${p.id_persona}">Eliminar</button></td>
    `;
    lista.appendChild(fila);
  });

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm(`¿Eliminar persona con ID ${id}?`)) {
        await eliminarPersonaPorId(id);
        cargarPersonas();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarGeneros();
  cargarProvincias();
  cargarPersonas();
});
