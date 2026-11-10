const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const FILE_PATH = path.join(DATA_DIR, 'noticias.json');

app.use(express.json());

// Inicializa directorio y archivo si no existen
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

function leerNoticias() {
  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(data || '[]');
}

function guardarNoticias(noticias) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(noticias, null, 2));
}

// GET: Obtener noticias
app.get('/api/noticias', (req, res) => {
  try {
    const noticias = leerNoticias();
    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer las noticias' });
  }
});

// POST: Crear noticia
app.post('/api/noticias', (req, res) => {
  try {
    const { titulo, categoria, descripcionCorta, contenido, imagen, autor } = req.body;
    if (!titulo || !contenido) {
      return res.status(400).json({ error: 'Título y contenido requeridos' });
    }

    const noticias = leerNoticias();
    const nuevaNoticia = {
      id: Date.now(),
      titulo,
      categoria: categoria || 'General',
      descripcionCorta: descripcionCorta || '',
      contenido,
      imagen: imagen || '',
      fecha: new Date().toLocaleDateString('es-CO'),
      autor: autor || 'Marlon de Aguas'
    };

    noticias.unshift(nuevaNoticia);
    guardarNoticias(noticias);
    console.log(`[API Byte News] Noticia guardada: "${titulo}"`);
    res.status(201).json(nuevaNoticia);
  } catch (error) {
    res.status(500).json({ error: 'Error al persistir noticia' });
  }
});

// DELETE: Eliminar noticia
app.delete('/api/noticias/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    let noticias = leerNoticias();
    noticias = noticias.filter(n => n.id !== id);
    guardarNoticias(noticias);
    console.log(`[API Byte News] Noticia eliminada ID: ${id}`);
    res.status(200).json({ mensaje: 'Noticia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la noticia' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Byte News API escuchando en el puerto ${PORT}`);
});