console.log("¡Página cargada exitosamente!");

/* ---- Date/time (unchanged logic) ---- */
function updateDateTime() {
    var now = new Date();

    var optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    var currentDate = now.toLocaleDateString('es-ES', optionsDate);

    var optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    var currentTime = now.toLocaleTimeString('es-ES', optionsTime);

    document.getElementById('current-year').textContent = now.getFullYear();
    document.getElementById('current-date-time').textContent = currentDate + ' - ' + currentTime;
}

updateDateTime();
setInterval(updateDateTime, 1000);

/* ---- Data-driven sections ---- */

function buildCard(servicio) {
    return createElement('div', { class: 'card' }, [
        createElement('h3', null, [servicio.titulo]),
        createElement('p', null, [servicio.descripcion])
    ]);
}

function buildGalleryItem(item) {
    return createElement('div', { class: 'item-galeria' }, [
        createElement('img', { src: item.src, alt: item.alt })
    ]);
}

function buildTableRow(esp) {
    return createElement('tr', null, [
        createElement('td', null, [esp.ambito]),
        createElement('td', null, [esp.intervencion]),
        createElement('td', null, [esp.beneficio])
    ]);
}

renderList('.cards', SERVICIOS, buildCard);
renderList('.grid-imagenes', GALERIA, buildGalleryItem);
renderList('.tabla-estilizada tbody', ESPECIALIDADES, buildTableRow);
