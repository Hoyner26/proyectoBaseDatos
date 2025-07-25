// modulos/productos.js
import { supabase } from './supabaseClient.js';

export async function obtenerProductos() {// Esta función obtiene todos los productos de la base de datos
  const { data, error } = await supabase.from('producto').select('*');
  if (error) console.error('Error al obtener productos:', error.message);
  return data || [];
}

export async function agregarProducto(producto) {// Esta función agrega un nuevo producto a la base de datos
  const { error } = await supabase.from('producto').insert([producto]);
  if (error) console.error('Error al insertar producto:', error.message);
}


export async function eliminarProductoPorId(id) {// Esta función elimina un producto por su id_producto

  // 0. Eliminar de detalle_venta
  const { error: errorDetalleVenta } = await supabase
    .from("detalle_venta")
    .delete()
    .eq("id_producto", id);
  if (errorDetalleVenta) {
    console.error("Error al eliminar de detalle_venta:", errorDetalleVenta.message);
    alert("No se pudo eliminar el producto de detalle_venta.");
    return;
  }
  // 1. Eliminar del inventario
  const { error: errorInventario } = await supabase
    .from("inventario")
    .delete()
    .eq("id_producto", id);
  if (errorInventario) {
    console.error("Error al eliminar del inventario:", errorInventario.message);
    alert("No se pudo eliminar el producto del inventario.");
    return;
  }

  // 2. Eliminar el producto
  const { error: errorProducto } = await supabase
    .from("producto")
    .delete()
    .eq("id_producto", id);
  if (errorProducto) {
    console.error("Error al eliminar:", errorProducto.message);
    alert("No se pudo eliminar el producto.");
  } else {
    console.log(`Producto con ID ${id} eliminado`);
  }
}

function cargarTablaProductos() {// Esta función carga los productos en la tabla del HTML
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";

  productos.forEach((producto) => {// Iteramos sobre cada producto y creamos una fila en la tabla
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>
        <button class="accion-btn ver-btn">👁 Mostrar</button>
        <button class="accion-btn editar-btn">✏ Editar</button>
        <button class="accion-btn eliminar-btn">🗑 Eliminar</button>
      </td>
    `;

    tbody.appendChild(fila);
  });
}

document.addEventListener("DOMContentLoaded", cargarTablaProductos);// Añadimos el evento para cargar la tabla al cargar la página