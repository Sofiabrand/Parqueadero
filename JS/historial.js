// Guardamos el historial completo para poder filtrarlo
let historialGlobal = [];


// Formatea una fecha ISO a texto legible
// Ejemplo: "15/04/2025, 3:20 PM"

function formatearFecha(fechaISO) {
    return new Date(fechaISO).toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}


// Calcula y muestra las tarjetas de resumen
// (total vehículos, total recaudado, promedio horas)

function mostrarResumen(lista) {
    const totalVehiculos = lista.length;
    const totalDinero    = lista.reduce((suma, r) => suma + r.total, 0);
    const totalHoras     = lista.reduce((suma, r) => suma + r.horas, 0);
    const promedioHoras  = totalVehiculos > 0 ? (totalHoras / totalVehiculos).toFixed(1) : 0;

    document.getElementById('totalVehiculos').innerText = totalVehiculos;
    document.getElementById('totalIngresos').innerText  = '$' + totalDinero.toLocaleString('es-CO');
    document.getElementById('promedioHoras').innerText  = promedioHoras + 'h';
}


// Dibuja las filas de la tabla

function renderizarHistorial(lista) {
    const cuerpo        = document.getElementById('cuerpoHistorial');
    const mensajeVacio  = document.getElementById('mensajeVacio');
    const tabla         = document.getElementById('tablaHistorial');
    const contadorTexto = document.getElementById('contadorTexto');

    cuerpo.innerHTML = '';

    if (lista.length === 0) {
        tabla.style.display        = 'none';
        mensajeVacio.style.display = 'block';
        contadorTexto.innerText    = 'No hay registros todavía.';
        return;
    }

    tabla.style.display        = 'table';
    mensajeVacio.style.display = 'none';
    contadorTexto.innerText    = `${lista.length} registro(s) encontrados`;

    // Mostramos el más reciente primero (invertimos el orden)
    const listaInvertida = [...lista].reverse();

    listaInvertida.forEach((r, i) => {
        const fila  = document.createElement('tr');
        const icono = r.tipo === 'Moto' ? '' : '';

        fila.innerHTML = `
            <td>${i + 1}</td>
            <td><span class="badge-placa">${r.placa}</span></td>
            <td>${icono} ${r.tipo}</td>
            <td>${formatearFecha(r.entrada)}</td>
            <td>${formatearFecha(r.salida)}</td>
            <td>${r.horas} h</td>
            <td><span class="badge-total">$${r.total.toLocaleString('es-CO')}</span></td>
        `;

        cuerpo.appendChild(fila);
    });
}


// Filtro de búsqueda por placa

function filtrarHistorial() {
    const texto     = document.getElementById('inputBuscar').value.toUpperCase().trim();
    const filtrados = historialGlobal.filter(r => r.placa.includes(texto));
    renderizarHistorial(filtrados);
    mostrarResumen(filtrados);
}

// Botón limpiar historial (con confirmación)

function limpiarHistorial() {
    Swal.fire({
        title: '¿Estás segura?',
        text: 'Se borrará todo el historial de pagos. Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar todo',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#cc0000',
        cancelButtonColor: '#444',
        background: '#1a1a1a',
        color: '#ffffff'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('historialPagos');
            historialGlobal = [];
            renderizarHistorial([]);
            mostrarResumen([]);

            Swal.fire({
                title: '¡Listo!',
                text: 'El historial fue borrado correctamente.',
                icon: 'success',
                background: '#1a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#28a745'
            });
        }
    });
}

// Arranque: carga los datos al abrir la página
document.addEventListener('DOMContentLoaded', function() {
    historialGlobal = JSON.parse(localStorage.getItem('historialPagos')) || [];
    renderizarHistorial(historialGlobal);
    mostrarResumen(historialGlobal);
});