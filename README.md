# SICVET — Sistema de Gestión Veterinaria

Proyecto académico con **frontend React** y **backend Node.js/Express**. La API
funciona con **datos en memoria** (sin base de datos): al reiniciar el servidor,
los datos vuelven a los valores de ejemplo.

El plan detallado, la arquitectura y los pendientes están en
[`Docs/PLAN-IMPLEMENTACION.md`](Docs/PLAN-IMPLEMENTACION.md).

---

## Requisitos

- Node.js 20 o superior
- npm

---

## 1. Levantar el backend

```bash
cd Backend
npm install
copy .env.example .env      # Windows
# cp .env.example .env      # Linux/macOS
npm start
```

Edita `Backend/.env` y define un `JWT_SECRET` de **al menos 32 caracteres**. El
servidor no arranca sin él.

- API: `http://localhost:3000/api`
- Salud: `http://localhost:3000/api/health`

## 2. Levantar el frontend

En otra terminal:

```bash
cd Frontend
npm install
copy .env.example .env      # opcional; hay valor por defecto
npm run dev
```

- Aplicación: `http://localhost:5173`

---

## Credenciales de demostración

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@sicvet.com` | `admin123` |
| Recepcionista | `recepcion@sicvet.com` | `recepcion123` |
| Veterinario | `veterinario@sicvet.com` | `veterinario123` |
| Peluquero | `peluquero@sicvet.com` | `peluquero123` |
| Cliente | `cliente@sicvet.com` | `cliente123` |

También puedes crear una cuenta de cliente desde `/registro`.

---

## Qué está implementado

- Inicio de sesión, registro y recuperación simulada de contraseña.
- Sesión con JWT (1 hora) guardada en `localStorage` y cierre automático.
- Rutas protegidas y control de acceso por rol.
- Layout con sidebar, topbar y menú móvil.
- Dashboard con métricas adaptadas al rol y próximas citas.
- Perfil: datos personales y cambio de contraseña.
- API completa de usuarios, clientes, mascotas, servicios, citas y dashboard.
- Pantallas de clientes, mascotas, servicios, citas y usuarios marcadas como
  **"en construcción"** (la API ya está lista).

---

## Verificaciones

Backend (con el servidor encendido):

```bash
cd Backend
node src/scripts/smoke.js
```

Frontend:

```bash
cd Frontend
npm run lint
npm run build
```

---

## Estructura

```
Backend/    API REST (Express + JWT + bcryptjs + datos en memoria)
Frontend/   React + Vite + React Router + Bootstrap 5 + Sonner
Docs/       Contexto del proyecto, prototipo HTML y plan de implementación
```

> **Nota:** los datos no persisten entre reinicios. Esta versión prioriza el
> flujo completo de autenticación y la conexión frontend-backend; la base de
> datos real queda para una siguiente fase.
