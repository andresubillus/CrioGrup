
const usuarios = [
  { usuario: 'admin1', clave: '1234', rol: 'admin' },
  { usuario: 'admin2', clave: '1234', rol: 'admin' },
  { usuario: 'operador1', clave: 'abcd', rol: 'operador' }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('usuario').value.trim();
  const pass = document.getElementById('clave').value.trim();
  const mensaje = document.getElementById('mensaje');

  const encontrado = usuarios.find(u => u.usuario === user && u.clave === pass);

  if (encontrado) {
    localStorage.setItem('rol', encontrado.rol);
    window.location.href = 'index.html';
  } else {
    mensaje.textContent = 'Credenciales incorrectas';
  }
});
