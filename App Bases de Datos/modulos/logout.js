
//cerrar sesión
document.getElementById('logout-button').addEventListener('click', function () {
  // Aquí podrías realizar acciones adicionales como limpiar el almacenamiento local o las cookies
  // Por ejemplo, si estás usando localStorage:
  localStorage.removeItem('usuario'); // Elimina el usuario del almacenamiento local

  // Redirigir a la página de inicio o de login
  window.location.href = "login.html"; // Cambia a la URL de tu página de inicio o login
});