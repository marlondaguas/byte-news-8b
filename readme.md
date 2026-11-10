# 📰 Byte News 8b - Plataforma de Noticias (Docker & CI)

Proyecto académico para el módulo **Énfasis Profesional I (Integración Continua)** del **Politécnico Grancolombiano**.

Esta aplicación consiste en una plataforma web de noticias con estética 8-bit desacoplada en dos contenedores Docker independientes, orquestados mediante **Docker Compose** y validados con un pipeline de Integración Continua en **GitHub Actions**.

---

## 🏗️ Arquitectura de la Solución

El proyecto utiliza una arquitectura cliente/servidor aislada en dos contenedores dentro de una red interna bridge (`byte_news_net`):

1. **Servidor Web / Frontend (`byte_news_web`):**
   * **Imagen Base:** `nginx:1.27-alpine`
   * **Puerto Expuesto:** `8080` (host) -> `80` (contenedor)
   * **Rol:** Sirve la interfaz gráfica en HTML/CSS/JS y actúa como Proxy Inverso redirigiendo las llamadas `/api/` hacia el contenedor de la API.

2. **API REST / Backend (`byte_news_api`):**
   * **Imagen Base:** `node:20.18-alpine`
   * **Puerto Interno:** `3000`
   * **Rol:** Procesa las noticias enviadas y las persiste en el archivo `/app/data/noticias.json`.

3. **Persistencia (Volumen Docker):**
   * **Volumen:** `byte_news_data` montado en `/app/data` para garantizar la conservación de la información al reiniciar los contenedores.

4. **Comunicación en Red Interna:**
   * La comunicación entre servicios se realiza utilizando la resolución DNS interna de Docker a través de la URL `http://api:3000`, evitando el uso de `localhost` o direcciones IP fijas.

---

## 🚀 Requisitos Previos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.
* [Git](https://git-scm.com/) para clonar el repositorio.

---

## 🛠️ Instrucciones de Despliegue Local

### 1. Clonar el repositorio
git clone https://github.com/marlondaguas/byte-news-8b.git
cd byte-news-8b

### 2. Configurar variables de entorno
Crea una copia del archivo .env.example:
cp .env.example .env

### 3. Construir las imágenes Docker
docker compose build

### 4. Levantar los contenedores en segundo plano
docker compose up -d

### 5. Acceder a la aplicación
Abre tu navegador e ingresa a:
👉 http://localhost:8080

---

## 🔍 Comandos Útiles de Verificación

* **Verificar contenedores activos:**
  docker ps

* **Inspeccionar la red interna de Docker:**
  docker network inspect byte-news-8b_byte_news_net

* **Revisar logs de la API Backend:**
  docker compose logs api

* **Verificar noticias guardadas dentro del volumen:**
  docker compose exec api cat /app/data/noticias.json

* **Detener y apagar los contenedores:**
  docker compose down

---

## ⚙️ Integración Continua (CI)

El proyecto cuenta con un workflow de **GitHub Actions** en `.github/workflows/ci.yml` que valida automáticamente en cada `push` o `pull_request` a la rama principal:
* La correcta sintaxis de `docker-compose.yml`.
* La compilación limpia de las imágenes Docker sin errores de dependencias.

---

## ✒️ Autor
* **Marlon de Aguas** - Politécnico Grancolombiano (2026)