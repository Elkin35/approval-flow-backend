# Sistema de Flujo de Aprobaciones - Backend

Este repositorio contiene el backend para el Sistema de Flujo de Aprobaciones, desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**. Proporciona una API RESTful para gestionar usuarios, tipos de solicitud, solicitudes de aprobación y su historial.

## ✨ Características Principales

-   **Gestión de Usuarios y Roles:** Creación y listado de usuarios con roles (Administrador, Usuario).
-   **Autenticación JWT:** Sistema de login seguro basado en JSON Web Tokens.
-   **CRUD de Solicitudes:** Creación, lectura y actualización del estado de solicitudes genéricas.
-   **Historial de Cambios:** Trazabilidad completa de cada acción realizada sobre una solicitud.
-   **Notificaciones por Email:** Envío de notificaciones por correo electrónico (usando SendGrid) al asignarse una nueva solicitud.
-   **Base de Datos Relacional:** Persistencia de datos gestionada con TypeORM sobre PostgreSQL.
-   **Seeding de Datos:** Inicialización automática de roles, estados, tipos y usuarios de prueba.

---

## 🛠️ Tecnologías Utilizadas

-   **Framework:** [NestJS](https://nestjs.com/)
-   **ORM:** [TypeORM](https://typeorm.io/)
-   **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
-   **Autenticación:** [Passport.js](http://www.passportjs.org/) (Estrategias JWT y Local)
-   **Validación:** `class-validator` y `class-transformer`
-   **Notificaciones:** `@nestjs-modules/mailer` (con Nodemailer)
-   **Contenerización:** [Docker](https://www.docker.com/)

---

## 🚀 Puesta en Marcha (Desarrollo Local)

### Prerrequisitos

-   Node.js (v18 o superior)
-   npm o yarn
-   Una instancia de PostgreSQL corriendo (localmente o en Docker)
-   Git

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO_BACKEND>
cd approval_flow_backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto a partir del archivo de ejemplo `.env.example` (si existe) o créalo desde cero con el siguiente contenido:

```env
# --- Base de Datos ---
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_postgres
DB_DATABASE=approval_flow_db
DB_SCHEMA=flujo_aprobacion

# --- Autenticación JWT ---
JWT_SECRET=UNA_CLAVE_SECRETA_MUY_LARGA_Y_SEGURA
JWT_EXPIRATION_TIME=3600s

# --- Notificaciones por Email (Ej: SendGrid) ---
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASS=TU_API_KEY_DE_SENDGRID
MAIL_FROM='"Sistema de Aprobaciones" <tu_email_verificado@ejemplo.com>'
```

**Nota:** Asegúrate de crear la base de datos `approval_flow_db` en tu instancia de PostgreSQL.

### 4. Iniciar la Aplicación

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3001`. El seeding inicial creará los datos necesarios para empezar a probar.

---

## 🐳 Despliegue con Docker

Este proyecto está preparado para ser desplegado con Docker.

### 1. Construir la Imagen

Desde la raíz del proyecto, ejecuta:

```bash
docker build -t approval-flow-backend -f Dockerfile.backend .
```

### 2. Ejecutar el Contenedor

Puedes ejecutar el contenedor pasando las variables de entorno:

```bash
docker run -p 3001:3001 \
  --name approval-flow-backend \
  -e DB_HOST=... \
  -e DB_PORT=... \
  # ... (y el resto de las variables de entorno)
  approval-flow-backend
```

Para un despliegue completo junto con el frontend, consulta el archivo `docker-compose.yml` en el despliegue de producción.

---

## 📝 Endpoints de la API (Resumen)

-   `POST /auth/login`: Autenticación de usuarios.
-   `GET /auth/profile`: Obtener perfil del usuario autenticado.
-   `GET /users`: Listar todos los usuarios.
-   `POST /users`: Crear un nuevo usuario (requiere rol de Admin).
-   `POST /solicitudes`: Crear una nueva solicitud de aprobación.
-   `GET /solicitudes/inbox`: Obtener solicitudes pendientes de aprobación para el usuario actual.
-   `GET /solicitudes/outbox`: Obtener solicitudes creadas por el usuario actual.
-   `GET /solicitudes/assigned-to-me`: Historial de solicitudes asignadas al usuario actual.
-   `GET /solicitudes/:id`: Ver detalles de una solicitud específica.
-   `PATCH /solicitudes/:id/estado`: Aprobar o rechazar una solicitud.
-   `GET /historial`: Obtener el historial completo de acciones.
-   `GET /tipos-solicitud`: Listar los tipos de solicitud disponibles.
-   `POST /tipos-solicitud`: Crear un nuevo tipo de solicitud.