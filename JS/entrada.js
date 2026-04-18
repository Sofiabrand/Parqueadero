// getElementById busca el formulario con id="formParqueadero" en el HTML
// addEventListener('submit'...) = "cuando alguien haga clic en el botón guardar, haz esto"
document.getElementById('formParqueadero').addEventListener('submit', function(e) {

    //evita que la página se recargue al enviar el formulario
    // Sin esta línea, la página se reiniciaría y se pierde todo
    e.preventDefault();

    // Capturamos los datos del formulario
     // Buscamos el campo de texto con id="placa" y leemos lo que escribieron
    // .value = el texto que hay dentro del campo
    // .toUpperCase() = lo convierte todo a MAYÚSCULAS (abc-123 → ABC-123)
    // .trim() = elimina espacios en blanco al inicio y al final
    const placa = document.getElementById('placa').value.toUpperCase().trim();

    // Leemos qué tipo de vehículo seleccionó: "Carro" o "Moto"
    const tipo = document.getElementById('tipoVehiculo').value;

    // Guardamos la fecha y hora exacta en que entró el vehículo
    // .toISOString() la guarda en un formato especial que luego nos permite
    // calcular cuánto tiempo estuvo el carro en el parqueadero
    const fechaEntrada = new Date().toISOString();

    // Leemos la lista de vehículos activos
    let vehiculosActivos = JSON.parse(localStorage.getItem('vehiculosActivos')) || [];

    // Verificamos si la placa ya está registrada (evitar duplicados)
    const yaExiste = vehiculosActivos.some(v => v.placa === placa);

    if (yaExiste) {

        // (SweetAlert2 es una librería que hace alertas bonitas)
        Swal.fire({
            text: `El vehículo ${placa} ya está registrado en el parqueadero.`,
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#00c3ff',
            background: '#1a1a1a',
            color: '#ffffff'
        });
        return; // Detenemos la función, no guardamos nada
    }

    // 5. Creamos el objeto del vehículo
    const nuevoRegistro = {
        placa: placa,
        tipo: tipo,
        entrada: fechaEntrada
    };

    // 6. Agregamos el vehículo y guardamos en la cajita 'vehiculosActivos'
    vehiculosActivos.push(nuevoRegistro);
    localStorage.setItem('vehiculosActivos', JSON.stringify(vehiculosActivos));

    // 7. Mostramos confirmación
    Swal.fire({
        text: `El vehículo ${placa} ha ingresado correctamente.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00c3ff',
        background: '#1a1a1a',
        color: '#ffffff'
    });

    // 8. Limpiamos el formulario
    document.getElementById('formParqueadero').reset();
    document.getElementById('placa').style.borderColor = "#000000";
    document.getElementById('placa').style.boxShadow = "none";
});


// --- RELOJ DIGITAL ---
function actualizarReloj() {
    const ahora = new Date();
    const horas   = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    document.getElementById('reloj').innerText = `${horas}:${minutos}:${segundos}`;
}
setInterval(actualizarReloj, 1000);
actualizarReloj(); // Llamada inicial para que no empiece en 00:00:00


// --- MAYÚSCULAS AUTOMÁTICAS Y VALIDACIÓN VISUAL ---
const inputPlaca = document.getElementById('placa');

inputPlaca.addEventListener('input', function() {
    this.value = this.value.toUpperCase();

    if (this.value.length === 6) {
        this.style.borderColor = "#00c3ff";
        this.style.boxShadow = "0 0 10px rgba(0, 195, 255, 0.5)";
    } else {
        this.style.borderColor = "#000000";
        this.style.boxShadow = "none";
    }
});