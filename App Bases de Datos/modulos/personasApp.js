// modulos/personasApp.js
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
      <td>${persona.nombre} ${persona.apellido1} ${persona.apellido2 || ""}</td>
      <td class="actions-column">
          <a href="detalle-persona.html?id=${
            persona.id_persona
          }" class="show-more-button-link"><i class="fa-solid fa-eye"></i> Mostrar Más</a>
          <button class="edit-button" data-id="${
            persona.id_persona
          }"><i class="fa-solid fa-edit"></i></button>
          <button class="delete-button" data-id="${
            persona.id_persona
          }"><i class="fa-solid fa-trash-can"></i></button>
      </td>
    `;
    lista.appendChild(fila);
  });

  // Event listeners para los botones de eliminar (ya existía, lo mantengo aquí)
  document.querySelectorAll(".delete-button").forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar la persona con ID ${id}?`)) {
        await eliminarPersonaPorId(parseInt(id));
        cargarPersonas();
      }
    });
  });

  // Asumo que tienes botones de editar, añado un listener básico aquí.
  // Deberás implementar la lógica de edición.
  document.querySelectorAll(".edit-button").forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      alert(
        `Funcionalidad de editar para la persona con ID: ${id} (no implementada aún)`
      );
      // Aquí iría la lógica para cargar los datos de la persona en el formulario de edición
    });
  });
}

async function cargarGeneros() {
  const { data } = await supabase.from("generos").select("*");
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
