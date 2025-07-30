function iniciarsubmenu31() {
  const tablaChoferes = document.getElementById('tablaChoferes');
  const formChofer = document.getElementById('formChofer');

  const datosIniciales = [
    { dni: '254664', nombre: 'Andres S.A.C', placa: '123456', marcaModelo: 'NISSAN', destinoRuta: 'Ruta A', fechaIngreso: '2025-07-26', fechaSalida: '2025-08-01' },
    { dni: '336514', nombre: 'Ruiz S.A.C', placa: '123456', marcaModelo: 'NISSAN', destinoRuta: 'Ruta A', fechaIngreso: '2025-07-26', fechaSalida: '2025-08-01' },
    { dni: '401563', nombre: 'Ecxal S.A.C', placa: '123456', marcaModelo: 'NISSAN', destinoRuta: 'Ruta A', fechaIngreso: '2025-07-26', fechaSalida: '2025-08-01' },
    { dni: '254664', nombre: 'Runam CORP', placa: '123456', marcaModelo: 'NISSAN', destinoRuta: 'Ruta A', fechaIngreso: '2025-07-26', fechaSalida: '2025-08-01' }
  ];

  let datosChoferes = JSON.parse(localStorage.getItem('choferes'));
  if (!datosChoferes) {
    datosChoferes = datosIniciales;
    localStorage.setItem('choferes', JSON.stringify(datosChoferes));
  }

  let indiceEditar = null;

  function guardarEnLocalStorage() {
    localStorage.setItem('choferes', JSON.stringify(datosChoferes));
  }

  function cargarTabla(data = datosChoferes) {
    tablaChoferes.innerHTML = '';
    if (data.length === 0) {
      tablaChoferes.innerHTML = `<tr><td colspan="5">No se encontraron resultados.</td></tr>`;
      return;
    }

    data.forEach((chofer, i) => {
      const indexReal = datosChoferes.findIndex(c =>
        c.dni === chofer.dni &&
        c.nombre === chofer.nombre &&
        c.placa === chofer.placa &&
        c.marcaModelo === chofer.marcaModelo &&
        c.destinoRuta === chofer.destinoRuta &&
        c.fechaIngreso === chofer.fechaIngreso &&
        c.fechaSalida === chofer.fechaSalida
      );

      tablaChoferes.innerHTML += `
        <tr>
          <td>${chofer.dni}</td>
          <td>${chofer.nombre}</td>
          <td>${chofer.placa}</td>
          <td>${chofer.marcaModelo}</td>
          <td>${chofer.destinoRuta}
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chofer.destinoRuta)}" 
            target="_blank" 
            title="Ver en Google Maps">📍</a>
          </td>
          <td>${chofer.fechaIngreso}</td>
          <td>${chofer.fechaSalida}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editarChofer(${indexReal})">Ver</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarChofer(${indexReal})">Eliminar</button>
          </td>
        </tr>`;
    });
  }

  window.editarChofer = function(index) {
    const chofer = datosChoferes[index];
    const inputs = formChofer.elements;
    inputs.dni.value = chofer.dni;
    inputs.nombre.value = chofer.nombre;
    inputs.placa.value = chofer.placa;
    inputs.marcaModelo.value = chofer.marcaModelo;
    inputs.destinoRuta.value = chofer.destinoRuta;
    inputs.fechaIngreso.value = chofer.fechaIngreso;
    inputs.fechaSalida.value = chofer.fechaSalida;

    indiceEditar = index;
    new bootstrap.Modal(document.getElementById('modalAgregar')).show();
  };

  window.eliminarChofer = function(index) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        datosChoferes.splice(index, 1);
        guardarEnLocalStorage();
        cargarTabla();
        Swal.fire('¡Eliminado!', 'El chofer ha sido eliminado.', 'success');
      }
    });
  };

  formChofer.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = formChofer.elements;

    const nuevoChofer = {
      dni: inputs.dni.value,
      nombre: inputs.nombre.value,
      placa: inputs.placa.value,
      marcaModelo: inputs.marcaModelo.value,
      destinoRuta: inputs.destinoRuta.value,
      fechaIngreso: inputs.fechaIngreso.value,
      fechaSalida: inputs.fechaSalida.value,
    };

    if (indiceEditar !== null) {
      datosChoferes[indiceEditar] = nuevoChofer;
      indiceEditar = null;
    } else {
      datosChoferes.push(nuevoChofer);
    }

    guardarEnLocalStorage();
    cargarTabla();
    bootstrap.Modal.getInstance(document.getElementById('modalAgregar')).hide();
    formEnvase.reset();

    Swal.fire('Guardado', 'Chofer registrado correctamente', 'success');
  });

  // Modal de búsqueda
  window.mostrarInformacion = function() {
    new bootstrap.Modal(document.getElementById('modalBusqueda')).show();
  };

  const formBusqueda = document.getElementById('formBusqueda');
  formBusqueda.addEventListener('submit', (e) => {
    e.preventDefault();
    const filtros = formBusqueda.elements;

    const dni = filtros.dni.value.trim();
    const nombre = filtros.nombre.value.trim().toLowerCase();
    const placa = filtros.placa.value;
    const marcaModelo = filtros.marcaModelo.value;
    const destinoRuta = filtros.destinoRuta.value;
    const fechaIngreso = filtros.fechaIngreso.value;
    const fechaSalida = filtros.fechaSalida.value;

    const camposVacios = !dni && !nombre && !placa && !marcaModelo && !destinoRuta && !fechaIngreso && !fechaSalida;

    if (camposVacios) {
      cargarTabla(); // Mostrar todos si no hay filtros
    } else {
      const resultados = datosChoferes.filter(env => {
        return (!dni || env.dni.includes(dni)) &&
               (!nombre || env.nombre.toLowerCase().includes(nombre)) &&
               (!placa || env.placa === placa) &&
               (!marcaModelo || env.marcaModelo === marcaModelo) &&
               (!destinoRuta || env.destinoRuta === destinoRuta) &&
               (!fechaIngreso || env.fechaIngreso === fechaIngreso) &&
               (!fechaSalida || env.fechaSalida === fechaSalida);
      });

      cargarTabla(resultados); // Mostrar solo resultados
    }

    bootstrap.Modal.getInstance(document.getElementById('modalBusqueda')).hide();
  });

  cargarTabla(); // ✅ Mostrar todos los choferes al iniciar
}
