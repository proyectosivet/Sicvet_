// ============================================================
// VALIDADORES DEL FRONTEND
// ============================================================
// Validaciones rápidas para dar retroalimentación inmediata antes
// de llamar a la API. El backend vuelve a validar siempre: estas
// funciones son comodidad, no una barrera de seguridad.

// Comprueba que el valor sea texto y no esté vacío.
export function esTextoRequerido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0
}

// Valida el formato básico de un correo.
export function esCorreoValido(correo) {
  if (typeof correo !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
}

// Comprueba una longitud mínima.
export function minimoCaracteres(valor, minimo) {
  return typeof valor === 'string' && valor.length >= minimo
}
