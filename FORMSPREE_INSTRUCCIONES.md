# 📧 Guía de Integración - Formspree

## ¿Qué es Formspree?
Formspree es un servicio que permite recibir emails desde formularios HTML sin necesidad de backend. Es **gratuito** y **muy fácil de usar**.

---

## 🚀 Pasos para Integrar Formspree

### 1. **Ir a Formspree**
- Abre https://formspree.io/
- Haz click en **"Sign Up"** (Registrarse)

### 2. **Crear una Cuenta**
- Usa tu email
- Verifica tu email
- Completa los datos básicos

### 3. **Crear un Nuevo Formulario**
- En el dashboard, haz click en **"New Form"**
- Dale un nombre, ejemplo: "Contacto Terapista"
- Haz click en **"Create"**

### 4. **Copiar el ID**
- Verás una URL como: `https://formspree.io/f/xyzabc123`
- **Copia la parte: `xyzabc123`** (ese es tu ID)

### 5. **Actualizar el Formulario en HTML**
En el archivo `index.html`, busca el formulario y cambia el `action`:

**ANTES:**
```html
<form id="formTurno">
```

**DESPUÉS:**
```html
<form id="formTurno" action="https://formspree.io/f/TU_ID_AQUI" method="POST">
```

Reemplaza `TU_ID_AQUI` con el ID que copiaste.

### 6. **Configurar en Formspree (Dashboard)**
- En el dashboard, abre tu formulario
- Ve a **"Settings"**
- En **"Email address"**, ingresa el email donde recibirás las notificaciones
- En **"Redirect after submit"**, puedes poner: `/` (volver a inicio)
- Guarda los cambios

---

## 📝 Ejemplo Completo

```html
<form id="formTurno" action="https://formspree.io/f/xyzabc123" method="POST">
    <input type="hidden" id="diaSeleccionado" name="dia">
    <input type="hidden" id="horaSeleccionada" name="hora">

    <div class="campo">
        <label for="paciente">Nombre Completo</label>
        <input type="text" id="paciente" name="paciente" required>
    </div>

    <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
    </div>

    <div class="campo">
        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" name="telefono">
    </div>

    <div class="campo">
        <label for="servicio">Servicio</label>
        <input type="text" id="servicio" name="servicio" required>
    </div>

    <div class="botones-form">
        <button type="submit" class="boton boton-primario">Enviar Solicitud</button>
    </div>
</form>
```

---

## ✅ Probar el Formulario

1. Abre tu sitio en el navegador
2. Completa el formulario
3. Haz click en "Enviar"
4. Revisa tu email (en Formspree y en la dirección que configuraste)

---

## 🎯 Ventajas de Formspree

✅ **Gratuito** - Hasta 50 envíos por mes sin costo  
✅ **Sin Backend** - No necesitas servidor  
✅ **Fácil de usar** - Solo 5 minutos de configuración  
✅ **Seguro** - Protege tu email de spam  
✅ **Respuestas automáticas** - Puedes enviar confirmación al usuario  
✅ **Exporta datos** - Descarga todas las solicitudes en CSV  

---

## 💡 Alternativas (si Formspree no te funciona)

- **EmailJS** - https://www.emailjs.com/
- **Basin** - https://basin.io/
- **Getform** - https://getform.io/

---

**¡Listo! Tu formulario ahora enviará emails automáticamente.**
