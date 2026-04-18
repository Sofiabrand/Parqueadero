// inicio de pagina
document.addEventListener('DOMContentLoaded', function() {

    // Cupo máximo del parqueadero
    const CUPO_MAXIMO = 20;

    // Leemos los vehículos activos
    //JSON.parse(...) = convertir ese texto en una lista que JavaScript entiende
    // || [] = si la cajita está vacía, usamos una lista vacía para no tener errores
    const vehiculosActivos = JSON.parse(localStorage.getItem('vehiculosActivos')) || [];

    // Contamos cuántos vehiculos hay actualmente
    const totalActivos = vehiculosActivos.length;

    // Calculamos cupos disponibles restando el total de activos al cupo máximo
    const disponibles = CUPO_MAXIMO - totalActivos;

     // .innerText = ... escribe el número dentro de esa etiqueta
    document.getElementById('vehiculos').innerText = totalActivos;

    // Mostramos cupos disponibles 
    if (disponibles <= 0) {
        // Si está lleno: cambiamos el color del texto a rojo
        document.getElementById('cupos').style.color = "#ff4d4d";

         // Y escribimos la palabra LLENO en lugar de un número
        document.getElementById('cupos').innerText = "LLENO";

         // Si todavía hay espacio: simplemente mostramos cuántos cupos quedan
    } else {
        document.getElementById('cupos').innerText = disponibles;
    }

});