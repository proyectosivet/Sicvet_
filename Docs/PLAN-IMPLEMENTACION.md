# Plan de implementación — SICVET

> Documento de trazabilidad del proyecto. Describe qué se construyó, cómo
> está organizado y qué queda pendiente. Se actualiza a medida que avanza el
> desarrollo.

---

## 1. Objetivo

Construir la primera versión funcional de SICVET (sistema de gestión
veterinaria) con:

- Una **API REST simulada** en Node.js/Express con datos **en memoria**
  (sin base de datos).
- Un **frontend React** conectado de verdad al backend mediante **JWT**.
- Autenticación, control de acceso por rol, dashboard y perfil funcionando.
- El resto de módulos (clientes, mascotas, servicios, citas, usuarios)
  disponibles en la API y con pantallas marcadas como "en construcción".

Esta fase prioriza tener un flujo completo y demostrable (login → dashboard →
perfil → logout) antes que la cobertura total de pantallas.

---

## 2. Alcance de esta fase

### Incluido

| Área | Estado |
| --- | --- |
| API de autenticación (login, registro, recuperar, perfil, contraseña) | ✅ Implementado |
| API de usuarios, clientes, mascotas, servicios y citas | ✅ Implementado |
| API de métricas del dashboard | ✅ Implementado |
| Conexión frontend ↔ backend con JWT | ✅ Implementado |
| Rutas protegidas y control de acceso por rol | ✅ Implementado |
| Layout de la aplicación (sidebar, topbar, menú móvil) | ✅ Implementado |
| Dashboard con métricas y próximas citas | ✅ Implementado |
| Perfil (datos personales y cambio de contraseña) | ✅ Implementado |
| Pantallas de login, registro y recuperación | ✅ Implementado |
| Páginas 404 y 403 | ✅ Implementado |
| Pantallas de clientes, mascotas, servicios, citas y usuarios | 🚧 En construcción |
| Pantalla de restablecer contraseña | ⏸️ Fuera de esta fase |

### Fuera de alcance (por ahora)

- Base de datos real (MySQL, PostgreSQL, MongoDB…). Los datos se pierden al
  reiniciar el backend.
- Envío real de correos electrónicos.
- Pantalla de restablecimiento de contraseña con token.
- CRUD completo en la interfaz para clientes, mascotas, servicios, citas y
  usuarios.
- Subida de archivos, notificaciones en tiempo real y reportería avanzada.

---

## 3. Arquitectura general

```
Navegador (React + Vite)
        │  fetch + Bearer token
        ▼
API REST (Express)
        │  arreglos en memoria
        ▼
Backend/src/utils/almacen.js  ←  seeds en Backend/src/data/
```

- **Frontend**: React 19 + Vite + React Router + Bootstrap 5 + Sonner.
- **Backend**: Express 5 + jsonwebtoken + bcryptjs + cors + dotenv.
- **Persistencia**: arreglos JavaScript en memoria, inicializados desde
  `Backend/src/data/`. Cada arranque restaura los datos de ejemplo.
- **Autenticación**: access token JWT (HS256) con expiración de **1 hora**,
  guardado en `localStorage`.

### Flujo de autenticación

1. El usuario envía correo/usuario y contraseña a `POST /api/auth/login`.
2. El backend compara la contraseña con el hash (`bcryptjs`) y devuelve
   `{ token, usuario }`.
3. El frontend guarda ambos en `localStorage` (`sicvet_token`,
   `sicvet_usuario`).
4. Cada petición envía `Authorization: Bearer <token>`.
5. `verificarToken` valida la firma, la expiración y que el usuario siga
   activo en el almacén.
6. Si la API responde `401`, el frontend borra la sesión y redirige al login.
7. Al cumplirse la hora del token, `AuthProvider` cierra la sesión
   automáticamente.

---

## 4. Roles y permisos

Roles definidos (idénticos en backend y frontend):

`administrador`, `recepcionista`, `veterinario`, `peluquero`, `cliente`.

