// 1. Validar sesión y rol
const rol = localStorage.getItem('rol');
if (!rol) {
  window.location.href = 'login.html';
}
// 1.1 Cambiar el titulo según el rol
const titulo = document.getElementById('titulo-menu');
if(titulo){
  titulo.textContent = rol === 'admin' ? 'Admin':'Operador';
}

// 2. Menú con submenús (estructura jerárquica)
const opciones = [
  {
    id: 'menu1',
    nombre: 'Menu Envases',
    submenus: [
      { nombre: 'Submenu1-1', archivo: 'submenu1-1' },
      { nombre: 'Submenu1-2', archivo: 'submenu1-2' }
    ]
  },
  {
    id: 'menu2',
    nombre: 'Menu 2',
    submenus: [
      { nombre: 'Submenu2-1', archivo: 'production_module' },
      { nombre: 'Submenu2-2', archivo: 'submenu2-2' }
    ]
  },
    {
    id: 'menu3',
    nombre: 'Menu Choferes',
    submenus: [
      { nombre: 'Submenu3-1', archivo: 'submenu3-1' },
      { nombre: 'Submenu3-2', archivo: 'submenu3-2' }
    ]
  },
      {
    id: 'menu4',
    nombre: 'Menu Envases En planta',
    submenus: [
      { nombre: 'Submenu4-1', archivo: 'submenu4-1' },
      { nombre: 'Submenu4-2', archivo: 'submenu4-2' }
    ]
  },

        {
    id: 'menu5',
    nombre: 'Menu Reportes',
    submenus: [
      { nombre: 'Submenu5-1', archivo: 'submenu5-1' },
      { nombre: 'Submenu5-2', archivo: 'submenu5-2' }
    ]
  },
          {
    id: 'menu6',
    nombre: 'Menu 6',
    submenus: [
      { nombre: 'Submenu6-1', archivo: 'submenu6-1' },
      { nombre: 'Submenu6-2', archivo: 'submenu6-2' }
    ]
  },
];

// 3. Filtrar según rol
const permitidos = rol === 'admin'
  ? opciones
  : opciones.filter(opt => opt.id === 'menu1');

// 4. Renderizar menú dinámico
const menu = document.getElementById('menu-lateral');
if (menu) {
  menu.innerHTML = ''; // ✅ Limpiar menú antes de renderizar para evitar duplicados

  permitidos.forEach(opt => {
    const li = document.createElement('li');
    li.classList.add('nav-item');

    if (opt.submenus) {
      const collapseId = `collapse-${opt.id}`;
      li.innerHTML = `
        <a class="nav-link text-white" data-bs-toggle="collapse" href="#${collapseId}" role="button">${opt.nombre}</a>
        <div class="collapse ms-3" id="${collapseId}">
          ${opt.submenus.map(sub =>
            `<a class="nav-link text-white" href="#" data-section="${sub.archivo}">${sub.nombre}</a>`
          ).join('')}
        </div>
      `;
    } else {
      li.innerHTML = `<a class="nav-link text-white" href="#" data-section="${opt.archivo}">${opt.nombre}</a>`;
    }

    menu.appendChild(li);
  });
}

// 5. Cargar contenido dinámico al hacer clic
document.addEventListener('click', function (e) {
const link = e.target.closest('[data-section]');
if (!link) return;

e.preventDefault();
const seccion = link.dataset.section;
const telon = document.getElementById('telon-animacion');
if (!telon) return;

// Mostrar el telón
telon.classList.add('mostrar');

// ⚠️ Forzar repintado (esto es lo crucial)
telon.offsetHeight; // Esto obliga al navegador a aplicar la clase visualmente

// Esperar que se vea el telón antes de cargar contenido
setTimeout(() => {
  fetch('views/' + seccion + '.html')
    .then(res => {
      if (!res.ok) throw new Error();
      return res.text();
    })
    .then(html => {
      const contenido = document.getElementById('contenido-dinamico');
      if (!contenido) return;

      contenido.innerHTML = html;

      // Eliminar script viejo si existe
      const oldScript = document.querySelector('#dinamic-script');
      if (oldScript) oldScript.remove();

      const script = document.createElement('script');
      script.id = 'dinamic-script';
      script.src = 'views/' + seccion + '.js';
      script.onload = () => {
        const fnName = 'iniciar' + seccion.replace(/[^a-zA-Z0-9]/g, '');
        if (typeof window[fnName] === 'function') {
          window[fnName]();
        }
      };
      document.body.appendChild(script);
    })
    .catch(() => {
      document.getElementById('contenido-dinamico').innerHTML = `
        <div class="alert alert-danger">Error al cargar vista: ${seccion}.html</div>`;
    })
    .finally(() => {
      // Ocultar telón después de otro pequeño delay
      setTimeout(() => {
        telon.classList.remove('mostrar');
      }, 300);
    });
},1000); // Tiempo para que el telón se desplace completamente
// Pequeño retraso para asegurar que se vea la animación
});

// 6. Cerrar sesión
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}
