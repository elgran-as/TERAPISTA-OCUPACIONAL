const turnosSemilla = [
    {
        "id": 1,
        "paciente": "Juan Pérez",
        "dia": "Martes",
        "hora": "10:15", // Adaptado al bloque real de 45 min de tu agenda
        "modalidad": "Presencial",
        "servicio": "Evaluaciones funcionales de la vida diaria"
    },
    {
        "id": 2,
        "paciente": "Ana Gómez",
        "dia": "Jueves",
        "hora": "11:00", // Coincide con tu bloque
        "modalidad": "Online",
        "servicio": "Sesiones individuales de terapia ocupacional"
    }
];

export function obtenerTurnos() {
    try {
        const guardados = localStorage.getItem("turnos_agenda");
        if (!guardados) {
            // Si está vacío, inyectamos tus datos de prueba automáticamente
            localStorage.setItem("turnos_agenda", JSON.stringify(turnosSemilla));
            return turnosSemilla;
        }
        return JSON.parse(guardados);
    } catch (e) {
        console.error("Error leyendo localStorage", e);
        return [];
    }
}

export function guardarTurnos(turnos) {
    try {
        localStorage.setItem("turnos_agenda", JSON.stringify(turnos));
    } catch (e) {
        console.error("Error escribiendo en localStorage", e);
    }
}

export function gestionarSesionUsuario() {
    const alerta = document.getElementById("alerta-sesion");
    if (!alerta) return;

    const yaVisitoEnEstaSesion = sessionStorage.getItem("usuario_activo_sesion");
    if (!yaVisitoEnEstaSesion) {
        alerta.style.display = "block";
        alerta.textContent = "⏱️ ¡Bienvenido! Selecciona un horario libre en la agenda para iniciar tu solicitud de reserva.";
        sessionStorage.setItem("usuario_activo_sesion", "true");
    } else {
        alerta.style.display = "block";
        alerta.textContent = "⚡ Estado: Sesión activa. Tus cambios se sincronizan en tiempo real.";
    }
}