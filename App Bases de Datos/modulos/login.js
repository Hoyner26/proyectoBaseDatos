import { supabase } from "./supabaseClient.js";

// --- Almacenamiento de Elementos del DOM para mejor rendimiento ---
const dom = {
  form: document.getElementById("login-form"),
  formTitle: document.getElementById("form-title"),
  submitButton: document.getElementById("submit-button"),
  nombreGroup: document.getElementById("nombre-group"),
  nombreInput: document.getElementById("nombre"),
  emailInput: document.getElementById("usuario"),
  passwordInput: document.getElementById("clave"),
  toggleText: document.querySelector(".toggle-text"),
  messageContainer: document.getElementById("message-container"),
};

// --- Estado de la aplicación ---
let isLogin = true;

// --- Funciones de Utilidad ---

/**
 * Muestra un mensaje en la UI, con tipo (éxito/error).
 * @param {string} text - El mensaje a mostrar.
 * @param {'success' | 'error'} type - El tipo de mensaje.
 */
function showMessage(text, type = "error") {
  dom.messageContainer.textContent = text;
  dom.messageContainer.className = `message-container ${type}`;
}

/**
 * Controla el estado de carga del botón de envío.
 * @param {boolean} isLoading - True para mostrar carga, false para estado normal.
 */
function setLoading(isLoading) {
  dom.submitButton.disabled = isLoading;
  const buttonText = dom.submitButton.querySelector(".button-text");
  const buttonIcon = dom.submitButton.querySelector(".button-icon");

  if (isLoading) {
    buttonText.textContent = "Procesando...";
    buttonIcon.className = "spinner";
  } else {
    // Restaurar texto e ícono según modo actual
    if (isLogin) {
      buttonText.textContent = "Entrar";
      buttonIcon.className = "button-icon fas fa-sign-in-alt";
    } else {
      buttonText.textContent = "Registrarse";
      buttonIcon.className = "button-icon fas fa-user-plus";
    }
  }
}

/**
 * Actualiza la UI para reflejar el estado (Login o Registro).
 */
function updateView() {
  const buttonText = dom.submitButton.querySelector(".button-text");
  const buttonIcon = dom.submitButton.querySelector(".button-icon");

  // Limpia clases anteriores del ícono
  buttonIcon.className = "button-icon fas";

  if (isLogin) {
    // --- VISTA LOGIN ---
    dom.formTitle.textContent = "Iniciar Sesión";
    buttonText.textContent = "Entrar";
    buttonIcon.classList.add("fa-sign-in-alt");
    dom.toggleText.innerHTML =
      '¿No tienes cuenta? <a href="#" id="toggle-link">Regístrate</a>';
    dom.nombreGroup.classList.remove("visible");
  } else {
    // --- VISTA REGISTRO ---
    dom.formTitle.textContent = "Crear Cuenta";
    buttonText.textContent = "Registrarse";
    buttonIcon.classList.add("fa-user-plus");
    dom.toggleText.innerHTML =
      '¿Ya tienes cuenta? <a href="#" id="toggle-link">Inicia sesión</a>';
    dom.nombreGroup.classList.add("visible");
  }

  // Re-asigna el listener al nuevo enlace que se crea dinámicamente
  const toggleLink = document.getElementById("toggle-link");
  if (toggleLink) {
    toggleLink.addEventListener("click", handleToggleForm);
  }
}

/**
 * Maneja el evento de alternar entre Login y Registro.
 * @param {Event} e - El objeto del evento.
 */
function handleToggleForm(e) {
  e.preventDefault();
  isLogin = !isLogin;
  dom.form.reset();
  dom.messageContainer.className = "message-container"; // Oculta mensajes anteriores
  updateView();
}

/**
 * Maneja el envío del formulario.
 * @param {Event} e - El objeto del evento del formulario.
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  setLoading(true);
  dom.messageContainer.className = "message-container"; // Oculta mensajes al enviar

  const email = dom.emailInput.value;
  const password = dom.passwordInput.value;

  try {
    if (isLogin) {
      // --- LÓGICA DE LOGIN ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const { data: perfil, error: perfilError } = await supabase
        .from("usuarios")
        .select("nombre")
        .eq("id", data.user.id)
        .single();

      if (perfilError) throw perfilError;

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("nombre", perfil.nombre);

      window.location.href = "index.html"; // Redirección exitosa
    } else {
      // --- LÓGICA DE REGISTRO ---
      const fullName = dom.nombreInput.value.trim();
      if (!fullName) {
        throw new Error("Por favor, ingresa tu nombre completo.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;

      if (data.user) {
        const { error: insertError } = await supabase.from("usuarios").insert([
          {
            id: data.user.id,
            nombre: fullName,
          },
        ]);
        if (insertError) throw insertError;
      }

      showMessage(
        "¡Registro exitoso! Revisa tu correo para confirmar la cuenta.",
        "Rivise la sección de spam si no ves el correo.",
        "success"
      );

      setTimeout(() => {
        isLogin = true;
        dom.form.reset();
        setLoading(false); // Restaura el botón y cambia la vista a Login
      }, 3000);
    }
  } catch (error) {
    // ESTA ES LA CORRECCIÓN CLAVE:
    // Si cualquier operación dentro del 'try' falla, se captura el error aquí.
    showMessage(error.message || "Ha ocurrido un error inesperado.");
    // Se restaura el botón a su estado normal inmediatamente después de mostrar el error.
    setLoading(false);
  }
}

// --- Inicialización de Event Listeners ---
dom.form.addEventListener("submit", handleFormSubmit);
document
  .getElementById("toggle-link")
  .addEventListener("click", handleToggleForm);
