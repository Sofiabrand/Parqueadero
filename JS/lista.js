// Guardamos los vehículos para poder filtrarlos
let vehiculosGlobal = [];

// ─────────────────────────────────────────
// Convierte milisegundos en texto legible
// Ejemplo: "2h 15m 30s"

function calcularTiempo(fechaEntradaISO) {
    const entrada = new Date(fechaEntradaISO);
    const ahora   = new Date();
    const diffMs  = ahora - entrada;

    const totalSeg = Math.floor(diffMs / 1000);
    const horas    = Math.floor(totalSeg / 3600);
    const minutos  = Math.floor((totalSeg % 3600) / 60);
    const segundos = totalSeg % 60;

    return `${String(horas).padStart(2,'0')}h ${String(minutos).padStart(2,'0')}m ${String(segundos).padStart(2,'0')}s`;
}


// Dibuja las filas en la tabla
function renderizarTabla(lista) {
    const cuerpo        = document.getElementById('cuerpoTabla');
    const mensajeVacio  = document.getElementById('mensajeVacio');
    const tabla         = document.getElementById('tablaVehiculos');
    const contadorTexto = document.getElementById('contadorTexto');

    cuerpo.innerHTML = ''; // Limpiamos antes de volver a pintar

    if (lista.length === 0) {
        tabla.style.display       = 'none';
        mensajeVacio.style.display = 'block';
        contadorTexto.innerText   = 'No hay vehículos actualmente.';
        return;
    }

    tabla.style.display       = 'table';
    mensajeVacio.style.display = 'none';
    contadorTexto.innerText   = `${lista.length} vehículo(s) en el parqueadero`;

    lista.forEach((v, i) => {
        const fila = document.createElement('tr');

        // Ícono según tipo
        const icono = v.tipo === 'Moto' ? '🏍️' : '🚗';

        // Hora de ingreso formateada
        const horaIngreso = new Date(v.entrada).toLocaleString('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        fila.innerHTML = `
            <td>${i + 1}</td>
            <td><span class="badge-placa">${v.placa}</span></td>
            <td>${icono} ${v.tipo}</td>
            <td>${horaIngreso}</td>
            <td class="tiempo-activo" data-entrada="${v.entrada}">${calcularTiempo(v.entrada)}</td>
        `;

        cuerpo.appendChild(fila);
    });
}

// ─────────────────────────────────────────
// Filtro de búsqueda por placa
// ─────────────────────────────────────────
function filtrarVehiculos() {
    const texto = document.getElementById('inputBuscar').value.toUpperCase().trim();
    const filtrados = vehiculosGlobal.filter(v => v.placa.includes(texto));
    renderizarTabla(filtrados);
}

// ─────────────────────────────────────────
// Actualiza el tiempo activo cada segundo
// (sin redibujar toda la tabla, solo la celda)
// ─────────────────────────────────────────
function actualizarTiempos() {
    const celdas = document.querySelectorAll('.tiempo-activo');
    celdas.forEach(celda => {
        const entrada = celda.getAttribute('data-entrada');
        celda.innerText = calcularTiempo(entrada);
    });
}

// ─────────────────────────────────────────
// Carga inicial
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    vehiculosGlobal = JSON.parse(localStorage.getItem('vehiculosActivos')) || [];
    renderizarTabla(vehiculosGlobal);

    // Actualizamos el tiempo cada segundo en vivo
    setInterval(actualizarTiempos, 1000);
});