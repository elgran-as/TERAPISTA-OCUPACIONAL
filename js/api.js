// API del Clima (Open-Meteo)
export async function obtenerClimaConsultorio() {
    const lat = "-34.6118";
    const lon = "-58.4173";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("No se pudo conectar con el servicio meteorológico.");
        const data = await res.json();
        return {
            temp: data.current_weather.temperature,
            wind: data.current_weather.windspeed
        };
    } catch (error) {
        console.warn("Aviso: No se pudo cargar el clima dinámico, se usará modo offline:", error.message);
        return { temp: "22", wind: "12" }; // Retorno seguro por defecto para que la app no quede colgada
    }
}

// API Simulada del Carrito de Compras
export const ApiCarrito = {
    async procesarPagoYReserva(datosReserva) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1400)); // Simula latencia del gateway
            if (!datosReserva.paciente || !datosReserva.email) {
                return { success: false, error: "Faltan datos requeridos del paciente." };
            }
            return { success: true, transaccionId: `TX-${Math.floor(Math.random() * 90000) + 10000}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};