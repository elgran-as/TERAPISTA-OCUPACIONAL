"use strict";

function updateDateTime() {
    var now = new Date();

    var optionsDate = { year: "numeric", month: "long", day: "numeric" };
    var currentDate = now.toLocaleDateString("es-ES", optionsDate);

    var optionsTime = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    var currentTime = now.toLocaleTimeString("es-ES", optionsTime);

    var yearEl = document.getElementById("current-year");
    var dateTimeEl = document.getElementById("current-date-time");
    if (yearEl) { yearEl.textContent = now.getFullYear(); }
    if (dateTimeEl) { dateTimeEl.textContent = currentDate + " - " + currentTime; }
}

updateDateTime();
setInterval(updateDateTime, 1000);

function sanitize(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

(function () {
    var form = document.querySelector(".formulario");
    if (!form) { return; }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var nombre = sanitize(form.elements.nombre.value.trim());
        var email = sanitize(form.elements.email.value.trim());
        var telefono = sanitize(form.elements.telefono.value.trim());
        var mensaje = sanitize(form.elements.mensaje.value.trim());

        if (!nombre || !email || !mensaje) { return; }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) { return; }

        if (telefono && !/^[0-9()\-+\s]{7,20}$/.test(telefono)) { return; }

        form.reset();
    });
})();
