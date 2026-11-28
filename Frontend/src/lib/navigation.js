// ============================================================
// MENÚ Y TÍTULOS SEGÚN EL TIPO DE USUARIO
// ============================================================
// Aquí decidimos qué botones ve cada persona en el menú de la
// izquierda, a qué pantalla entra apenas inicia sesión y qué
// título sale arriba en la barra blanca.

import { ROLES } from './roles'

// Lista de opciones del menú para cada tipo de usuario.
const MENU_POR_ROL = {
  [ROLES.ADMINISTRADOR]: [
    { ruta: '/dashboard', etiqueta: 'Dashboard', icono: 'bi-house' },
    { ruta: '/agenda', etiqueta: 'Agenda', icono: 'bi-calendar-week' },
    { ruta: '/clientes', etiqueta: 'Clientes y Mascotas', icono: 'bi-people' },
    { ruta: '/usuarios', etiqueta: 'Usuarios y Roles', icono: 'bi-shield-check' },
    { ruta: '/citas/nueva', etiqueta: 'Nueva Cita', icono: 'bi-plus-circle' },
    { ruta: '/citas', etiqueta: 'Historial de Citas', icono: 'bi-file-earmark-text' },
  ],
  [ROLES.RECEPCIONISTA]: [
    { ruta: '/dashboard', etiqueta: 'Dashboard', icono: 'bi-house-door' },
    { ruta: '/agenda', etiqueta: 'Agenda', icono: 'bi-calendar-event' },
    { ruta: '/clientes', etiqueta: 'Clientes y Mascotas', icono: 'bi-people' },
    { ruta: '/citas/nueva', etiqueta: 'Nueva Cita', icono: 'bi-plus-lg' },
    { ruta: '/citas', etiqueta: 'Historial de Citas', icono: 'bi-clock-history' },
  ],
  [ROLES.VETERINARIO]: [
    { ruta: '/agenda', etiqueta: 'Agenda', icono: 'bi-calendar-event' },
  ],
  [ROLES.PELUQUERO]: [
    { ruta: '/agenda', etiqueta: 'Agenda', icono: 'bi-calendar-event' },
  ],
  [ROLES.CLIENTE]: [
    { ruta: '/servicios', etiqueta: 'Servicios', icono: 'bi-heart-pulse' },
    { ruta: '/mascotas', etiqueta: 'Mis Mascotas', icono: 'bi-heart' },
    { ruta: '/citas', etiqueta: 'Mis Citas', icono: 'bi-calendar-event' },
  ],
}

// A dónde mandamos al usuario apenas entra con su cuenta.
export function rutaInicioPorRol(rol) {
  if (rol === ROLES.CLIENTE) return '/servicios'
  if (rol === ROLES.VETERINARIO || rol === ROLES.PELUQUERO) return '/agenda'
  return '/dashboard'
}

// Busca las opciones del menú que le tocan al usuario. Si no tiene
// un rol conocido, le mostramos el menú básico de cliente.
export function obtenerMenu(rol) {
  return MENU_POR_ROL[rol] || MENU_POR_ROL[ROLES.CLIENTE]
}

// Dice qué título mostrar arriba a la izquierda según la pantalla abierta.
export function obtenerTituloRuta(pathname, rol) {
  if (pathname === '/perfil') return 'Mi Perfil'
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/agenda') return 'Gestión de Agenda'
  if (pathname === '/clientes') return 'Clientes y Mascotas'
  if (pathname === '/usuarios') return 'Usuarios y Roles'
  if (pathname === '/servicios') return 'Nuestros Servicios'
  if (pathname === '/mascotas') return 'Mis Mascotas'
  if (pathname === '/citas/nueva') return 'Nueva Cita'
  if (pathname === '/citas') {
    return rol === ROLES.CLIENTE ? 'Mis Citas' : 'Historial de Citas'
  }
  return 'SICVET'
}