| Recurso | Administrador | Recepcionista | Veterinario | Peluquero | Cliente |
| --- | --- | --- | --- | --- | --- |
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ (solo sus datos) |
| Usuarios | ✅ CRUD | — | — | — | — |
| Clientes | ✅ CRUD | ✅ CRUD | 👁️ Lectura | — | — |
| Mascotas | ✅ CRUD | ✅ CRUD | ✅ CRUD | 👁️ Lectura | 👁️ Solo las suyas |
| Servicios | ✅ CRUD | 👁️ Lectura | 👁️ Lectura | 👁️ Lectura | 👁️ Lectura |
| Citas | ✅ Todo | ✅ Todo | 👁️ Su agenda / estados | 👁️ Su agenda / estados | 👁️ Solo las suyas / crear |
| Perfil propio | ✅ | ✅ | ✅ | ✅ | ✅ |

La autorización real ocurre en el backend. El frontend además oculta opciones
de menú y muestra la página 403 (`RoleGate`) para mejorar la experiencia.

---

## 5. Estructura del backend

```
Backend/
├── .env.example
├── package.json
└── src/
    ├── server.js                 # Arranque, CORS, rutas y manejo de errores
    ├── config/
    │   └── constantes.js         # Roles, estados, JWT, bcrypt
    ├── data/
    │   ├── usuarios.js           # 5 usuarios demo
    │   ├── clientes.js           # 4 clientes
    │   ├── mascotas.js           # 6 mascotas
    │   ├── servicios.js          # 6 servicios
    │   └── citas.js              # 9 citas relativas al día de arranque
    ├── utils/
    │   ├── almacen.js            # "Base de datos" en memoria + contadores
    │   ├── citas.js              # Cruces de horario y filtros
    │   ├── respuestas.js         # responderOk / responderError
    │   └── validaciones.js       # Validaciones reutilizables
    ├── middlewares/
    │   ├── verificarToken.js     # Valida JWT y usuario activo
    │   ├── autorizarRoles.js     # Restringe por rol
    │   ├── noEncontrado.js       # 404 JSON
    │   └── manejarErrores.js     # 500 JSON
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── usuarios.controller.js
    │   ├── clientes.controller.js
    │   ├── mascotas.controller.js
    │   ├── servicios.controller.js
    │   ├── citas.controller.js
    │   └── dashboard.controller.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── usuarios.routes.js
    │   ├── clientes.routes.js
    │   ├── mascotas.routes.js
    │   ├── servicios.routes.js
    │   ├── citas.routes.js
    │   └── dashboard.routes.js
    └── scripts/
        └── smoke.js              # Pruebas integrales de la API
```

### Respuestas uniformes

Éxito:

```json
{ "mensaje": "Descripción", "datos": { } }
```

Error:

```json
{ "mensaje": "Descripción", "detalles": ["opcional"] }
```

### Endpoints

Prefijo general: `/api`.

#### Autenticación (`/api/auth`)

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/login` | Público | Inicia sesión y devuelve token + usuario |
| POST | `/registro` | Público | Crea una cuenta de cliente |
| POST | `/recuperar` | Público | Recuperación simulada (sin envío real) |
| GET | `/perfil` | Autenticado | Devuelve el usuario actual |
| PUT | `/perfil` | Autenticado | Actualiza datos personales |
| PUT | `/password` | Autenticado | Cambia la contraseña |

#### Usuarios (`/api/usuarios`) — solo administrador

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/` | Lista usuarios (con filtros) |
| POST | `/` | Crea usuario del personal |
| PUT | `/:id` | Edita usuario |
| PATCH | `/:id/estado` | Activa/desactiva cuenta |
| DELETE | `/:id` | Baja lógica |

#### Clientes (`/api/clientes`)

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/` | Administrador, recepcionista, veterinario |
| GET | `/:id` | Administrador, recepcionista, veterinario |
| POST | `/` | Administrador, recepcionista |
| PUT | `/:id` | Administrador, recepcionista |
| DELETE | `/:id` | Administrador |

#### Mascotas (`/api/mascotas`)

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/` | Todos (cliente ve solo las suyas) |
| GET | `/:id` | Todos (con validación de propiedad) |
| POST | `/` | Personal y cliente |
| PUT | `/:id` | Personal y dueño |
| DELETE | `/:id` | Administrador, recepcionista, veterinario |

