// modulos/empleadosApp.js
import { obtenerEmpleados, agregarEmpleado, eliminarEmpleado } from './empleados.js';

const form = document.getElementById('empleado-form');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevo = {
    id_empleado: parseInt(document.getElementById('id_empleado').value),
    id_persona: parseInt(document.getElementById('id_persona').value),
    fecha_ingreso: document.getElementById('fecha_ingreso').value,
    salario: parseFloat(document.getElementById('salario').value),
    cargo: document.getElementById('cargo').value
  };

  // ✅ VALIDACIÓN: evitar duplicados por id_persona
  const empleados = await obtenerEmpleados();
  const yaExiste = empleados.some(e => e.id_persona === nuevo.id_persona);
  if (yaExiste) {
    alert("⚠️ Ya existe un empleado con ese ID de persona.");
    return;
  }
  // ✅ VALIDACIÓN: evitar duplicados por id_empleado
  const idExiste = empleados.some(e => e.id_empleado === nuevo.id_empleado);
  if (idExiste) {
    alert("⚠️ Ya existe un empleado con ese ID de empleado.");
    return;
  }




  await agregarEmpleado(nuevo);
  form.reset();
  cargarEmpleados();
});

async function cargarEmpleados() {
  const empleados = await obtenerEmpleados();
  const lista = document.getElementById('lista-empleados');
  lista.innerHTML = '';

  empleados.forEach(empleado => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${empleado.id_empleado}</td>
      <td>${empleado.id_persona}</td>
      <td>${empleado.fecha_ingreso}</td> 
      <td>₡${empleado.salario}</td>
      <td>${empleado.cargo}</td>
      <td><button class="btn-eliminar" data-id="${empleado.id_empleado}">Eliminar</button></td>
    `;
    lista.appendChild(fila);
  });

  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar el empleado con ID ${id}?`)) {
        await eliminarEmpleado(parseInt(id));
        cargarEmpleados();
      }
    });
  });
}

cargarEmpleados();
