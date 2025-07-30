function iniciarmenu6() {
  const tablaEnvases = document.getElementById('tablaEnvase');
  const formEnvase = document.getElementById('formEnvase');

  const datosIniciales = [
    { codigo: '254662', propietario: 'Andres S.A.C', fecha: '2025-07-26', estado: 'PH' },
    { codigo: '336512', propietario: 'Andres S.A.C', fecha: '2030-04-11', estado: 'Despacho' },
    { codigo: '555872', propietario: 'Andres S.A.C', fecha: '2030-04-18', estado: 'Observación' },
    { codigo: '585853', propietario: 'Andres S.A.C', fecha: '2025-07-09', estado: 'Falta PH' }
  ];

  let datosEnvases = JSON.parse(localStorage.getItem('envases'));
  if (!datosEnvases) {
    datosEnvases = datosIniciales;
    localStorage.setItem('envases', JSON.stringify(datosEnvases));
  }

  let indiceEditar = null;

  function guardarEnLocalStorage() {
    localStorage.setItem('envases', JSON.stringify(datosEnvases));
  }

  function cargarTabla(data = datosEnvases) {
    tablaEnvases.innerHTML = '';
    if (data.length === 0) {
      tablaEnvases.innerHTML = `<tr><td colspan="5">No se encontraron resultados.</td></tr>`;
      return;
    }

    data.forEach((envase, i) => {
      const indexReal = datosEnvases.findIndex(e =>
        e.codigo === envase.codigo &&
        e.propietario === envase.propietario &&
        e.fecha === envase.fecha &&
        e.estado === envase.estado
      );

      tablaEnvases.innerHTML += `
        <tr>
          <td>${envase.codigo}</td>
          <td>${envase.propietario}</td>
          <td>${envase.fecha}</td>
          <td>${estadoConIcono(envase.estado)}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editarEnvase(${indexReal})">Ver</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarEnvase(${indexReal})">Eliminar</button>
          </td>
        </tr>`;
    });
  }

  function estadoConIcono(estado) {
    const iconos = {
      'PH': '✏ PH',
      'Despacho': '✅ despacho',
      'Observación': '👀 observación',
      'Falta PH': '⛔ FALTA PH'
    };
    return iconos[estado] || estado;
  }

  window.editarEnvase = function(index) {
    const envase = datosEnvases[index];
    const inputs = formEnvase.elements;
    inputs.propietario.value = envase.propietario;
    inputs.codigo.value = envase.codigo;
    inputs.gas.value = envase.gas || 'OXIGENO';
    inputs.unidad.value = envase.unidad || 'm³';
    inputs.capacidad.value = envase.capacidad || '10';
    inputs.volumen.value = envase.volumen || '10';
    inputs.ubicacion.value = envase.ubicacion || 'Lima';
    inputs.estado.value = envase.estado;
    inputs.fecha_ph.value = envase.fecha;

    indiceEditar = index;
    new bootstrap.Modal(document.getElementById('modalAgregar')).show();
  };

  window.eliminarEnvase = function(index) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        datosEnvases.splice(index, 1);
        guardarEnLocalStorage();
        cargarTabla();
        Swal.fire('¡Eliminado!', 'El envase ha sido eliminado.', 'success');
      }
    });
  };

  formEnvase.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = formEnvase.elements;

    const nuevoEnvase = {
      propietario: inputs.propietario.value,
      codigo: inputs.codigo.value,
      gas: inputs.gas.value,
      unidad: inputs.unidad.value,
      capacidad: inputs.capacidad.value,
      volumen: inputs.volumen.value,
      ubicacion: inputs.ubicacion.value,
      estado: inputs.estado.value,
      fecha: inputs.fecha_ph.value
    };

    if (indiceEditar !== null) {
      datosEnvases[indiceEditar] = nuevoEnvase;
      indiceEditar = null;
    } else {
      datosEnvases.push(nuevoEnvase);
    }

    guardarEnLocalStorage();
    cargarTabla();
    bootstrap.Modal.getInstance(document.getElementById('modalAgregar')).hide();
    formEnvase.reset();

    Swal.fire('Guardado', 'Envase registrado correctamente', 'success');
  });

  // Modal de búsqueda
  window.mostrarInformacion = function() {
    new bootstrap.Modal(document.getElementById('modalBusqueda')).show();
  };

  const formBusqueda = document.getElementById('formBusqueda');
  formBusqueda.addEventListener('submit', (e) => {
    e.preventDefault();
    const filtros = formBusqueda.elements;

    const codigo = filtros.codigo.value.trim();
    const propietario = filtros.propietario.value.trim().toLowerCase();
    const estado = filtros.estado.value;
    const fecha = filtros.fecha.value;

    const camposVacios = !codigo && !propietario && !estado && !fecha;

    if (camposVacios) {
      cargarTabla(); // Mostrar todos si no hay filtros
    } else {
      const resultados = datosEnvases.filter(env => {
        return (!codigo || env.codigo.includes(codigo)) &&
               (!propietario || env.propietario.toLowerCase().includes(propietario)) &&
               (!estado || env.estado === estado) &&
               (!fecha || env.fecha === fecha);
      });

      cargarTabla(resultados); // Mostrar solo resultados
    }

    bootstrap.Modal.getInstance(document.getElementById('modalBusqueda')).hide();
  });

  cargarTabla(); // ✅ Mostrar todos los envases al iniciar
}


