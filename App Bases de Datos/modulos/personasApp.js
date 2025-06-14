// personasApp.js
import {
  agregarPersona,
  obtenerPersonas,
  eliminarPersonaPorId,
} from "./personas.js";
import { supabase } from "./supabaseClient.js";

const form = document.getElementById("persona-form");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nueva = {
    id_persona: document.getElementById("id_persona").value,
    nombre: document.getElementById("nombre").value,
    apellido1: document.getElementById("apellido1").value,
    apellido2: document.getElementById("apellido2").value,
    // ¡CORRECCIÓN AQUÍ! Usar 'genero' y 'distrito' (singular)
    genero: parseInt(document.getElementById("genero").value),
    distrito: parseInt(document.getElementById("distrito").value),
    senas: document.getElementById("senas").value,
  };

  const personas = await obtenerPersonas();
  const yaExiste = personas.some(
    (p) => p.id_persona === parseInt(nueva.id_persona)
  );

  if (yaExiste) {
    alert("⚠️ Ya existe una persona con ese ID.");
    return;
  }

  const nombreCompleto =
    `${nueva.nombre} ${nueva.apellido1} ${nueva.apellido2}`.toLowerCase();
  const nombreExiste = personas.some((p) => {
    const completo = `${p.nombre} ${p.apellido1} ${p.apellido2}`.toLowerCase();
    return completo === nombreCompleto;
  });
  if (nombreExiste) {
    alert("⚠️ Ya existe una persona con ese nombre y apellidos.");
    return;
  }

  const telefonosInputs = document.querySelectorAll(
    'input[name="telefonos[]"]'
  );
  const correosInputs = document.querySelectorAll('input[name="correos[]"]');
  nueva.telefonos = Array.from(telefonosInputs).map((input) => input.value);
  nueva.correos = Array.from(correosInputs).map((input) => input.value);

  await agregarPersona(nueva);
  form.reset();
  cargarPersonas();
});

async function cargarPersonas() {
  const personas = await obtenerPersonas();
  const lista = document.getElementById("lista-personas");
  lista.innerHTML = "";

  personas.forEach((persona) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${persona.id_persona}</td>
      <td>${persona.nombre} ${persona.apellido1} ${persona.apellido2}</td>
      <td>${persona.telefonos?.map((t) => t.telefono).join(", ") || ""}</td>
      <td>${
        persona.correos?.map((c) => c.correo_electronico).join(", ") || ""
      }</td>
      <td>${persona.genero}</td>
      <td>${persona.provincia}, ${persona.canton}, ${persona.distrito}, ${
      persona.senas
    }</td>
      <td><button class="btn-eliminar" data-id="${
        persona.id_persona
      }">Eliminar</button></td>
    `;
    lista.appendChild(fila);
  });

  document.querySelectorAll(".btn-eliminar").forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar la persona con ID ${id}?`)) {
        await eliminarPersonaPorId(parseInt(id));
        cargarPersonas();
      }
    });
  });
}

async function cargarGeneros() {
  const { data } = await supabase.from("generos").select("*");
  // ¡CORRECCIÓN AQUÍ! Usar 'genero' (singular)
  const select = document.getElementById("genero");
  select.innerHTML =
    '<option value="" disabled selected>Seleccione Género</option>'; // Opcional: para restablecer las opciones
  data.forEach((g) => {
    const option = document.createElement("option");
    option.value = g.id_genero;
    option.textContent = g.genero;
    select.appendChild(option);
  });
}

async function cargarProvincias() {
  const { data } = await supabase.from("provincias").select("*");
  // ¡CORRECCIÓN AQUÍ! Usar 'provincia' (singular)
  const select = document.getElementById("provincia");
  select.innerHTML =
    '<option value="" disabled selected>Seleccione Provincia</option>'; // Opcional: para restablecer las opciones
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
  cargarPersonas();
  cargarGeneros();
  cargarProvincias();
});

document.getElementById("agregar-correo").addEventListener("click", () => {
  const container = document.getElementById("correos-container");
  const input = document.createElement("input");
  input.type = "email";
  input.name = "correos[]";
  input.placeholder = "Correo Electrónico";
  input.required = true;
  container.appendChild(input);
});

document.getElementById("agregar-telefono").addEventListener("click", () => {
  const container = document.getElementById("telefonos-container");
  const input = document.createElement("input");
  input.type = "tel";
  input.name = "telefonos[]";
  input.placeholder = "Teléfono";
  input.required = true;
  container.appendChild(input);
});
