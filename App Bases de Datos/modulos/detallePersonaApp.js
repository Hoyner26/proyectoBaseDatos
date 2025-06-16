// modulos/detallePersonaApp.js
import { obtenerPersonas } from "./personas.js"; // Reutilizamos la función para obtener todas las personas
import "./logout.js"; // Asegúrate de que el logout funcione en esta página

async function cargarDetallesPersona() {
  const urlParams = new URLSearchParams(window.location.search);
  const idPersona = urlParams.get("id"); // Obtenemos el ID de la URL

  if (!idPersona) {
    document.getElementById("persona-details").innerHTML =
      "<p>No se ha especificado un ID de persona.</p>";
    return;
  }

  const personas = await obtenerPersonas();
  const persona = personas.find((p) => p.id_persona == idPersona); // Usamos == para comparación flexible

  if (persona) {
    document.getElementById("detail-id").textContent = persona.id_persona;
    document.getElementById("detail-nombre").textContent = `${persona.nombre} ${
      persona.apellido1
    } ${persona.apellido2 || ""}`;
    document.getElementById("detail-genero").textContent = persona.genero; // Asumiendo que 'genero' ya es un string legible
    document.getElementById(
      "detail-direccion"
    ).textContent = `${persona.provincia}, ${persona.canton}, ${persona.distrito}, ${persona.senas}`;

    const telefonosList = document.getElementById("detail-telefonos");
    telefonosList.innerHTML = "";
    if (persona.telefonos && persona.telefonos.length > 0) {
      persona.telefonos.forEach((tel) => {
        const li = document.createElement("li");
        li.textContent = typeof tel === "object" ? tel.telefono : tel; // Asegúrate de acceder a la propiedad correcta
        telefonosList.appendChild(li);
      });
    } else {
      telefonosList.innerHTML = "<li>No hay teléfonos registrados.</li>";
    }

    const correosList = document.getElementById("detail-correos");
    correosList.innerHTML = "";
    if (persona.correos && persona.correos.length > 0) {
      persona.correos.forEach((email) => {
        const li = document.createElement("li");
        li.textContent =
          typeof email === "object" ? email.correo_electronico : email; // Asegúrate de acceder a la propiedad correcta
        correosList.appendChild(li);
      });
    } else {
      correosList.innerHTML =
        "<li>No hay correos electrónicos registrados.</li>";
    }
  } else {
    document.getElementById("persona-details").innerHTML =
      "<p>Persona no encontrada.</p>";
  }
}

document.addEventListener("DOMContentLoaded", cargarDetallesPersona);
