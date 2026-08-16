# Sistema de Vacunación

Aplicación frontend desarrollada en Angular para gestionar procesos de vacunación, usuarios y reportes del sistema sanitario.

## Descripción general

Este proyecto permite a distintos roles interactuar con una plataforma de vacunación:

- Ciudadanos: consultar carnet, vacunas aplicadas, vacunas pendientes y recordatorios.
- Personal de salud: gestionar ciudadanos, registrar vacunaciones, consultar historial clínico e inventario.
- Administradores: administrar personal de salud, auditar operaciones y gestionar vacunas.

La aplicación consume una API REST del backend y gestiona autenticación basada en JWT, rutas protegidas por guardias y autorización por roles.

## Stack tecnológico

- Angular 22
- TypeScript
- RxJS
- Angular Router
- Angular HttpClient
- Signals de Angular
- CSS personalizado

## Requisitos previos

Antes de ejecutar el proyecto, asegurate de tener instalado:

- Node.js 20 o superior
- npm 10 o superior

## Instalación

1. Cloná el repositorio:

```bash
git clone <url-del-repositorio>
cd sistema_de_vacunacion
```

2. Instalá las dependencias:

```bash
npm install
```

## Configuración del entorno

La URL del backend se define en:

- `src/environments/environment.ts`

Ajustá la propiedad `apiUrl` si tu backend corre en otra dirección o puerto:

```ts
export const API_BASE_URL = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

## Ejecutar en desarrollo

```bash
npm start
```

O directamente:

```bash
ng serve
```

Luego abrí en el navegador:

```text
http://localhost:4200
```

## Scripts disponibles

```bash
npm start
```
Inicia el servidor de desarrollo.

```bash
npm run build
```
Genera la versión compilada para producción en la carpeta `dist/`.

```bash
npm test
```
Ejecuta las pruebas unitarias de la aplicación.

## Estructura del proyecto

```text
src/
├── app/
│   ├── core/
│   │   ├── guards/               # Guards de autenticación y roles
│   │   ├── interceptors/         # Interceptor para JWT
│   │   ├── models/               # Modelos de negocio
│   │   └── services/             # Servicios HTTP del sistema
│   ├── feature/
│   │   ├── administrador/        # Módulo administrativo
│   │   ├── auth/                 # Login ciudadano y staff
│   │   ├── ciudadano/            # Panel ciudadano
│   │   ├── personal_salud/      # Panel personal de salud
│   │   └── public/               # Landing page y páginas públicas
│   ├── shared/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── models/               # Modelos compartidos
│   │   └── utils/                # Utilidades generales
│   ├── app.config.ts             # Configuración global de Angular
│   ├── app.routes.ts             # Definición de rutas principales
│   ├── app.css                   # Estilos globales
│   ├── app.html                  # Plantilla principal
│   └── app.ts                    # Componente raíz
├── environments/
│   └── environment.ts            # Configuración de API
├── styles.css                    # Estilos base
└── index.html                    # HTML principal
```

## Autenticación y autorización

La autenticación se maneja con JWT y almacenamiento local:

- El login se hace contra la API de autenticación.
- El token se guarda en `localStorage`.
- El interceptor de HTTP agrega el header `Authorization: Bearer <token>` a las peticiones protegidas.
- Los guards bloquean accesos según el rol del usuario autenticado.

La ruta de login queda excluida del interceptor para evitar enviar el token en la autenticación inicial.

## Roles del sistema

### Ciudadano
- Consulta su carnet de vacunación.
- Revisa vacunas pendientes y aplicadas.
- Visualiza recordatorios.

### Personal de salud
- Gestiona ciudadanos.
- Registra vacunaciones.
- Consulta historial clínico.
- Revisa inventario y reportes.

### Administrador
- Administra personal de salud.
- Gestiona vacunas y esquemas.
- Consulta auditorías globales.

## Convenciones de desarrollo

- Mantener la API centralizada en `src/environments/environment.ts`.
- Usar servicios en `src/app/core/services` para la comunicación HTTP.
- No duplicar URLs en distintos componentes.
- Respetar roles y guards para cada módulo.
- Mantener componentes funcionales y reutilizables en `src/app/shared`.

## Mejores prácticas

- Ejecutar siempre la aplicación con el backend levantado y accesible.
- Revisar la configuración de CORS y la URL base del backend.
- Verificar que el token JWT sea válido antes de probar endpoints protegidos.
- Mantener los nombres de endpoints alineados con la API del backend.

## Licencia

Este proyecto se distribuye bajo la licencia que corresponda al equipo o al repositorio en el que se aloja. Si no existe una licencia definida, conviene agregar una antes de compartirlo públicamente.

## Contacto

Si necesitás colaborar o conocer más detalles del proyecto, podés contactarte con el responsable del desarrollo o revisar la documentación interna del equipo.

---

Este README está pensado para servir como punto de entrada del proyecto y facilitar la instalación, configuración y comprensión de la arquitectura frontend.
