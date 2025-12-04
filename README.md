# Onboarding App Backend

API REST para la gestión de programas de onboarding de empleados del Banco de Bogotá.

## Descripción

Este backend proporciona servicios para:
- Autenticación y autorización de usuarios con JWT
- Gestión de usuarios y roles
- Creación y administración de programas de onboarding
- Asignación de usuarios a programas de onboarding
- Notificaciones automáticas por correo electrónico mediante SendGrid

## Tecnologías

- **Node.js** con **TypeScript**
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **SendGrid** - Servicio de correo electrónico
- **Jest** - Testing

## Estructura del Proyecto

```
├── src/
│   ├── auth/              # Módulo de autenticación
│   ├── users/             # Gestión de usuarios
│   ├── onboardings/       # Gestión de onboardings
│   ├── userOnboardings/   # Asignaciones usuario-onboarding
│   └── shared/            # Servicios compartidos (JWT, email, DB)
├── controllers/           # Controladores de rutas
├── __tests__/            # Pruebas unitarias
├── database/
│   ├── ddl/              # Scripts de creación de base de datos
│   └── dml/              # Datos iniciales
└── openapi.yaml          # Documentación de la API
```

## Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- Cuenta de SendGrid (para envío de emails)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd onboarding-app-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:

```env
# PostgreSQL
USER=tu_usuario_postgres
HOST=localhost
DATABASE=onboarding_db
PASSWORD=tu_password
PORT=5432

# JWT Secrets
JWT_SECRET=tu_secret_key_super_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro

# SendGrid
SENDGRID_API_KEY=tu_api_key_de_sendgrid
```

### 4. Configurar la base de datos

Ejecutar los scripts SQL en orden:

```bash
# 1. Crear la estructura de la base de datos
psql -U tu_usuario -d postgres -f database/ddl/database\ creation.sql

# 2. Insertar datos iniciales (roles y tipos de onboarding)
psql -U tu_usuario -d onboarding_db -f database/dml/role\ and\ onboarding.sql
```

### 5. Compilar el proyecto

```bash
npm run build
```

### 6. Iniciar el servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3030`

## Testing

Ejecutar las pruebas unitarias:

```bash
npm test
```

Ejecutar pruebas con cobertura:

```bash
npm run test:coverage
```

## Documentación de la API

La documentación completa de la API está disponible en el archivo `openapi.yaml`.

### Endpoints principales

#### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Refrescar token

#### Usuarios
- `POST /users/create` - Crear usuario
- `GET /users/getAll` - Listar usuarios
- `PUT /users/update/:id` - Actualizar usuario
- `DELETE /users/delete/:id` - Eliminar usuario

#### Onboardings
- `POST /onboardings/create` - Crear onboarding
- `GET /onboardings/getAll` - Listar onboardings
- `PUT /onboardings/update/:id` - Actualizar onboarding
- `DELETE /onboardings/delete/:id` - Eliminar onboarding

#### Asignaciones
- `POST /userOnboardings/assign` - Asignar usuario a onboarding
- `GET /userOnboardings/getAll` - Listar asignaciones
- `PUT /userOnboardings/update/:id` - Actualizar estado por ID
- `PUT /userOnboardings/update/:user_id/:onboarding_id` - Actualizar estado por usuario y onboarding
- `DELETE /userOnboardings/unassign/:id` - Desasignar por ID
- `DELETE /userOnboardings/unassign/:user_id/:onboarding_id` - Desasignar por usuario y onboarding

### Autenticación

La mayoría de endpoints requieren autenticación mediante JWT. Incluir el token en el header:

```
Authorization: Bearer <tu_access_token>
```

## Notificaciones por Email

El sistema envía notificaciones automáticas en los siguientes casos:

- Asignación de usuario a un onboarding
- Actualización de un onboarding (notifica a todos los usuarios asignados)
- Eliminación de un onboarding (notifica a todos los usuarios asignados)
- Actualización del estado de una asignación
- Eliminación de una asignación

## Roles de Usuario

- **Admin** (role_id: 1) - Acceso completo al sistema
- **Usuario** (role_id: 2) - Acceso limitado

## Scripts Disponibles

```json
{
  "dev": "Inicia el servidor en modo desarrollo",
  "build": "Compila TypeScript a JavaScript",
  "start": "Inicia el servidor en producción",
  "test": "Ejecuta las pruebas unitarias",
  "test:coverage": "Ejecuta pruebas con reporte de cobertura"
}
```