#### Servicios (`/api/servicios`)

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/` | Todos los autenticados |
| POST | `/` | Administrador |
| PUT | `/:id` | Administrador |
| DELETE | `/:id` | Administrador (baja lógica) |

#### Citas (`/api/citas`)

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/` | Personal |
| GET | `/mias` | Cliente |
| GET | `/agenda` | Personal (filtros por profesional/fecha) |
| POST | `/` | Cliente o personal |
| GET | `/:id` | Dueño o personal |
| PUT | `/:id` | Reprogramar (dueño o personal) |
| PATCH | `/:id/estado` | Confirmar/completar/cancelar según rol |
| DELETE | `/:id` | Administrador |

Reglas de negocio de las citas:

- No se permiten cruces de horario para el mismo profesional, fecha y hora
  mientras la cita esté `pendiente` o `confirmada`.
- El cliente solo puede agendar para sus propias mascotas.
- Las citas `completada` y `cancelada` liberan el horario.

#### Dashboard (`/api/dashboard`)

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/resumen?desde=YYYY-MM-DD&hasta=YYYY-MM-DD` | Autenticado | Métricas adaptadas al rol |

Métricas devueltas: citas de hoy, pendientes, confirmadas, completadas del
periodo, ingresos estimados, total de clientes (solo admin/recepción), total de
mascotas y próximas citas.

---

## 6. Estructura del frontend

```
Frontend/
├── .env.example
├── package.json
└── src/
    ├── main.jsx                  # Bootstrap + estilos + montaje
    ├── App.jsx                   # Router + AuthProvider + Toaster
    ├── index.css                 # Ajustes globales y sidebar móvil
    ├── styles/
    │   └── sicvet.css            # Clases del prototipo usadas por React
    ├── lib/
    │   ├── constants.js          # URL de API, claves de storage, evento 401
    │   ├── sesion.js             # Lectura/escritura del JWT y expiración
    │   ├── api.js                # Cliente fetch con token y errores
    │   ├── roles.js              # Roles y etiquetas
    │   ├── navigation.js         # Menú y títulos según rol
    │   ├── validators.js         # Validaciones locales
    │   └── formatters.js         # Fechas, moneda, iniciales
    ├── context/
    │   ├── auth-context.js       # createContext + useAuth
    │   └── AuthContext.jsx       # AuthProvider (login, logout, perfil)
    ├── routes/
    │   ├── router.jsx            # Rutas públicas y privadas
    │   ├── ProtectedRoute.jsx    # Exige sesión
    │   └── RoleGate.jsx          # Exige rol
    ├── layouts/
    │   ├── AppLayout.jsx         # Sidebar + topbar + contenido
    │   └── AuthLayout.jsx        # Fondo y tarjeta de auth
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx
    │   │   └── Topbar.jsx
    │   └── ui/
    │       ├── Spinner.jsx
    │       ├── BadgeEstado.jsx
    │       └── PageHeader.jsx
    └── features/
        ├── auth/
        │   ├── LoginPage.jsx
        │   ├── RegistroPage.jsx
        │   └── RecuperarPage.jsx
        ├── dashboard/
        │   ├── DashboardPage.jsx
        │   ├── dashboard.api.js
        │   └── components/
        │       ├── StatCard.jsx
        │       ├── MetricFilters.jsx
        │       └── RecentAppointmentsTable.jsx
        ├── perfil/
        │   ├── PerfilPage.jsx
        │   ├── perfil.api.js
        │   └── components/
        │       ├── PerfilForm.jsx
        │       └── CambiarPasswordForm.jsx
        ├── common/
        │   └── EnConstruccion.jsx
        └── errors/
            ├── NotFoundPage.jsx
            └── NoAutorizadoPage.jsx
