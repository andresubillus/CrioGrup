
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

  // Mostrar mensaje personalizado
  const mensajeBienvenida = document.getElementById('mensajeBienvenida');
  mensajeBienvenida.textContent = `Bienvenido, ${encontrado.usuario}`;
  mensajeBienvenida.classList.add('aparecer-bienvenida');


  const pantalla = document.getElementById('pantallaCarga');
  pantalla.style.display = 'flex';
  pantalla.offsetHeight;
  pantalla.classList.add('mostrar');

  setTimeout(() => {
    pantalla.classList.remove('mostrar');
    pantalla.classList.add('ocultar');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 200);
  }, 9200);
}
});
