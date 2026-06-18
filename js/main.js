document.addEventListener('DOMContentLoaded', function () {
    console.log('¡Página cargada exitosamente!');

    var yearEl = document.getElementById('current-year');
    var dateTimeEl = document.getElementById('current-date-time');

    function updateDateTime() {
        try {
            var now = new Date();

            var optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
            var currentDate = now.toLocaleDateString('es-ES', optionsDate);

            var optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
            var currentTime = now.toLocaleTimeString('es-ES', optionsTime);

            if (yearEl) {
                yearEl.textContent = now.getFullYear();
            }
            if (dateTimeEl) {
                dateTimeEl.textContent = currentDate + ' - ' + currentTime;
            }
        } catch (error) {
            console.error('Error al actualizar fecha/hora:', error);
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // --- Form submission handling ---
    var form = document.querySelector('.formulario');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn ? submitBtn.textContent : '';

            try {
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Enviando...';
                }

                var formData = new FormData(form);
                var data = {};
                formData.forEach(function (value, key) {
                    data[key] = value;
                });

                console.log('Datos del formulario:', data);

                showFormMessage('¡Gracias! Tu consulta fue enviada correctamente.', 'success');
                form.reset();
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                showFormMessage('Hubo un error al enviar. Por favor, intentá de nuevo.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        });
    }

    function showFormMessage(text, type) {
        var existing = document.querySelector('.form-feedback');
        if (existing) {
            existing.remove();
        }

        var msg = document.createElement('div');
        msg.className = 'form-feedback form-feedback--' + type;
        msg.setAttribute('role', 'alert');
        msg.textContent = text;

        var form = document.querySelector('.formulario');
        if (form) {
            form.appendChild(msg);
        }

        setTimeout(function () {
            if (msg.parentNode) {
                msg.remove();
            }
        }, 5000);
    }

    // --- Image error handling ---
    var images = document.querySelectorAll('img');
    images.forEach(function (img) {
        img.addEventListener('error', function () {
            if (this.dataset.errorHandled) return;
            this.dataset.errorHandled = 'true';

            this.style.display = 'none';

            var fallback = document.createElement('div');
            fallback.className = 'img-fallback';
            fallback.setAttribute('role', 'img');
            fallback.setAttribute('aria-label', this.alt || 'Imagen no disponible');
            fallback.textContent = this.alt || 'Imagen no disponible';

            this.parentNode.insertBefore(fallback, this.nextSibling);

            console.warn('No se pudo cargar la imagen:', this.src);
        });

        if (img.complete && img.naturalWidth === 0 && img.src) {
            img.dispatchEvent(new Event('error'));
        }
    });
});
