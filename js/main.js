/* ==========================================================================
   CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
   ========================================================================== */

// Días hábiles de atención
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Bloques horarios optimizados para sesiones de 45 minutos
const HORAS = [
    "08:00", "08:45", "09:30", "10:15", "11:00", "11:45", 
    "12:30", "14:00", "14:45", "15:30", "16:15"
];
// Nota: 13:15 está bloqueado para almuerzo

// Base de datos indexada para el árbol de categorías y servicios
const DATA_SERVICIOS = {
    evaluacion: [
        "Evaluaciones funcionales de la vida diaria",
        "Valoraciones de independencia en actividades cotidianas",
        "Consultas de orientación para familias y cuidadores",
        "Segunda opinión profesional sobre planes de intervención",
        "Evaluaciones ergonómicas para trabajo desde casa o en oficina"
    ],
    terapeuticos: [
        "Sesiones individuales de terapia ocupacional",
        "Programas para niños con dificultades de desarrollo",
        "Intervención en integración sensorial",
        "Rehabilitación de adultos tras lesiones o enfermedades",
        "Terapia para personas mayores (autonomía y prevención de caídas)",
        "Entrenamiento en actividades cotidianas (vestido, higiene, alimentación)"
    ],
    online: [
        "Programas de estimulación cognitiva",
        "Entrenamiento en habilidades ejecutivas (organización, planificación)",
        "Talleres para manejo del estrés y equilibrio ocupacional",
        "Programas para mejorar hábitos y rutinas saludables",
        "Seguimiento virtual (con evaluación inicial previa)"
    ],
    empresas: [
        "Evaluaciones ergonómicas corporativas",
        "Capacitación en prevención de lesiones laborales",
        "Programas de bienestar ocupacional",
        "Asesoría para inclusión laboral de personas con discapacidad"
    ],
    familias: [
        "Escuela para padres",
        "Capacitación a cuidadores de adultos mayores",
        "Guías para adaptación segura del hogar",
        "Asesoramiento para favorecer la independencia"
    ],
    productos: [
        "Guías descargables en PDF",
        "Cuadernos de ejercicios cognitivos",
        "Planificadores de rutinas",
        "Materiales de estimulación para niños",
        "Checklists para cuidadores",
        "Cursos grabados / Webinars",
        "Membresías con contenido exclusivo"
    ],
    suscripciones: [
        "Acceso mensual a recursos descargables",
        "Charlas mensuales en vivo y Comunidad privada",
        "Seguimiento grupal y rutinas nuevas cada mes"
    ]
};

// Estado interno de la aplicación (Turnos agendados / Carrito)
let turnos = [];
let seleccionActual = { dia: "", hora: "" };

/* ==========================================================================
   CICLO DE VIDA DE LA APLICACIÓN (INITIALIZATION)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
    // Reloj y Fechas
    inicializarRelojYFechas();

    // Persistencia y Render de Agenda
    cargarTurnosLocal();
    await cargarAgendaInicial();
    crearAgenda();
    
    // Actualización inicial del contador de reservas en el header
    actualizarContadorHeader();

    // Inicialización de Eventos del DOM
    inicializarEventosGenerales();
    inicializarEventosCarrito();

    // Consumo Asíncrono de APIs Externas
    cargarClima();
});

/* ==========================================================================
   RELOJ, FECHAS Y METADATOS DEL PIE DE PÁGINA
   ========================================================================== */
function inicializarRelojYFechas() {
    const currentYearSpan = document.getElementById("current-year");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    function actualizarReloj() {
        const dateTimeContainer = document.getElementById("current-date-time");
        if (dateTimeContainer) {
            const ahora = new Date();
            const opciones = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            };
            dateTimeContainer.textContent = ahora.toLocaleDateString('es-AR', opciones);
        }
    }

    actualizarReloj();
    setInterval(actualizarReloj, 1000);
}