document.getElementById('btnAgregarFila').addEventListener('click', () => {
  const fila = `
    <tr>
      <td><input type="text" class="form-control" name="codigo[]" required></td>
      <td>
        <select class="form-select" name="estado[]">
          <option value="PH">PH</option>
          <option value="Despacho">Despacho</option>
          <option value="Observación">Observación</option>
          <option value="Falta PH">Falta PH</option>
        </select>
      </td>
      <td><input type="date" class="form-control" name="fecha[]" required></td>
      <td><button type="button" class="btn btn-danger btn-sm btnEliminarFila">X</button></td>
    </tr>`;
  document.querySelector('#tablaFilasEnvases tbody').insertAdjacentHTML('beforeend', fila);
});

// Eliminar fila individual
document.querySelector('#tablaFilasEnvases tbody').addEventListener('click', function (e) {
  if (e.target.classList.contains('btnEliminarFila')) {
    e.target.closest('tr').remove();
  }
});

// Guardar múltiples envases
document.getElementById('formMultipleEnvases').addEventListener('submit', function (e) {
  e.preventDefault();

  const propietario = this.propietarioComun.value.trim();
  const codigos = Array.from(this.querySelectorAll('[name="codigo[]"]')).map(input => input.value.trim());
  const estados = Array.from(this.querySelectorAll('[name="estado[]"]')).map(input => input.value);
  const fechas = Array.from(this.querySelectorAll('[name="fecha[]"]')).map(input => input.value);

  if (!propietario || codigos.includes('') || fechas.includes('')) {
    Swal.fire('Error', 'Completa todos los campos antes de guardar.', 'error');
    return;
  }

  const nuevos = codigos.map((codigo, i) => ({
    propietario,
    codigo,
    estado: estados[i],
    fecha: fechas[i]
  }));

  // Agregar a LocalStorage
  const almacenados = JSON.parse(localStorage.getItem('envases')) || [];
  almacenados.push(...nuevos);
  localStorage.setItem('envases', JSON.stringify(almacenados));

  // Recargar tabla principal
  iniciarsubmenu11();

  // Cerrar modal
  bootstrap.Modal.getInstance(document.getElementById('modalAgregarVarios')).hide();
  this.reset();
  this.querySelector('#tablaFilasEnvases tbody').innerHTML = '';

  Swal.fire('Guardado', 'Envases agregados correctamente.', 'success');
});
