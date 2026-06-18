/**
 * Site data — single source of truth for content that was previously
 * duplicated as hard-coded HTML blocks (cards × 3, gallery × 4, table × 3).
 * Adding or removing an entry here automatically updates the page.
 */

var SERVICIOS = [
    {
        titulo: 'Evaluación Funcional',
        descripcion: 'Valoración de habilidades motoras, cognitivas y sensoriales para diseñar un plan de intervención efectivo.'
    },
    {
        titulo: 'Intervención Personalizada',
        descripcion: 'Sesiones individuales y familiares para promover la autonomía en actividades de la vida diaria.'
    },
    {
        titulo: 'Adaptaciones del Entorno',
        descripcion: 'Recomendaciones para adaptar el hogar, la escuela o el trabajo y mejorar la independencia.'
    }
];

var GALERIA = [
    { src: 'images/galeria1.jpg', alt: 'Sesión de terapia ocupacional' },
    { src: 'images/galeria2.jpg', alt: 'Actividad manual terapéutica' },
    { src: 'images/galeria3.jpg', alt: 'Espacio de trabajo adaptado' },
    { src: 'images/galeria4.jpg', alt: 'Intervención en taller ocupacional' }
];

var ESPECIALIDADES = [
    {
        ambito: 'Niñez',
        intervencion: 'Desarrollo de motricidad fina y coordinación',
        beneficio: 'Mejora del desempeño escolar y la independencia'
    },
    {
        ambito: 'Adultos',
        intervencion: 'Rehabilitación tras lesiones o condiciones crónicas',
        beneficio: 'Recuperación funcional y mayor autonomía'
    },
    {
        ambito: 'Adultos mayores',
        intervencion: 'Adaptación del hogar y rutinas diarias',
        beneficio: 'Más seguridad y calidad de vida'
    }
];
