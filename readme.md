# BYTE_NEWS 8b

Aplicativo web de noticias sobre tecnología con temática retro 8-bit / neobrutalista, desarrollado para el módulo de **Frontend** en el **Politécnico Grancolombiano**.

---

## 📌 Descripción

BYTE_NEWS 8b es un portal informativo desarrollado con tecnologías web nativas (HTML5, CSS y JavaScript Vanilla). La aplicación consume y gestiona publicaciones desde un archivo local JSON, permitiendo interactuar con el contenido sin depender de librerías ni frameworks externos.

---

## ⚙️ Funcionalidades

* **Catálogo dinámico:** Carga de noticias desde `data/noticias.json` con filtros por categoría.
* **Mini CRUD:** Creación de noticias mediante ventana modal y eliminación directa desde la tarjeta, con actualización inmediata en pantalla.
* **Favoritos con persistencia:** Opción para guardar o quitar noticias favoritas usando `localStorage`.
* **Modo Claro / Oscuro:** Interruptor Sol/Luna con persistencia de preferencia en el navegador.
* **Vista de detalle:** Pantalla completa para leer el artículo seleccionado.
* **Formulario de contacto:** Validación de campos y formato de correo electrónico mediante expresiones regulares (`Regex`).
* **Diseño responsivo:** Adaptado para pantallas de computador y dispositivos móviles usando CSS Grid y Flexbox.

---

## 📂 Estructura del Proyecto

```text
byte-news-8b/
├── index.html          # Estructura principal
├── README.md           # Documentación del proyecto
├── css/
│   └── styles.css      # Estilos visuales y modo claro/oscuro
├── js/
│   └── app.js          # Lógica, eventos y persistencia local
└── data/
    └── noticias.json   # Datos de los artículos
```

---

## 🚀 Cómo ejecutar el proyecto

1. Clona el repositorio en tu computador:
   ```bash
   git clone https://github.com/marlondaguas/byte-news-8b.git
   ```
2. Entra a la carpeta del proyecto:
   ```bash
   cd byte-news-8b
   ```
3. Ábrelo en Visual Studio Code y ejecútalo con **Live Server** (clic derecho sobre `index.html` > *Open with Live Server*).  
   *Nota: Se requiere un servidor local para que el navegador permita la carga del archivo `data/noticias.json` mediante `fetch`.*

---

## 👤 Autor

* **Estudiante:** Marlon de Aguas
* **Módulo:** Frontend
* **Institución:** Politécnico Grancolombiano (2026)