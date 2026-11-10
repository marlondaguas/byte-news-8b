/**
 * BYTE_NEWS 8b - Plataforma Web Front-End
 * Politécnico Grancolombiano - 2026
 * Script de Control Funcional y Persistencia Local
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================================
  // 1. ESTADO DE LA APLICACIÓN (STATE)
  // ========================================================================
  let noticias = [];
  let favoritos = JSON.parse(localStorage.getItem('app-favoritos')) || [];
  let categoriaActiva = 'todas';

  const STORAGE_NOTICIAS_KEY = 'app-noticias';
  const STORAGE_THEME_KEY = 'app-theme';
  const IMAGEN_FALLBACK = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&auto=format&fit=crop&q=80';

  // ========================================================================
  // 2. ELEMENTOS DEL DOM
  // ========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const btnHamburguesa = document.getElementById('btnHamburguesa');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const vistas = document.querySelectorAll('.vista-seccion');

  const gridDestacadas = document.getElementById('gridDestacadas');
  const gridCatalogo = document.getElementById('gridCatalogo');
  const favCount = document.getElementById('favCount');
  const btnVerFavoritos = document.getElementById('btnVerFavoritos');
  const filtrosCategoria = document.querySelectorAll('.btn-filtro');

  // Modal Mini CRUD
  const modalBackdrop = document.getElementById('modalBackdrop');
  const btnAbrirModal = document.getElementById('btnAbrirModal');
  const btnCerrarModal = document.getElementById('btnCerrarModal');
  const btnCancelarModal = document.getElementById('btnCancelarModal');
  const formCrearNoticia = document.getElementById('formCrearNoticia');

  // Vista Detalle
  const btnVolverCatalogo = document.getElementById('btnVolverCatalogo');
  const detalleTitulo = document.getElementById('detalleTitulo');
  const detalleFecha = document.getElementById('detalleFecha');
  const detalleAutor = document.getElementById('detalleAutor');
  const detalleCategoria = document.getElementById('detalleCategoria');
  const detalleImagen = document.getElementById('detalleImagen');
  const detalleContenido = document.getElementById('detalleContenido');
  const btnDetalleFavorito = document.getElementById('btnDetalleFavorito');
  const btnDetalleContacto = document.getElementById('btnDetalleContacto');
  let noticiaActualDetalle = null;

  // Formulario de Contacto
  const formContacto = document.getElementById('formContacto');
  const inputNombre = document.getElementById('inputNombre');
  const inputEmail = document.getElementById('inputEmail');
  const inputMensaje = document.getElementById('inputMensaje');
  const consolaEstado = document.getElementById('consolaEstado');

  // ========================================================================
  // 3. INICIALIZACIÓN Y CARGA DE DATOS (CONECTADO A API DOCKER)
  // ========================================================================
  async function inicializarApp() {
    configurarTema();
    actualizarContadorFavoritos();
    await cargarNoticias();
    renderizarVistas();
    configurarEventos();
  }

  /**
   * Carga las noticias haciendo una petición HTTP GET a la API en Docker
   */
  async function cargarNoticias() {
    try {
      const respuesta = await fetch('/api/noticias');
      if (!respuesta.ok) throw new Error('Error al conectar con la API de noticias');
      noticias = await respuesta.json();
    } catch (error) {
      console.error('Error al obtener noticias de la API:', error);
      noticias = [];
    }
  }

  // ========================================================================
  // 4. CONMUTADOR DE TEMA (LIGHT / DARK MODE)
  // ========================================================================
  function configurarTema() {
    const temaGuardado = localStorage.getItem(STORAGE_THEME_KEY) || 'light';
    if (temaGuardado === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.checked = true;
    } else {
      document.body.classList.remove('dark-theme');
      themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', () => {
      const esOscuro = themeToggle.checked;
      document.body.classList.toggle('dark-theme', esOscuro);
      localStorage.setItem(STORAGE_THEME_KEY, esOscuro ? 'dark' : 'light');
    });
  }

  // ========================================================================
  // 5. NAVEGACIÓN Y CAMBIO DE VISTAS (SPA CONCEPT)
  // ========================================================================
  function cambiarVista(nombreVista) {
    vistas.forEach(vista => vista.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const vistaDestino = document.getElementById(`vista${capitalizar(nombreVista)}`);
    if (vistaDestino) {
      vistaDestino.classList.add('active');
      window.scrollTo(0, 0);
    }

    const linkActivo = document.querySelector(`.nav-link[data-view="${nombreVista}"]`);
    if (linkActivo) linkActivo.classList.add('active');

    // Cerrar menú móvil si está desplegado
    navMenu.classList.remove('show');
  }

  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // ========================================================================
  // 6. RENDERIZADO DINÁMICO DE TARJETAS
  // ========================================================================
  function crearCardHTML(noticia, esCatalogo = false) {
    const esFav = favoritos.includes(noticia.id);
    const imagenSrc = noticia.imagen && noticia.imagen.trim() !== '' ? noticia.imagen : IMAGEN_FALLBACK;

    return `
      <article class="card-noticia" data-id="${noticia.id}">
        <div class="card-img-wrap">
          <img src="${imagenSrc}" alt="${noticia.titulo}" onerror="this.src='${IMAGEN_FALLBACK}'">
        </div>
        <div class="card-cuerpo">
          <span class="card-badge">${noticia.categoria.toUpperCase()}</span>
          <h4 class="card-titulo">${noticia.titulo}</h4>
          <p class="card-desc">${noticia.descripcionCorta}</p>
          <div class="card-acciones">
            <button class="btn-retro btn-primario btn-leer-mas" data-id="${noticia.id}">LEER MAS</button>
            <button class="btn-retro ${esFav ? 'btn-peligro' : 'btn-secundario'} btn-toggle-fav" data-id="${noticia.id}">
              ${esFav ? '♥ FAVORITO' : '+ GUARDAR'}
            </button>
            ${esCatalogo ? `<button class="btn-retro btn-peligro btn-borrar-noticia" data-id="${noticia.id}">[X] BORRAR</button>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  function renderizarVistas() {
    renderizarDestacadas();
    renderizarCatalogo();
  }

  function renderizarDestacadas() {
    // Muestra las 2 primeras noticias como destacadas en Home
    const destacadas = noticias.slice(0, 2);
    gridDestacadas.innerHTML = destacadas.map(n => crearCardHTML(n, false)).join('');
  }

  function renderizarCatalogo(lista = null) {
    let dataset = lista !== null ? lista : noticias;

    if (categoriaActiva !== 'todas' && lista === null) {
      dataset = dataset.filter(n => n.categoria.toLowerCase() === categoriaActiva.toLowerCase());
    }

    if (dataset.length === 0) {
      gridCatalogo.innerHTML = `<p style="grid-column: 1/-1; padding: 20px; background: var(--bg-card); border: 2px solid var(--border-color);">&gt; NO HAY NOTICIAS DISPONIBLES EN ESTA SECCIÓN.</p>`;
      return;
    }

    gridCatalogo.innerHTML = dataset.map(n => crearCardHTML(n, true)).join('');
  }

  // ========================================================================
  // 7. GESTIÓN BÁSICA DE NOTICIAS (MINI CRUD CON API EN DOCKER)
  // ========================================================================
  // Abrir y Cerrar Modal
  btnAbrirModal.addEventListener('click', () => modalBackdrop.classList.add('open'));
  btnCerrarModal.addEventListener('click', () => modalBackdrop.classList.remove('open'));
  btnCancelarModal.addEventListener('click', () => modalBackdrop.classList.remove('open'));

  // CREAR NOTICIA (Envía los datos con POST a la API)
  formCrearNoticia.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('modalTitulo').value.trim();
    const categoria = document.getElementById('modalCategoria').value;
    const imagen = document.getElementById('modalImagen').value.trim();
    const descripcionCorta = document.getElementById('modalDescripcion').value.trim();
    const contenido = document.getElementById('modalContenido').value.trim();

    if (!titulo || !descripcionCorta || !contenido) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    const nuevaNoticia = {
      titulo,
      categoria,
      descripcionCorta,
      contenido,
      imagen: imagen !== '' ? imagen : IMAGEN_FALLBACK,
      autor: 'Marlon de Aguas'
    };

    try {
      // Envío de ida hacia el Contenedor Backend
      const respuesta = await fetch('/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaNoticia)
      });

      if (respuesta.ok) {
        // Petición de vuelta: volvemos a pedir la lista actualizada a la API
        await cargarNoticias();
        renderizarVistas();

        formCrearNoticia.reset();
        modalBackdrop.classList.remove('open');
        alert('Noticia publicada exitosamente en el backend de Docker.');
      } else {
        alert('Ocurrió un error al guardar la noticia en la API.');
      }
    } catch (error) {
      console.error('Error enviando la noticia a la API:', error);
      alert('No se pudo conectar con el servidor backend.');
    }
  });

  // ELIMINAR NOTICIA (Eliminación enviada a la API)
  gridCatalogo.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-borrar-noticia')) {
      const id = Number(e.target.getAttribute('data-id'));
      const confirmar = confirm('¿Deseas eliminar permanentemente esta noticia del catálogo?');

      if (confirmar) {
        try {
          const respuesta = await fetch(`/api/noticias/${id}`, {
            method: 'DELETE'
          });

          if (respuesta.ok) {
            // Remover de la lista local de favoritos si estaba incluida
            favoritos = favoritos.filter(favId => favId !== id);
            localStorage.setItem('app-favoritos', JSON.stringify(favoritos));
            actualizarContadorFavoritos();

            await cargarNoticias();
            renderizarVistas();
          }
        } catch (error) {
          console.error('Error al eliminar la noticia en la API:', error);
        }
      }
    }
  });

  // ========================================================================
  // 8. FAVORITOS CON LOCALSTORAGE
  // ========================================================================
  function toggleFavorito(id) {
    const numId = Number(id);
    if (favoritos.includes(numId)) {
      favoritos = favoritos.filter(favId => favId !== numId);
    } else {
      favoritos.push(numId);
    }
    localStorage.setItem('app-favoritos', JSON.stringify(favoritos));
    actualizarContadorFavoritos();
    renderizarVistas();

    // Actualizar botón si estamos en la vista de detalle
    if (noticiaActualDetalle && noticiaActualDetalle.id === numId) {
      actualizarBotonDetalleFavorito();
    }
  }

  function actualizarContadorFavoritos() {
    favCount.textContent = favoritos.length;
  }

  btnVerFavoritos.addEventListener('click', (e) => {
    e.preventDefault();
    cambiarVista('catalogo');
    const noticiasFavoritas = noticias.filter(n => favoritos.includes(n.id));
    renderizarCatalogo(noticiasFavoritas);
  });

  // ========================================================================
  // 9. VISTA DETALLE
  // ========================================================================
  function abrirDetalle(id) {
    const noticia = noticias.find(n => n.id === Number(id));
    if (!noticia) return;

    noticiaActualDetalle = noticia;
    detalleTitulo.textContent = noticia.titulo;
    detalleFecha.textContent = noticia.fecha;
    detalleAutor.textContent = noticia.autor || 'Redacción';
    detalleCategoria.textContent = noticia.categoria.toUpperCase();
    detalleImagen.src = noticia.imagen || IMAGEN_FALLBACK;
    detalleContenido.textContent = noticia.contenido;

    actualizarBotonDetalleFavorito();
    cambiarVista('detalle');
  }

  function actualizarBotonDetalleFavorito() {
    if (!noticiaActualDetalle) return;
    const esFav = favoritos.includes(noticiaActualDetalle.id);
    btnDetalleFavorito.textContent = esFav ? '♥ REMOVER DE FAVORITOS' : '♥ AGREGAR A FAVORITOS';
    btnDetalleFavorito.className = `btn-retro ${esFav ? 'btn-secundario' : 'btn-peligro'}`;
  }

  btnDetalleFavorito.addEventListener('click', () => {
    if (noticiaActualDetalle) toggleFavorito(noticiaActualDetalle.id);
  });

  btnDetalleContacto.addEventListener('click', () => {
    cambiarVista('contacto');
    inputMensaje.value = `Consulta sobre el artículo: "${noticiaActualDetalle.titulo}" (ID: ${noticiaActualDetalle.id})\n\n`;
    inputMensaje.focus();
  });

  btnVolverCatalogo.addEventListener('click', () => cambiarVista('catalogo'));

  // ========================================================================
  // 10. FORMULARIO DE CONTACTO Y VALIDACIÓN CON REGEX
  // ========================================================================
  formContacto.addEventListener('submit', (e) => {
    e.preventDefault();
    let esValido = true;

    // Validación Nombre
    const grupoNombre = inputNombre.parentElement;
    if (inputNombre.value.trim() === '') {
      grupoNombre.classList.add('invalido');
      esValido = false;
    } else {
      grupoNombre.classList.remove('invalido');
    }

    // Validación Email con Regex
    const grupoEmail = inputEmail.parentElement;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail.value.trim())) {
      grupoEmail.classList.add('invalido');
      esValido = false;
    } else {
      grupoEmail.classList.remove('invalido');
    }

    // Validación Mensaje
    const grupoMensaje = inputMensaje.parentElement;
    if (inputMensaje.value.trim() === '') {
      grupoMensaje.classList.add('invalido');
      esValido = false;
    } else {
      grupoMensaje.classList.remove('invalido');
    }

    if (esValido) {
      // Mostrar retroalimentación estilo terminal
      consolaEstado.style.display = 'block';
      formContacto.reset();

      setTimeout(() => {
        consolaEstado.style.display = 'none';
      }, 5000);
    }
  });

  // ========================================================================
  // 11. DELEGACIÓN GLOBAL DE EVENTOS
  // ========================================================================
  function configurarEventos() {
    // Navegación por data-view
    document.querySelectorAll('[data-view]').forEach(elemento => {
      elemento.addEventListener('click', (e) => {
        e.preventDefault();
        const vista = elemento.getAttribute('data-view');
        cambiarVista(vista);
      });
    });

    document.getElementById('btnExplorarHome').addEventListener('click', () => {
      cambiarVista('catalogo');
    });

    // Menú hamburguesa móvil
    btnHamburguesa.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });

    // Delegación para botones "LEER MAS" y "FAVORITOS" en tarjetas
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-leer-mas')) {
        const id = e.target.getAttribute('data-id');
        abrirDetalle(id);
      }

      if (e.target.classList.contains('btn-toggle-fav')) {
        const id = e.target.getAttribute('data-id');
        toggleFavorito(id);
      }
    });

    // Filtros de categoría en catálogo
    filtrosCategoria.forEach(btn => {
      btn.addEventListener('click', () => {
        filtrosCategoria.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        categoriaActiva = btn.getAttribute('data-cat');
        renderizarCatalogo();
      });
    });
  }

  // Arrancar aplicación
  inicializarApp();
});