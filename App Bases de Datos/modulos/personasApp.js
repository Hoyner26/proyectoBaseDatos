// personasApp.js
import { agregarPersona, obtenerPersonas, eliminarPersonaPorId } from './personas.js';

const form = document.getElementById('persona-form');
//const lista = document.getElementById('lista-personas');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nueva = {
    id_persona: document.getElementById('id_persona').value,
    nombre: document.getElementById('nombre').value,
    apellido1: document.getElementById('apellido1').value,
    apellido2: document.getElementById('apellido2').value,
    fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
    telefono: document.getElementById('telefono').value,
    correo: document.getElementById('correo').value,
    genero: document.getElementById('genero').value,
    direccion: document.getElementById('direccion').value
  };
  // ✅ VALIDACIÓN: evitar duplicados por id_persona
  const personas = await obtenerPersonas();
  const yaExiste = personas.some(p => p.id_persona === parseInt(nueva.id_persona));
  
  if (yaExiste) {
    alert("⚠️ Ya existe una persona con ese ID.");
    return;
  }
  
  // ✅ VALIDACIÓN: evitar duplicados por nombre y apellidos
  const nombreCompleto = `${nueva.nombre} ${nueva.apellido1} ${nueva.apellido2}`.toLowerCase();
  const nombreExiste = personas.some(p => {
    const completo = `${p.nombre} ${p.apellido1} ${p.apellido2}`.toLowerCase();
    return completo === nombreCompleto;
  });
  if (nombreExiste) {
    alert("⚠️ Ya existe una persona con ese nombre y apellidos.");
    return;
  }
  
  // ✅ VALIDACIÓN: evitar duplicados por correo
  const correo = nueva.correo.toLowerCase();
  const correoExiste = personas.some(p => p.correo.toLowerCase() === correo);
  if (correoExiste) {
    alert("⚠️ Ya existe una persona con ese correo electrónico.");
    return;
  }
  
  // ✅ VALIDACIÓN: evitar duplicados por teléfono
  const telefono = nueva.telefono;
  const telefonoExiste = personas.some(p => p.telefono === telefono);
  if (telefonoExiste) {
    alert("⚠️ Ya existe una persona con ese número de teléfono.");
    return;
  }


  await agregarPersona(nueva);
  form.reset();
  cargarPersonas();
});

async function cargarPersonas() {
  const personas = await obtenerPersonas();
  const lista = document.getElementById('lista-personas');
  lista.innerHTML = '';

  personas.forEach(persona => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${persona.id_persona}</td>
      <td>${persona.nombre} ${persona.apellido1} ${persona.apellido2}</td>
      <td>${persona.fecha_nacimiento}</td>
      <td>${persona.telefono}</td>
      <td>${persona.correo}</td>
      <td>${persona.genero}</td>
      <td>${persona.direccion}</td>
      <td><button class="btn-eliminar" data-id="${persona.id_persona}">Eliminar</button></td>
    `;
    lista.appendChild(fila);
  });

  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar la persona con ID ${id}?`)) {
        await eliminarPersonaPorId(parseInt(id));
        cargarPersonas();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', cargarPersonas);

cargarPersonas();