```

### Decisiones de diseño del frontend

- **Una sola fuente de verdad para el menú** (`lib/navigation.js`): el sidebar
  y el título del topbar se generan desde la misma lista filtrada por rol.
- **Contexto separado del hook** (`auth-context.js` + `AuthContext.jsx`) para
  cumplir la regla `react-refresh/only-export-components` de ESLint.
- **Cierre de sesión automático** programado con `setTimeout` según el `exp`
  del JWT.
- **Sesión verificada contra el backend al arrancar**: un token vigente pero de
  un usuario desactivado se descarta.
- **Sin Bootstrap JS**: el menú móvil se controla con estado de React y CSS
  propio, evitando dependencias adicionales.
- **Toasts con Sonner** para confirmar acciones (perfil y contraseña).

---

## 7. Datos de demostración

Credenciales (contraseña entre paréntesis):

| Rol | Correo |
| --- | --- |
| Administrador | `admin@sicvet.com` (`admin123`) |
| Recepcionista | `recepcion@sicvet.com` (`recepcion123`) |
| Veterinario | `veterinario@sicvet.com` (`veterinario123`) |
| Peluquero | `peluquero@sicvet.com` (`peluquero123`) |
| Cliente | `cliente@sicvet.com` (`cliente123`) |

Las citas de ejemplo se generan con fechas relativas al día de arranque para
que el dashboard muestre actividad "de hoy".

---

## 8. Cómo ejecutar el proyecto

### Requisitos

- Node.js 20 o superior.
- npm.

### Backend

```bash
cd Backend
npm install
copy .env.example .env      # Windows
# cp .env.example .env      # Linux/macOS
npm start
```

`Backend/.env` debe definir `JWT_SECRET` con **al menos 32 caracteres**. El
servidor no arranca si falta o es demasiado corto.

API disponible en `http://localhost:3000/api`.

### Frontend

```bash
cd Frontend
npm install
copy .env.example .env      # opcional, ya hay valor por defecto
npm run dev
```

Aplicación disponible en `http://localhost:5173`.

### Pruebas de la API

Con el backend encendido, en otra terminal:

```bash
cd Backend
node src/scripts/smoke.js
```

El script crea datos temporales y verifica autenticación, permisos, CRUD
básico, cruces de horario y dashboard. No requiere configuración adicional.

### Verificación del frontend

```bash
cd Frontend
npm run lint
npm run build
```

---

## 9. Seguridad

- Contraseñas hasheadas con bcrypt (10 rondas); nunca se devuelven en las
  respuestas.
- JWT firmado con HS256 y secreto obligatorio de ≥32 caracteres.
- Algoritmo verificado explícitamente al validar el token.
- El rol y el estado del usuario se leen del almacén en cada petición, no solo
  del token.
- Los clientes solo acceden a sus propios datos (mascotas y citas).
- Límite de 100 KB en el cuerpo JSON.
- CORS restringido a los orígenes configurados en `FRONTEND_URL`.
- Validación doble: frontend para feedback inmediato, backend como autoridad.

> Nota: al ser un proyecto académico con datos en memoria, no se implementan
> refresh tokens, revocación distribuida ni rate limiting. Son mejoras para una
> fase con base de datos real.

---

## 10. Limpieza realizada

- Se eliminaron **74 archivos vacíos** del frontend que solo definían una
  estructura futura (features de clientes, citas, mascotas, servicios,
  usuarios, hooks y componentes UI sin usar).
- Se eliminó `App.css` (CSS de la plantilla Vite, no importado) y
  `styles/theme.css` (vacío).
- Se eliminó `PaginaLogin.jsx` (versión anterior sin conexión al backend, reemplazada por `LoginPage.jsx`).
- Se eliminaron `schemas.js` y `data.js` sin uso.
- Se conservó `styles/sicvet.css` únicamente con las clases del prototipo que
  la aplicación React realmente utiliza.
- Se eliminaron constantes y utilidades del backend sin referencias
  (`ROLES_VALIDOS`, `LIMITE_LISTADO`, `compararFechas`, `tieneRol`).

---

## 11. Pendientes para la siguiente fase

1. Implementar las pantallas de **clientes**, **mascotas**, **servicios**,
   **citas** (agenda, historial, nueva cita) y **usuarios**.
2. Añadir la pantalla de **restablecer contraseña** con token de un solo uso.
3. Reemplazar el almacén en memoria por una base de datos real.
4. Envío real de correos (recuperación y notificaciones).
5. Pruebas automatizadas de interfaz (Playwright/Cypress) y unitarias.
6. Paginación y búsqueda del lado del servidor para listados grandes.

---

## 12. Historial de verificación

| Fecha | Verificación | Resultado |
| --- | --- | --- |
| Fase actual | Smoke test del backend | 20/20 correctas |
| Fase actual | `npm run lint` (frontend) | Sin errores |
| Fase actual | `npm run build` (frontend) | Compilación correcta |
| Fase actual | Prueba E2E con Chrome headless | Login, dashboard por rol, perfil y logout correctos |
