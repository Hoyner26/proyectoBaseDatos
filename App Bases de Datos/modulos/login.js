document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Evita que se recargue la página

  const usuario = document.getElementById('usuario').value;
  const contrasena = document.getElementById('clave').value;


  // Datos simulados para prueba
  const usuarioValido = 'Zamora';
  const contrasenaValida = 'hazc1234';

  if (usuario === usuarioValido && contrasena === contrasenaValida) {
    window.location.href = "index.html";

  } else {
    // Mostrar mensaje de error en una ventana emergente
    alert('Usuario o contraseña incorrectos.');
    
  }
});
