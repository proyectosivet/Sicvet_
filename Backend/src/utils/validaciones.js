// ============================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================
// Funciones pequeñas y reutilizables. No dependen de Express para
// poder probarse o reutilizarse desde cualquier controlador.

// Verifica que un valor sea una cadena de texto.
export function esTexto(valor) {
  return typeof valor === 'string'
}

// Quita espacios al inicio y al final y devuelve '' si no es texto.
// Se usa antes de guardar datos para evitar nombres con espacios
// accidentales.
export function limpiarTexto(valor) {
  return esTexto(valor) ? valor.trim() : ''
}

// Comprueba que una cadena no esté vacía después de limpiarla.
export function textoRequerido(valor) {
  return limpiarTexto(valor).length > 0
}

// Valida un correo con una expresión sencilla pero suficiente para
// el proyecto: texto + @ + dominio + punto + extensión.
export function esCorreoValido(correo) {
  if (!esTexto(correo)) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
}

// Normaliza un correo para comparaciones: minúsculas y sin espacios.
// Así "Admin@Sicvet.com " y "admin@sicvet.com" se consideran iguales.
export function normalizarCorreo(correo) {
  return limpiarTexto(correo).toLowerCase()
}

// Valida una fecha en formato YYYY-MM-DD y comprueba que exista
// realmente (por ejemplo, rechaza 2026-02-30).
export function esFechaValida(fecha) {
  if (!esTexto(fecha)) return false

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false

  const [anio, mes, dia] = fecha.split('-').map(Number)
  const fechaObjeto = new Date(anio, mes - 1, dia)

  return (
    fechaObjeto.getFullYear() === anio &&
    fechaObjeto.getMonth() === mes - 1 &&
    fechaObjeto.getDate() === dia
  )
}

// Valida una hora en formato HH:mm de 24 horas (00:00 a 23:59).
export function esHoraValida(hora) {
  if (!esTexto(hora)) return false
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora)
}

// Devuelve true cuando el valor es un número mayor que cero.
// Acepta números y cadenas numéricas ("12.5").
export function esNumeroPositivo(valor) {
  const numero = Number(valor)
  return Number.isFinite(numero) && numero > 0
}

// Devuelve la fecha de hoy en formato YYYY-MM-DD usando la zona
// horaria local. Se usa para comparar con las fechas de las citas.
export function obtenerFechaHoy() {
  return formatearFechaLocal(new Date())
}

// Convierte un objeto Date a YYYY-MM-DD sin pasar por UTC.
// toISOString() usaría UTC y podría devolver el día anterior en
// zonas horarias negativas como Colombia.
export function formatearFechaLocal(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

// Devuelve el primer día del mes actual en formato YYYY-MM-DD.
// Es el rango por defecto del dashboard.
export function obtenerInicioMes() {
  const hoy = new Date()
  return formatearFechaLocal(
    new Date(hoy.getFullYear(), hoy.getMonth(), 1),
  )
}
