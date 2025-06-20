import {obtenerClientesFull} from "./clientes.js";
import "./logout.js"; 

async function cargarDetallesCliente() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCliente = urlParams.get("id"); // Obtenemos el ID del cliente de la URL
    if (!idCliente) {
        document.getElementById("cliente-details").innerHTML =
            "<p>No se ha especificado un ID de cliente.</p>";
        return;
    }

    const clientes = await obtenerClientesFull();
    const cliente = clientes.find((c) => c.id_cliente == idCliente); // Usamos == para comparación flexible

    if (cliente) {
        document.getElementById("detail-nombre").textContent = cliente.nombre_completo || "No disponible"; // Asegúrate de que 'nombre' sea un string legible
        document.getElementById("detail-genero").textContent = cliente.genero || "No disponible"; // Asumiendo que 'genero' ya es un string legible
        document.getElementById("detail-direccion").textContent = cliente.direccion || "No disponible"; // Asegúrate de que 'direccion' sea un string legible
        document.getElementById("detail-id").textContent = cliente.id_cliente || "No disponible"; // Asegúrate de que 'id_cliente' sea un string legible
        document.getElementById("detail-tipo-cliente").textContent = cliente.tipo_cliente || "No disponible"; // Asegúrate de que 'tipo_cliente' sea un string legible
        document.getElementById("detail-codigo-favorito").textContent = cliente.codigo_frecuente || "No disponible"; // Asegúrate de que 'codigo_frecuente' sea un string legible
        document.getElementById("detail-metodo-favorito").textContent = cliente.estado_pago_preferido || "No disponible"; // Asegúrate de que 'estado_pago_preferido' sea un string legible
        document.getElementById("detail-credito").textContent = cliente.limite_credito || "No disponible"; // Asegúrate de que 'limite_credito' sea un string legible
        document.getElementById("detail-id-persona").textContent = cliente.id_persona || "No disponible"; // Asegúrate de que 'id_persona' sea un string legible
        const telefonosList = document.getElementById("detail-telefonos");
        telefonosList.innerHTML = "";
        if (cliente.telefonos && cliente.telefonos.length > 0) {
            cliente.telefonos.forEach((tel) => {
                const li = document.createElement("li");
                li.textContent = typeof tel === "object" ? tel.telefono : tel; // Asegúrate de acceder a la propiedad correcta
                telefonosList.appendChild(li);
            });
        } else {
            telefonosList.innerHTML = "<li>No hay teléfonos registrados.</li>";
        }

        const correosList = document.getElementById("detail-correos");
        correosList.innerHTML = "";
        if (cliente.correos && cliente.correos.length > 0) {
            cliente.correos.forEach((email) => {
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
        document.getElementById("cliente-details").innerHTML = 
            "<p>Cliente no encontrado.</p>";
    }
}

document.addEventListener("DOMContentLoaded", cargarDetallesCliente);
