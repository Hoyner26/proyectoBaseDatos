// modulos/empleadosApp.js
import {
  obtenerEmpleados,
  agregarEmpleado,
  eliminarEmpleado,
} from "./empleados.js";

const form = document.getElementById("empleado-form");

form?.addEventListener("submit", async (e) => {// Esta función se ejecuta al enviar el formulario
  e.preventDefault();
  const nuevo = {
    id_persona: parseInt(document.getElementById("id_persona").value),
    fecha_ingreso: document.getElementById("fecha_ingreso").value,
    salario: parseFloat(document.getElementById("salario").value),
    cargo: document.getElementById("cargo").value,
  };

  // ✅ VALIDACIÓN: evitar duplicados por id_persona
  const empleados = await obtenerEmpleados();// Obtenemos la lista de empleados existentes
  const yaExiste = empleados.some((e) => e.id_persona === nuevo.id_persona);
  if (yaExiste) {
    alert("⚠️ Ya existe un empleado con ese ID de persona.");
    return;
  }

  await agregarEmpleado(nuevo);
  form.reset();
  cargarEmpleados();
});

async function cargarEmpleados() {// Esta función carga los empleados desde la base de datos y los muestra en la tabla
  const empleados = await obtenerEmpleados();
  const lista = document.getElementById("lista-empleados");
  lista.innerHTML = "";

  empleados.forEach((empleado) => {// Por cada empleado, creamos una fila en la tabla
    const fila = document.createElement("tr");
    fila.innerHTML = `
  <td>${empleado.id_empleado}</td>
  <td>${empleado.id_persona}</td>
  <td>${empleado.fecha_ingreso}</td>
  <td>₡${empleado.salario}</td>
  <td>${empleado.cargo}</td>
  <td>
    
    <button class="accion-btn eliminar-btn" data-id="${empleado.id_empleado}"><i class="fa-solid fa-trash-can"></i></button>
  </td>
`;
    lista.appendChild(fila);
  });

  document.querySelectorAll(".eliminar-btn").forEach((boton) => {// Añadimos un evento de clic a cada botón de eliminar
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar el empleado con ID ${id}?`)) {
        await eliminarEmpleado(parseInt(id));
        cargarEmpleados();
      }
    });
  });
}

import { supabase } from "./supabaseClient.js";
async function cargarPersonasEnSelect() {// Esta función carga las personas desde la base de datos y las muestra en un select
  const { data, error } = await supabase.from("persona").select("*");
  if (error) {
    console.error("Error cargando personas:", error.message);
    return;
  }

  const select = document.getElementById("id_persona");
  data.forEach((p) => {
    const opcion = document.createElement("option");
    opcion.value = p.id_persona;
    opcion.textContent = `Id: ${p.id_persona} - ${p.nombre} ${p.apellido1} ${p.apellido2}`;
    select.appendChild(opcion);
  });
}

document.addEventListener("DOMContentLoaded", cargarPersonasEnSelect);// Añadimos el evento para cargar las personas al cargar la página

cargarEmpleados();// Cargamos los empleados al cargar la página
