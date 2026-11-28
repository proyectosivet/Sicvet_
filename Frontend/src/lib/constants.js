// ============================================================
// CONSTANTES DEL FRONTEND
// ============================================================
// Valores compartidos por varias capas de la aplicación.

// Nombre visible del sistema.
export const NOMBRE_APP = 'SICVET'

// Claves usadas en localStorage. Centralizarlas evita errores por
// escribir "sicvet_token" en un archivo y "token" en otro.
export const STORAGE_TOKEN = 'sicvet_token'
export const STORAGE_USUARIO = 'sicvet_usuario'

// Evento que se dispara cuando la API responde 401. AuthProvider lo
// escucha para cerrar la sesión y ProtectedRoute redirige al login.
export const EVENTO_SESION_EXPIRADA = 'sicvet:sesion-expirada'

// URL base de la API. Se puede cambiar con Frontend/.env:
//   VITE_API_URL=http://localhost:3000/api
// Si no existe, se usa el backend local por defecto.
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
