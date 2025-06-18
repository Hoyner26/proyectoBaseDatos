import {
  obtenerVentas,
  agregarVentaCompleta,
  eliminarVentaPorId,
} from "./ventas.js";
import { supabase } from "./supabaseClient.js";

const form = document.getElementById("venta-form");
const listaVentas = document.getElementById("lista-ventas");
const productosContainer = document.getElementById("productos-container");
const agregarProductoBtn = document.getElementById("agregar-producto");
const totalInput = document.getElementById("total");

let productosDisponibles = []; // Almacenará los productos para no pedirlos a la BD cada vez

// --- Carga de Datos Iniciales ---

async function cargarDatosIniciales() {
  await Promise.all([
    cargarClientes(),
    cargarEmpleados(),
    cargarProductos(),
    cargarVentas(),
  ]);
  if (productosContainer.children.length === 0) {
    agregarFilaProducto(); // Agregar una fila de producto por defecto al cargar
  }
}

async function cargarVentas() {
  const ventas = await obtenerVentas();
  listaVentas.innerHTML = "";

  if (!ventas.length) {
    listaVentas.innerHTML =
      '<tr><td colspan="7">No hay ventas registradas.</td></tr>';
    return;
  }

  ventas.forEach((venta) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${venta.id_venta}</td>
      <td>${venta.nombre_cliente}</td>
      <td>${venta.nombre_empleado}</td>
      <td>${new Date(venta.fecha).toLocaleDateString("es-CR")}</td>
      <td>₡${parseFloat(venta.total).toFixed(2)}</td>
      <td>${venta.estado_pago}</td>
      <td class="actions-column">
        <a href="detalle-venta.html?id=${
          venta.id_venta
        }" class="show-more-button-link">
  <i class="fa-solid fa-eye"></i>
</a>
        <button class="edit-button" data-id="${
          venta.id_venta
        }"><i class="fa-solid fa-edit"></i></button>
        <button class="delete-button" data-id="${
          venta.id_venta
        }"><i class="fa-solid fa-trash-can"></i></button>
      </td>
    `;
    listaVentas.appendChild(fila);
  });

  asignarListenersBotones();
}

function asignarListenersBotones() {
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      if (
        confirm(`¿Está seguro de que desea eliminar la venta con ID ${id}?`)
      ) {
        try {
          await eliminarVentaPorId(id);
          cargarVentas();
          alert("Venta eliminada con éxito.");
        } catch (error) {
          alert(error.message);
        }
      }
    });
  });

  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      alert(`Funcionalidad de editar para la venta ID ${id} no implementada.`);
    });
  });
}

async function cargarClientes() {
  const selectCliente = document.getElementById("cliente");
  const { data, error } = await supabase
    .from("cliente")
    .select("id_cliente, persona(id_persona, nombre, apellido1, apellido2)");

  if (error) {
    console.error("Error cargando clientes:", error);
    return;
  }

  data.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id_cliente;
    option.textContent = `${cliente.persona.nombre} ${cliente.persona.apellido1} ${cliente.persona.apellido2}`;
    selectCliente.appendChild(option);
  });
}

async function cargarEmpleados() {
  const selectEmpleado = document.getElementById("empleado");
  const { data, error } = await supabase
    .from("empleado")
    .select("id_empleado, persona(id_persona, nombre, apellido1, apellido2)")
    .eq("cargo", "Cajero");

  if (error) {
    console.error("Error cargando empleados:", error);
    return;
  }

  data.forEach((empleado) => {
    const option = document.createElement("option");
    option.value = empleado.id_empleado;
    option.textContent = `${empleado.persona.nombre} ${empleado.persona.apellido1} ${empleado.persona.apellido2}`;
    selectEmpleado.appendChild(option);
  });
}

async function cargarProductos() {
  const { data, error } = await supabase
    .from("producto")
    .select("id_producto, nombre_producto, precio");
  if (error) {
    console.error("Error cargando productos:", error);
    return;
  }
  productosDisponibles = data;
}

// --- Productos Dinámicos ---

function agregarFilaProducto() {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("producto-item");

  const selectProducto = document.createElement("select");
  selectProducto.required = true;
  selectProducto.innerHTML = `<option value="" disabled selected>Seleccione un producto</option>`;

  productosDisponibles.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id_producto;
    option.textContent = `${p.nombre_producto} - ₡${p.precio}`;
    option.dataset.precio = p.precio;
    selectProducto.appendChild(option);
  });

  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.placeholder = "Cantidad";
  inputCantidad.min = 1;
  inputCantidad.required = true;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.classList.add("remove-product-button");
  removeBtn.innerHTML = "&times;";
  removeBtn.onclick = () => {
    itemDiv.remove();
    actualizarTotal();
  };

  itemDiv.appendChild(selectProducto);
  itemDiv.appendChild(inputCantidad);
  itemDiv.appendChild(removeBtn);
  productosContainer.appendChild(itemDiv);

  selectProducto.addEventListener("change", actualizarTotal);
  inputCantidad.addEventListener("input", actualizarTotal);
}

function actualizarTotal() {
  let totalCalculado = 0;
  const items = productosContainer.querySelectorAll(".producto-item");

  items.forEach((item) => {
    const select = item.querySelector("select");
    const cantidadInput = item.querySelector("input[type='number']");
    const cantidad = parseInt(cantidadInput.value) || 0;

    if (select.value && cantidad > 0) {
      const precio = parseFloat(
        select.options[select.selectedIndex].dataset.precio
      );
      totalCalculado += precio * cantidad;
    }
  });

  totalInput.value = `₡ ${totalCalculado.toFixed(2)}`;
}

// --- Event Listeners ---

agregarProductoBtn.addEventListener("click", agregarFilaProducto);

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const ventaData = {
    id_cliente: parseInt(document.getElementById("cliente").value),
    id_empleado: parseInt(document.getElementById("empleado").value),
    tipo_pago: document.getElementById("tipo_pago").value,
    estado_pago: document.getElementById("estado_pago").value,
    total: parseFloat(totalInput.value.replace("₡ ", "")),
  };

  const detallesData = [];
  const items = productosContainer.querySelectorAll(".producto-item");
  if (items.length === 0) {
    alert("Debe agregar al menos un producto a la venta.");
    return;
  }

  for (const item of items) {
    const select = item.querySelector("select");
    const cantidadInput = item.querySelector("input[type='number']");
    if (!select.value || !cantidadInput.value) {
      alert("Por favor, complete todos los campos de los productos.");
      return;
    }

    detallesData.push({
      id_producto: parseInt(select.value),
      cantidad: parseInt(cantidadInput.value),
      precio_unitario: parseFloat(
        select.options[select.selectedIndex].dataset.precio
      ),
    });
  }

  // Verificar stock antes de insertar la venta
  for (const detalle of detallesData) {
    const { data: inventarioData, error } = await supabase
      .from("inventario")
      .select("cantidad")
      .eq("id_producto", detalle.id_producto)
      .single();

    if (error) {
      alert(
        `Error al verificar inventario para el producto ID ${detalle.id_producto}: ${error.message}`
      );
      return;
    }

    if (!inventarioData || inventarioData.cantidad < detalle.cantidad) {
      alert(
        `No hay suficiente stock para el producto ID ${
          detalle.id_producto
        }. Stock disponible: ${inventarioData ? inventarioData.cantidad : 0}`
      );
      return;
    }
  }

  try {
    await agregarVentaCompleta(ventaData, detallesData);

    // Actualizar inventario restando la cantidad vendida
    for (const detalle of detallesData) {
      const { data: inventarioData, error } = await supabase
        .from("inventario")
        .select("cantidad")
        .eq("id_producto", detalle.id_producto)
        .single();

      if (error) {
        alert(
          `Error al obtener inventario para actualizar producto ID ${detalle.id_producto}: ${error.message}`
        );
        continue;
      }

      const nuevaCantidad = inventarioData.cantidad - detalle.cantidad;

      const { error: updateError } = await supabase
        .from("inventario")
        .update({ cantidad: nuevaCantidad })
        .eq("id_producto", detalle.id_producto);

      if (updateError) {
        alert(
          `Error al actualizar inventario para producto ID ${detalle.id_producto}: ${updateError.message}`
        );
      }
    }

    alert("Venta registrada con éxito!");
    form.reset();
    productosContainer.innerHTML = "";
    agregarFilaProducto();
    actualizarTotal();
    await cargarVentas();
  } catch (error) {
    alert(error.message);
  }
});

document.addEventListener("DOMContentLoaded", cargarDatosIniciales);
