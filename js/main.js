console.log("¡Página cargada exitosamente!");

function updateDateTime() {
    const now = new Date();
    
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = now.toLocaleDateString('es-ES', optionsDate);
    
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const currentTime = now.toLocaleTimeString('es-ES', optionsTime);
    
    document.getElementById('current-year').textContent = now.getFullYear();
    document.getElementById('current-date-time').textContent = `${currentDate} - ${currentTime}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);
