// ============================================================
// MANEJO DE LA SESIÓN EN EL NAVEGADOR
// ============================================================
// Guarda el token JWT y el usuario en localStorage, y ofrece
// utilidades para leerlos, validarlos y borrarlos.

import { STORAGE_TOKEN, STORAGE_USUARIO } from './constants'

// ------------------------------------------------------------
// Decodifica la parte central de un JWT.
// ------------------------------------------------------------
// Un JWT tiene tres partes separadas por puntos:
//   cabecera.payload.firma
// Solo leemos el payload para conocer la expiración. NO validamos
// la firma aquí: eso lo hace el backend. El frontend solo usa esta
// información para no mostrar pantallas con un token ya vencido.
function decodificarPayload(token) {
  try {
    const segmento = token.split('.')[1]

    if (!segmento) return null

    // JWT usa base64url (- y _) en lugar de base64 normal (+ y /).
    const base64 = segmento.replace(/-/g, '+').replace(/_/g, '/')

    // Agregamos el relleno "=" que base64url omite.
    const relleno = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    )

    // atob devuelve texto binario; TextDecoder lo interpreta como
    // UTF-8 para que los acentos se vean correctamente.
    const binario = atob(relleno)
    const bytes = Uint8Array.from(binario, (caracter) =>
      caracter.charCodeAt(0),
    )

    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    // Si el token está mal formado, lo tratamos como inválido.
    return null
  }
}

// Comprueba que el token exista y que no esté vencido.
// Se añade un margen de 5 segundos para evitar carreras con el reloj.
export function tokenVigente(token) {
  if (!token) return false

  const payload = decodificarPayload(token)

  if (!payload?.exp) return false

  const ahoraEnSegundos = Math.floor(Date.now() / 1000)
  return payload.exp > ahoraEnSegundos + 5
}

// Devuelve la fecha de expiración del token en milisegundos.
// Se usa para programar el cierre automático de sesión.
export function obtenerExpiracion(token) {
  const payload = decodificarPayload(token)
  return payload?.exp ? payload.exp * 1000 : null
}

// Devuelve el token guardado o null.
export function obtenerToken() {
  return localStorage.getItem(STORAGE_TOKEN)
}

// Lee la sesión completa desde localStorage.
// Devuelve { token, usuario } o null si falta alguna parte.
export function leerSesion() {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN)
    const usuarioGuardado = localStorage.getItem(STORAGE_USUARIO)

    if (!token || !usuarioGuardado) return null

    return {
      token,
      usuario: JSON.parse(usuarioGuardado),
    }
  } catch {
    // Si el JSON está corrupto, consideramos que no hay sesión.
    return null
  }
}

// Guarda token y usuario después del login o de una actualización
// del perfil.
export function guardarSesion(token, usuario) {
  localStorage.setItem(STORAGE_TOKEN, token)
  localStorage.setItem(STORAGE_USUARIO, JSON.stringify(usuario))
}

// Elimina por completo la sesión del navegador.
export function limpiarSesion() {
  localStorage.removeItem(STORAGE_TOKEN)
  localStorage.removeItem(STORAGE_USUARIO)
}