/* ==========================================================================
   PERSISTENCIA DE DATOS (LOCALSTORAGE Y DATOS MOCK)
   ========================================================================== */
function cargarTurnosLocal() {
    try {
        const turnosGuardados = localStorage.getItem("turnos_agenda");
        if (turnosGuardados) {
            turnos = JSON.parse(turnosGuardados);
        }
    } catch (error) {
        console.error("Error al leer localStorage:", error);
        turnos = [];
    }
}

function guardarTurnos() {
    try {
        localStorage.setItem("turnos_agenda", JSON.stringify(turnos));
    } catch (error) {
        console.error("Error al escribir en localStorage:", error);
    }
}

// Simulación asíncrona de carga de datos iniciales del servidor
async function cargarAgendaInicial() {
    if (turnos.length === 0) {
        // Retraso controlado para simular llamadas a red / DB de forma no bloqueante
        await new Promise(resolve => setTimeout(resolve, 300));
        
        turnos = [
            {
                id: 1001,
                paciente: "Carlos Mendoza",
                email: "carlos.m@mail.com",
                servicio: "Evaluaciones funcionales de la vida diaria",
                modalidad: "Presencial",
                precio: 50000,
                dia: "Lunes",
                hora: "09:30"
            },
            {
                id: 1002,
                paciente: "Amalia Silva",
                email: "amalia@mail.com",
                servicio: "Sesiones individuales de terapia ocupacional",
                modalidad: "Online",
                precio: 50000,
                dia: "Miércoles",
                hora: "11:00"
            }
        ];
        guardarTurnos();
    }
}

/* ==========================================================================
   RENDERIZADO DE LA INTERFAZ DE USUARIO (DOM MANIPULATION)
   ========================================================================== */
