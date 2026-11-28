// ============================================================
// ROLES DEL SISTEMA
// ============================================================
// Deben coincidir exactamente con los roles del backend
// (Backend/src/config/constantes.js).

export const ROLES = Object.freeze({
  ADMINISTRADOR: 'administrador',
  RECEPCIONISTA: 'recepcionista',
  VETERINARIO: 'veterinario',
  PELUQUERO: 'peluquero',
  CLIENTE: 'cliente',
})

// Todos los roles en un arreglo, útil para rutas accesibles por
// cualquier usuario autenticado.
export const ROLES_TODOS = Object.freeze(Object.values(ROLES))

// Personal de la clínica (todo menos cliente).
export const ROLES_PERSONAL = Object.freeze([
  ROLES.ADMINISTRADOR,
  ROLES.RECEPCIONISTA,
  ROLES.VETERINARIO,
  ROLES.PELUQUERO,
])

// Etiquetas legibles para mostrar en la interfaz.
const ETIQUETAS = {
  [ROLES.ADMINISTRADOR]: 'Administrador',
  [ROLES.RECEPCIONISTA]: 'Recepcionista',
  [ROLES.VETERINARIO]: 'Veterinario',
  [ROLES.PELUQUERO]: 'Peluquero',
  [ROLES.CLIENTE]: 'Cliente',
}

// Devuelve la etiqueta del rol o el valor original si no existe.
export function etiquetaRol(rol) {
  return ETIQUETAS[rol] || rol || 'Sin rol'
}
