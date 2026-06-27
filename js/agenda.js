import { obtenerTurnos } from './storage.jsx';

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
export const HORAS = ["08:00", "08:45", "09:30", "10:15", "11:00", "11:45", "12:30", "13:15", "14:00", "14:45", "15:30", "16:15"];

export const DATA_SERVICIOS = {
    evaluacion: ["Evaluaciones funcionales de la vida diaria", "Valoraciones de independencia", "Consultas de orientación para familias", "Evaluaciones ergonómicas"],
    terapeuticos: ["Sesiones individuales de terapia ocupacional", "Programas para niños", "Intervención en integración sensorial", "Rehabilitación de adultos"],
    online: ["Programas de estimulación cognitiva", "Entrenamiento en habilidades ejecutivas", "Talleres para manejo del estrés"],
    empresas: ["Evaluaciones ergonómicas corporativas", "Capacitación en prevención"],
    familias: ["Escuela para padres", "Capacitación a cuidadores"],
    productos: ["Guías descargables en PDF", "Cuadernos de ejercicios cognitivos"],
    suscripciones: ["Acceso mensual a recursos", "Charlas mensuales en vivo"]
};

let listaTurnosInternal = [];
let carritoTemporal = []; 

export function setTurnosActivos(data) {
    listaTurnosInternal = data;
}

export function agregarAlCarritoTemporal(dia, hora) {
    carritoTemporal = [{ dia, hora }];
    actualizarContadorHeader();
}

export function limpiarCarritoTemporal() {
    carritoTemporal = [];
    actualizarContadorHeader();
}

export function actualizarContadorHeader() {
    const contador = document.getElementById("carrito-contador");
    if (contador) contador.textContent = carritoTemporal.length;
}

export function crearAgendaDOM() {
    const container = document.getElementById("agenda-container");
    if (!container) return;

    listaTurnosInternal = obtenerTurnos();

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
            const t = listaTurnosInternal.find(turno => turno.dia === dia && turno.hora === hora);
            if (t) {
                // Validación de seguridad para que el script no muera si falta una propiedad
                const servicioSeguro = t.servicio ? t.servicio : (t.modalidad ? `Modalidad: ${t.modalidad}` : "Consulta General");
                html += `
                    <td class="ocupado">
                        ${escaparHTML(t.paciente)}
                        <small style="color:var(--color-accent); font-weight:bold;">${escaparHTML(servicioSeguro)}</small>
                        <small>45 min — Ocupado</small>
                    </td>`;
            } else {
                html += `<td class="libre" data-dia="${dia}" data-hora="${hora}"><span>Disponible</span></td>`;
            }
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

    container.querySelectorAll(".libre").forEach(celda => {
        celda.addEventListener("click", () => {
            const d = celda.getAttribute("data-dia");
            const h = celda.getAttribute("data-hora");
            window.abrirModalGlobal(d, h);
        });
    });
}

export function inicializarEventosMapeo() {
    const cat = document.getElementById("categoria-servicio");
    const srv = document.getElementById("servicio");

    if (cat && srv) {
        cat.addEventListener("change", (e) => {
            const selected = e.target.value;
            srv.innerHTML = '<option value="">-- Seleccione una opción --</option>';
            if (selected && DATA_SERVICIOS[selected]) {
                DATA_SERVICIOS[selected].forEach(item => {
                    const op = document.createElement("option");
                    op.value = item;
                    op.textContent = `${item} — $50.000`;
                    srv.appendChild(op);
                });
                srv.disabled = false;
            } else {
                srv.disabled = true;
            }
            actualizarVistaPrevia();
        });
        srv.addEventListener("change", actualizarVistaPrevia);
    }
}

export function actualizarVistaPrevia() {
    const srv = document.getElementById("servicio");
    const prev = document.getElementById("carrito-vista-previa");
    const det = document.getElementById("carrito-detalle");
    const tot = document.getElementById("carrito-total");
    
    const dia = document.getElementById("diaSeleccionado")?.value;
    const hora = document.getElementById("horaSeleccionada")?.value;

    if (!srv || !prev || !det || !tot) return;

    if (srv.value) {
        prev.style.display = "block";
        det.innerHTML = `<strong>Servicio:</strong> ${srv.value}<br>📅 <strong>Cita:</strong> ${dia} a las ${hora} hs.<br>⏱️ <strong>Duración:</strong> 45 minutos.`;
        tot.textContent = `$50.000`;
    } else {
        prev.style.display = "none";
    }
}

function escaparHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}