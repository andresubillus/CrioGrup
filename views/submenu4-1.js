function iniciarSubmenu41() {
  const datosPorDefecto = [
    { tgas: '001', prod: 'C2H2', envase: '9098', vol: 9, fecha: '', tdoc: '', documento: '', ruc: '20545673593', nombre: 'CRIOGROUP S.A.C', est: 'FAB', dias: '' },
    { tgas: '001', prod: 'C2H2', envase: '9100', vol: 5, fecha: '', tdoc: '', documento: '', ruc: '20545673593', nombre: 'CRIOGROUP S.A.C', est: 'FAB', dias: '' },
    { tgas: '001', prod: 'C2H2', envase: '9102', vol: 0, fecha: '', tdoc: '', documento: '', ruc: '20545673593', nombre: 'CRIOGROUP S.A.C', est: 'FAB', dias: '' },
    { tgas: '001', prod: 'C2H2', envase: '9122', vol: 6, fecha: '', tdoc: '', documento: '', ruc: '20545673593', nombre: 'CRIOGROUP S.A.C', est: 'FAB', dias: '' },
    { tgas: '001', prod: 'C2H2', envase: '9217', vol: 7, fecha: '', tdoc: '', documento: '', ruc: '20545673593', nombre: 'CRIOGROUP S.A.C', est: 'FAB', dias: '' },
    { tgas: '001', prod: 'C2H2', envase: '1566', vol: 8, fecha: '', tdoc: '', documento: '', ruc: '12345678901', nombre: 'OTRO CLIENTE S.A.', est: 'FAB', dias: '' },
  ];

  let envases = JSON.parse(localStorage.getItem("envasesData")) || [...datosPorDefecto];

  const tablaBody = document.getElementById("tablaBody");
  const btnCambiarEstado = document.getElementById("btnCambiarEstado");
  const checkTodos = document.getElementById("checkTodos");

  function renderTabla() {
    tablaBody.innerHTML = "";
    envases.forEach((e, i) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><input type="checkbox" class="check-envase" data-index="${i}"></td>
        <td>${e.tgas}</td>
        <td>${e.prod}</td>
        <td>${e.envase}</td>
        <td>${e.vol}</td>
        <td>${e.fecha}</td>
        <td>${e.tdoc}</td>
        <td>${e.documento}</td>
        <td>${e.ruc}</td>
        <td>${e.nombre}</td>
        <td>${e.est}</td>
        <td>${e.dias}</td>
      `;
      tablaBody.appendChild(fila);
    });

    document.getElementById("total").textContent = envases.length;
    actualizarBotonEstado();
  }

  function actualizarBotonEstado() {
    const seleccionados = document.querySelectorAll(".check-envase:checked").length;
    btnCambiarEstado.disabled = seleccionados === 0;
  }

  tablaBody.addEventListener("change", actualizarBotonEstado);

  checkTodos.addEventListener("change", function () {
    document.querySelectorAll(".check-envase").forEach(chk => chk.checked = this.checked);
    actualizarBotonEstado();
  });

  btnCambiarEstado.addEventListener("click", function () {
    document.getElementById("inputNuevoEstado").value = "";
    new bootstrap.Modal(document.getElementById("modalCambiarEstado")).show();
  });

  document.getElementById("guardarEstadoSeleccionados").addEventListener("click", function () {
    const nuevoEstado = document.getElementById("inputNuevoEstado").value.trim();
    if (!nuevoEstado) return;

    document.querySelectorAll(".check-envase:checked").forEach(chk => {
      const index = parseInt(chk.dataset.index);
      envases[index].est = nuevoEstado;
    });

    localStorage.setItem("envasesData", JSON.stringify(envases));

    renderTabla();
    bootstrap.Modal.getInstance(document.getElementById("modalCambiarEstado")).hide();
  });

  renderTabla();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarSubmenu41);
} else {
  iniciarSubmenu41();
}