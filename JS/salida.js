document.getElementById('formSalida').addEventListener('submit', function(e) {
    e.preventDefault();

    // Capturamos la placa en mayúsculas
    const placaBuscar = document.getElementById('placaSalida').value.toUpperCase().trim();

    // Leemos de la MISMA cajita que usó entrada.js
    let vehiculosActivos = JSON.parse(localStorage.getItem('vehiculosActivos')) || [];
    let historialPagos   = JSON.parse(localStorage.getItem('historialPagos'))   || [];

    // Buscamos el vehículo por su placa
    const indice = vehiculosActivos.findIndex(v => v.placa.toUpperCase() === placaBuscar);

    // Si lo encontramos
    if (indice !== -1) {
        const vehiculo = vehiculosActivos[indice];

        // --- CÁLCULO DEL TIEMPO ---
        const horaEntrada = new Date(vehiculo.entrada);
        const horaSalida  = new Date();

        let diferenciaMs = horaSalida - horaEntrada;

        // Convertimos milisegundos a horas y redondeamos hacia arriba
        let horasCobrar = Math.ceil(diferenciaMs / (1000 * 60 * 60));

        // Mínimo 1 hora de cobro
        if (horasCobrar <= 0) horasCobrar = 1;

        // CÁLCULO DEL COBRO
        const totalPagar = horasCobrar * 1000;

        //MOSTRAMOS EL RESUMEN
        Swal.fire({
            html: `
                <div style="text-align: left; color: white; font-family: Arial, sans-serif; line-height: 1.8;">
                    <p><b>Placa:</b> ${vehiculo.placa}</p>
                    <p><b>Tipo:</b> ${vehiculo.tipo}</p>
                    <p><b>Ingreso:</b> ${horaEntrada.toLocaleString()}</p>
                    <p><b>Salida:</b> ${horaSalida.toLocaleString()}</p>
                    <p><b>Tiempo:</b> ${horasCobrar} Hora(s)</p>
                    <hr style="border: 0.5px solid #444; margin: 10px 0;">
                    <h2 style="color: #00c3ff; text-align: center;">
                        Total: $${totalPagar.toLocaleString()}
                    </h2>
                </div>
            `,
            icon: 'info',
            background: '#1a1a1a',
            color: '#ffffff',
            showCancelButton: true,
            confirmButtonText: 'Confirmar Pago',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#cc0000'

        }).then((result) => {

            if (result.isConfirmed) {

                // Guardamos el registro en el historial de pagos
                const registroFinal = {
                    placa:   vehiculo.placa,
                    tipo:    vehiculo.tipo,
                    entrada: vehiculo.entrada,
                    salida:  horaSalida.toISOString(),
                    horas:   horasCobrar,
                    total:   totalPagar
                };

                historialPagos.push(registroFinal);
                localStorage.setItem('historialPagos', JSON.stringify(historialPagos));

                // Eliminamos el vehículo de los activos
                vehiculosActivos.splice(indice, 1);
                localStorage.setItem('vehiculosActivos', JSON.stringify(vehiculosActivos));

                // si encuentra la placa
                Swal.fire({
                    title: '¡Pago Exitoso!',
                    text: `El vehículo ${placaBuscar} se retiró correctamente.`,
                    icon: 'success',
                    background: '#1a1a1a',
                    color: '#ffffff',
                    confirmButtonColor: '#28a745'
                });

                //se limpia el formulario
                document.getElementById('formSalida').reset();
            }
        });

    } else {
        // Si NO se encontró la placa
        Swal.fire({
            title: 'Placa no encontrada',
            text: `La placa "${placaBuscar}" no está registrada en el parqueadero.`,
            icon: 'error',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#cc0000'
        });
    }
});


// --- MAYÚSCULAS AUTOMÁTICAS EN EL CAMPO DE SALIDA ---
const inputPlacaSalida = document.getElementById('placaSalida');

inputPlacaSalida.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});