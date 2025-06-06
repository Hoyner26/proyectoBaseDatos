// modulos/productosApp.js
import { obtenerProductos, agregarProducto, eliminarProductoPorId } from './productos.js';



const form = document.getElementById('producto-form');
//const lista = document.getElementById('lista-productos');



form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevo = {
    id_producto: parseInt(document.getElementById('id_producto').value),
    nombre_producto: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    precio: parseFloat(document.getElementById('precio').value),
    unidad_medida: document.getElementById('unidad').value,
    tipo_producto: document.getElementById('tipo').value,
    
  };
  // ✅ VALIDACIÓN: evitar duplicados por id_producto
  const productos = await obtenerProductos();
  const yaExiste = productos.some(p => p.id_producto === parseInt(nuevo.id_producto));
  if (yaExiste) {
    alert("⚠️ Ya existe un producto con ese ID.");
    return;
  }


  await agregarProducto(nuevo);
  form.reset();
  cargarProductos();
});



async function cargarProductos() {
  const productos = await obtenerProductos();
  const lista = document.getElementById('lista-productos');
  lista.innerHTML = '';

  productos.forEach(producto => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.id_producto}</td>
      <td>${producto.nombre_producto}</td>
      <td>${producto.descripcion}</td>
      <td>₡${producto.precio}</td>
      <td>${producto.unidad_medida}</td>
      <td>${producto.tipo_producto}</td>
      
      <td><button class="btn-eliminar" data-id="${producto.id_producto}">Eliminar</button></td>
    `;
    lista.appendChild(fila);
  });



  // Agregar eventos a los botones después de renderizar
  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar el producto con ID ${id}?`)) {
        await eliminarProductoPorId(parseInt(id));
        cargarProductos(); // recargar
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', cargarProductos);


cargarProductos();