function crearAgenda() {
    const container = document.getElementById("agenda-container");
    if (!container) return;

    let html = `
        <table class="tabla-agenda">
            <thead>
                <tr>
                    <th>Horario</th>
                    ${DIAS.map(dia => `<th>${dia}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;

    HORAS.forEach(hora => {
        html += `<tr><td class="hora-columna">${hora} hs</td>`;
        
        DIAS.forEach(dia => {
            const turno = turnos.find(t => t.dia === dia && t.hora === hora);
            
            if (turno) {
                html += `
                    <td class="ocupado">
                        <div class="celda-agenda-contenido">
                            <span>${escaparHTML(turno.paciente)}</span>
                            <small style="font-weight: bold; color: var(--color-accent);">${escaparHTML(turno.servicio)}</small>
                            <small>45 min — $50.000</small>
                        </div>
                    </td>
                `;
            } else {
                html += `
                    <td class="libre" onclick="abrirModal('${dia}', '${hora}')">
                        <div class="celda-agenda-contenido">
                            <span>Disponible</span>
                            <small>${dia} · ${hora}</small>
                        </div>
                    </td>
                `;
            }
        });
        
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

/* ==========================================================================
   LÓGICA DEL CARRITO, INDICADORES Y MENÚS ENCADENADOS
   ========================================================================== */
function actualizarContadorHeader() {
    const contadorSpan = document.getElementById("carrito-contador");
    if (contadorSpan) {
        contadorSpan.textContent = turnos.length;
    }
}

function inicializarEventosCarrito() {
    const categoriaSelect = document.getElementById("categoria-servicio");
    const servicioSelect = document.getElementById("servicio");

    if (categoriaSelect && servicioSelect) {
        categoriaSelect.addEventListener("change", (e) => {
            const categoriaElegida = e.target.value;
            
            // Inicializar/Limpiar menú subordinado
            servicioSelect.innerHTML = '<option value="">-- Seleccione una opción --</option>';
            
            if (categoriaElegida && DATA_SERVICIOS[categoriaElegida]) {
                // Población interactiva con el precio unificado de $50.000
                DATA_SERVICIOS[categoriaElegida].forEach(item => {
                    const option = document.createElement("option");
                    option.value = item;
                    option.textContent = `${item} — $50.000`;
                    option.dataset.precio = "50000"; 
                    servicioSelect.appendChild(option);
                });
                servicioSelect.disabled = false;
            } else {
                servicioSelect.disabled = true;
            }
            actualizarVistaPreviaCarrito();
        });

        servicioSelect.addEventListener("change", actualizarVistaPreviaCarrito);
    }
}

function actualizarVistaPreviaCarrito() {
    const servicioSelect = document.getElementById("servicio");
    const vistaPrevia = document.getElementById("carrito-vista-previa");
    const detalle = document.getElementById("carrito-detalle");
    const total = document.getElementById("carrito-total");
    
    const dia = document.getElementById("diaSeleccionado")?.value;
    const hora = document.getElementById("horaSeleccionada")?.value;

    if (!servicioSelect || !vistaPrevia || !detalle || !total) return;

    const servicioSeleccionado = servicioSelect.value;

    if (servicioSeleccionado) {
        const optionSeleccionada = servicioSelect.options[servicioSelect.selectedIndex];
        const precio = parseInt(optionSeleccionada.dataset.precio || 0);

        vistaPrevia.style.display = "block";
        detalle.innerHTML = `
            <strong>Ítem:</strong> ${servicioSeleccionado}<br>
            📅 <strong>Cita:</strong> ${dia} a las ${hora} hs.<br>
            ⏱️ <strong>Bloque:</strong> 45 minutos continuos.
        `;
        total.textContent = `$${precio.toLocaleString('es-AR')}`;
    } else {
        vistaPrevia.style.display = "none";
        detalle.textContent = "Ningún servicio seleccionado";
        total.textContent = "$0";
    }
}

/* ==========================================
   PROCESAMIENTO ASÍNCRONO DE RESERVA Y PAGO
   ========================================== */
async function procesarReservaCarrito(event) {
    event.preventDefault();

    const paciente = document.getElementById("paciente")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const telefono = document.getElementById("telefono")?.value.trim();
    const servicioSelect = document.getElementById("servicio");
    const modalidad = document.getElementById("modalidad")?.value;
    const mensaje = document.getElementById("mensaje")?.value.trim();
    const dia = document.getElementById("diaSeleccionado")?.value;
    const hora = document.getElementById("horaSeleccionada")?.value;

    if (!paciente || !email || !servicioSelect || !servicioSelect.value) {
        alert("Por favor rellene todos los campos obligatorios del carrito.");
        return;
    }

    const servicio = servicioSelect.value;
    const precio = parseInt(servicioSelect.options[servicioSelect.selectedIndex].dataset.precio || 50000);

    // Validación crítica en el lado del cliente
    if (turnos.some(t => t.dia === dia && t.hora === hora)) {
        alert("Lo sentimos, este bloque horario acaba de ser reservado por otro usuario.");
        cerrarModal();
        return;
    }

    // Cambiar estado visual del botón a carga (Efecto asíncronismo seguro)
    const botonSubmit = event.target.querySelector('button[type="submit"]');
    const textoOriginal = botonSubmit.textContent;
    botonSubmit.textContent = "Verificando Transacción y Reservando...";
    botonSubmit.disabled = true;

    try {
        // Simulación asíncrona de latencia hacia una pasarela de pagos (1.8s)
        await new Promise(resolve => setTimeout(resolve, 1800));

        const nuevoTurno = {
            id: Date.now(),
            paciente,
            email,
            telefono,
            servicio,
            modalidad,
            precio,
            mensaje,
            dia,
            hora
        };

        // Modificación del estado global y persistencia
        turnos.push(nuevoTurno);
        guardarTurnos();
        crearAgenda();
        
        // Actualización síncrona inmediata del contador en el Header
        actualizarContadorHeader();

        alert(`¡Turno asignado y Pago Simulado con Éxito!\n\nDetalle del Carrito:\n- ${servicio}\n- Total: $${precio.toLocaleString('es-AR')}\n- Bloque: 45 min (${dia} a las ${hora} hs).`);
        cerrarModal();

    } catch (error) {
        console.error("Fallo transaccional:", error);
        alert("Error de comunicación de red al procesar el carrito.");
    } finally {
        botonSubmit.textContent = textoOriginal;
        botonSubmit.disabled = false;
    }
}

/* ==========================================================================
   CONTROL DE VENTANAS MODALES
   ========================================================================== */
function abrirModal(dia, hora) {
    seleccionActual = { dia, hora };
    const inputDia = document.getElementById("diaSeleccionado");
    const inputHora = document.getElementById("horaSeleccionada");
    const detalleSeleccion = document.getElementById("detalleSeleccion");

    if (inputDia) inputDia.value = dia;
    if (inputHora) inputHora.value = hora;

    if (detalleSeleccion) {
        detalleSeleccion.innerHTML = `<strong>Fecha:</strong> ${dia}<br><strong>Horario:</strong> ${hora} hs<br><span>Presiona continuar para completar la reserva.</span>`;
    }

    document.getElementById("formTurno")?.reset();
    const servicioSelect = document.getElementById("servicio");
    if (servicioSelect) {
        servicioSelect.innerHTML = '<option value="">-- Primero elija una categoría --</option>';
        servicioSelect.disabled = true;
    }
    actualizarVistaPreviaCarrito();

    const modalSeleccion = document.getElementById("modalSeleccion");
    if (modalSeleccion) {
        modalSeleccion.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
    cerrarModal();
}

function continuarSeleccion() {
    cerrarModalSeleccion();
    const modalTurno = document.getElementById("modalTurno");
    if (modalTurno) {
        modalTurno.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function cerrarModal() {
    const modal = document.getElementById("modalTurno");
    if (modal) {
        modal.style.display = "none";
    }
}

function cerrarModalSeleccion() {
    const modal = document.getElementById("modalSeleccion");
    if (modal) {
        modal.style.display = "none";
        if (!document.getElementById("modalTurno")?.style.display || document.getElementById("modalTurno").style.display === "none") {
            document.body.style.overflow = "auto";
        }
    }
}

function abrirResumenCarrito() {
    const modal = document.getElementById("modalCarrito");
    const lista = document.getElementById("carrito-resumen-lista");
    const total = document.getElementById("carrito-resumen-total");

    if (!modal || !lista || !total) return;

    const totalPrecio = turnos.reduce((sum, turno) => sum + (Number(turno.precio) || 0), 0);

    if (turnos.length === 0) {
        lista.innerHTML = '<div class="carrito-resumen-item">Todavía no hay turnos reservados.</div>';
    } else {
        lista.innerHTML = turnos.map(turno => `
            <div class="carrito-resumen-item">
                <strong>${escaparHTML(turno.servicio || "Servicio")}</strong>
                <span>${escaparHTML(turno.dia)} · ${escaparHTML(turno.hora)} hs</span>
                <small>${escaparHTML(turno.paciente || "Paciente")}</small>
                <span>$${(Number(turno.precio) || 0).toLocaleString("es-AR")}</span>
            </div>
        `).join("");
    }

    total.textContent = `$${totalPrecio.toLocaleString("es-AR")}`;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function cerrarModalCarrito() {
    const modal = document.getElementById("modalCarrito");
    if (modal) {
        modal.style.display = "none";
        if (!document.getElementById("modalTurno")?.style.display || document.getElementById("modalTurno").style.display === "none") {
            document.body.style.overflow = "auto";
        }
    }
}

/* ==========================================================================
   FUNCIONES PARA GALERÍA DE FOTOS
   ========================================================================== */
function abrirModalGaleria(event) {
    const imagenSrc = event.target.src;
    const imagenAlt = event.target.alt;
    
    const modal = document.getElementById("modalGaleria");
    const imagenGrande = document.getElementById("imagenGrandeGaleria");
    
    if (modal && imagenGrande) {
        imagenGrande.src = imagenSrc;
        imagenGrande.alt = imagenAlt;
        modal.classList.add("activo");
        document.body.style.overflow = "hidden";
    }
}

function cerrarModalGaleria() {
    const modal = document.getElementById("modalGaleria");
    if (modal) {
        modal.classList.remove("activo");
        document.body.style.overflow = "auto";
    }
}

// Cerrar galería con tecla Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const modalGaleria = document.getElementById("modalGaleria");
        if (modalGaleria?.classList.contains("activo")) {
            cerrarModalGaleria();
        }
    }
});

/* ==========================================================================
   CONSUMO ASÍNCRONO DE APIS (FETCH WEATHER)
   ========================================================================== */
async function cargarClima() {
    const climaContainer = document.getElementById("clima-container");
    if (!climaContainer) return;

    // Coordenadas de la Ciudad de Buenos Aires, Argentina
    const lat = "-34.6118";
    const lon = "-58.4173";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Status HTTP erróneo");
        
        const datos = await respuesta.json();
        const temp = datos.current_weather.temperature;
        const windspeed = datos.current_weather.windspeed;

        climaContainer.innerHTML = `📍 Buenos Aires: <strong>${temp}°C</strong> | Viento: ${windspeed} km/h (Consultorio Abierto)`;
    } catch (error) {
        console.error("Error al conectar con Open-Meteo API:", error);
        climaContainer.textContent = "Clima no disponible en este momento.";
    }
}

/* ==========================================================================
   EVENT LISTENERS GENERALES Y RESPONSIVE
   ========================================================================== */
function inicializarEventosGenerales() {
    // Cierre de modal mediante cruz o fondo
    document.getElementById("cerrarModal")?.addEventListener("click", cerrarModal);
    document.getElementById("cerrarModalSeleccion")?.addEventListener("click", cerrarModalSeleccion);
    document.getElementById("cerrarModalCarrito")?.addEventListener("click", cerrarModalCarrito);
    document.getElementById("cerrarModalGaleria")?.addEventListener("click", cerrarModalGaleria);
    document.getElementById("btnContinuarSeleccion")?.addEventListener("click", continuarSeleccion);

    window.addEventListener("click", (e) => {
        if (e.target === document.getElementById("modalTurno")) cerrarModal();
        if (e.target === document.getElementById("modalSeleccion")) cerrarModalSeleccion();
        if (e.target === document.getElementById("modalCarrito")) cerrarModalCarrito();
        if (e.target === document.getElementById("modalGaleria")) cerrarModalGaleria();
    });

    // Galería: Agregar listeners a las imágenes
    document.querySelectorAll(".item-galeria img").forEach(img => {
        img.addEventListener("click", abrirModalGaleria);
    });

    // Control de envío del formulario (Carrito)
    document.getElementById("formTurno")?.addEventListener("submit", procesarReservaCarrito);

    const carritoIndicador = document.getElementById("carrito-indicador");
    carritoIndicador?.addEventListener("click", abrirResumenCarrito);
    carritoIndicador?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            abrirResumenCarrito();
        }
    });

    // Menú Responsive (Hamburguesa)
    const menuToggle = document.getElementById("menu-toggle");
    const menuNavegacion = document.querySelector(".navegacion .menu");

    if (menuToggle && menuNavegacion) {
        menuToggle.addEventListener("click", () => {
            menuNavegacion.classList.toggle("activo");
        });

        // Cerrar menú al clickear un enlace
        menuNavegacion.querySelectorAll("a").forEach(enlace => {
            enlace.addEventListener("click", () => {
                menuNavegacion.classList.remove("activo");
            });
        });
    }
}

/* ==========================================================================
   FUNCIONES AUXILIARES / SEGURIDAD
   ========================================================================== */
function escaparHTML(cadena) {
    if (!cadena) return "";
    return cadena
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}