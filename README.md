# 📧 Send Emails NestJS

Sistema de envío de correos electrónicos desarrollado con NestJS, Bull (colas de trabajos), Redis y Nodemailer. Incluye procesamiento asíncrono de emails, validación de contenido HTML, tareas programadas con Cron y reintentos automáticos.

## 📋 Características

- ✉️ **Envío asíncrono de emails** usando Bull Queues y Redis
- 🔒 **Sanitización de HTML** para prevenir inyección de código malicioso
- 🔄 **Reintentos automáticos** con estrategia exponencial (3 intentos)
- ⏰ **Cron Jobs** para envío programado de correos
- ✅ **Validación de DTOs** con class-validator
- 🛡️ **Configuración segura** con variables de entorno y validación con Zod
- 🎨 **Plantillas HTML** personalizables para emails

## 🚀 Tecnologías

- [NestJS](https://nestjs.com/) - Framework de Node.js
- [Bull](https://github.com/OptimalBits/bull) - Sistema de colas basado en Redis
- [Redis](https://redis.io/) - Base de datos en memoria para colas
- [Nodemailer](https://nodemailer.com/) - Envío de emails
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje de programación
- [Zod](https://zod.dev/) - Validación de esquemas
- [pnpm](https://pnpm.io/) - Gestor de paquetes

## 📦 Requisitos Previos

- Node.js >= 20.x
- pnpm >= 8.x
- Docker y Docker Compose (para Redis)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/rody-huancas/send-emails-nestjs
cd send-emails-nestjs
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
PORT=3000

# Configuración de Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Configuración SMTP (ejemplo con Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
EMAIL_FROM=tu-email@gmail.com
EMAIL_TO=destinatario@ejemplo.com
```

> **Nota para Gmail:** Debes generar una [contraseña de aplicación](https://support.google.com/accounts/answer/185833) para usar en `SMTP_PASS`.

### 4. Iniciar Redis con Docker

```bash
docker run -d --name redis-emails -p 6379:6379 redis:alpine
```

O usando Docker Compose, crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:alpine
    container_name: redis-emails
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

Luego ejecuta:

```bash
docker-compose up -d
```

## ▶️ Ejecución

### Modo desarrollo

```bash
pnpm run start:dev
```

### Modo producción

```bash
# Compilar el proyecto
pnpm run build

# Ejecutar en producción
pnpm run start:prod
```

## 📚 Uso de la API

### Endpoint: Enviar Email

**POST** `/api/email/send`

**Request Body:**

```json
{
  "emailOptions": {
    "from": "remitente@ejemplo.com",
    "to": "destinatario@ejemplo.com",
    "subject": "Asunto del correo",
    "html": "<h1>Hola</h1><p>Este es un correo de prueba</p>"
  },
  "smtpConfig": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "auth": {
      "user": "tu-email@gmail.com",
      "pass": "tu-contraseña"
    }
  }
}
```

**Response:**

```json
{
  "message": "Correo enviado correctamente."
}
```

### Ejemplo con cURL

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "emailOptions": {
      "from": "test@ejemplo.com",
      "to": "destinatario@ejemplo.com",
      "subject": "Test Email",
      "html": "<h1>Hola mundo</h1>"
    },
    "smtpConfig": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "tu-email@gmail.com",
        "pass": "tu-contraseña"
      }
    }
  }'
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── app.module.ts                 # Módulo principal
├── main.ts                       # Punto de entrada de la aplicación
├── common/
│   └── dtos/
│       ├── send-email.dto.ts    # DTOs para validación de emails
│       └── index.ts
├── config/
│   ├── envs.ts                  # Configuración y validación de variables de entorno
│   ├── nodemailer.ts            # Configuración de Nodemailer
│   └── index.ts
└── modules/
    ├── cron/
    │   ├── cron.module.ts       # Módulo de tareas programadas
    │   └── cron.service.ts      # Servicio con Cron Jobs
    └── email/
        ├── email.controller.ts   # Controlador de endpoints
        ├── email.module.ts       # Módulo de emails con Bull Queue
        ├── email.processor.ts    # Procesador de cola de emails
        └── email.service.ts      # Servicio de lógica de negocio
```

## 🔒 Seguridad

- **Sanitización HTML:** El contenido HTML de los emails es sanitizado usando `sanitize-html` para prevenir inyección de código malicioso
- **Validación de entrada:** Todos los datos son validados con `class-validator` y DTOs
- **Variables de entorno:** Configuración sensible mediante variables de entorno validadas con Zod
- **Reintentos controlados:** Sistema de reintentos con backoff exponencial para evitar saturación

## ⏰ Tareas Programadas (Cron)

El proyecto incluye un servicio Cron que envía emails automáticamente cada minuto (configurable):

```typescript
@Cron(CronExpression.EVERY_MINUTE, {
  name: 'text-email',
})
```

Puedes modificar la expresión cron en `src/modules/cron/cron.service.ts` según tus necesidades.

## 🧪 Testing

```bash
# Tests unitarios
pnpm run test

# Tests e2e
pnpm run test:e2e

# Cobertura de tests
pnpm run test:cov
```

## 📝 Scripts Disponibles

```bash
pnpm run start          # Iniciar en modo normal
pnpm run start:dev      # Iniciar en modo desarrollo (watch)
pnpm run start:debug    # Iniciar en modo debug
pnpm run start:prod     # Iniciar en modo producción
pnpm run build          # Compilar el proyecto
pnpm run lint           # Ejecutar ESLint
pnpm run format         # Formatear código con Prettier
```

## 🐳 Docker

### Detener Redis

```bash
docker stop redis-emails
```

### Eliminar contenedor Redis

```bash
docker rm redis-emails
```

### Ver logs de Redis

```bash
docker logs redis-emails
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Autor

**Rody Huancas**

- GitHub: [@rody-huancas](https://github.com/rody-huancas)

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/) - Por el increíble framework
- [Bull](https://github.com/OptimalBits/bull) - Por el sistema de colas
- Comunidad de código abierto
