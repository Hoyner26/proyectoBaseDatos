// modulos/productosApp.js
import { obtenerProductos, agregarProducto, eliminarProductoPorId } from './productos.js';



const form = document.getElementById('producto-form');
//const lista = document.getElementById('lista-productos');



form?.addEventListener('submit', async (e) => {// Añadir un evento de envío al formulario de productos
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



async function cargarProductos() {// Esta función carga los productos desde la base de datos y los muestra en la tabla
  const productos = await obtenerProductos();
  const lista = document.getElementById('lista-productos');
  lista.innerHTML = '';

  productos.forEach(producto => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
  <td>${producto.id_producto}</td>
  <td>${producto.nombre_producto}</td>
  <td>${producto.descripcion}</td>
  <td>₡${producto.precio.toFixed(2)}</td>
  <td>${producto.unidad_medida}</td>
  <td>${producto.tipo_producto}</td>
  <td>
    
    <button class="accion-btn eliminar-btn" data-id="${producto.id_producto}"><i class="fa-solid fa-trash-can"></i></button>
  </td>
`;
    lista.appendChild(fila);
  });



  document.querySelectorAll('.eliminar-btn').forEach(boton => {// Añadimos un evento de clic a cada botón de eliminar
    boton.addEventListener('click', async () => {
      const id = boton.dataset.id;
      if (confirm(`¿Seguro que desea eliminar el producto con ID ${id}?`)) {
        
        await eliminarProductoPorId(parseInt(id));
        cargarProductos();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', cargarProductos);


cargarProductos();


