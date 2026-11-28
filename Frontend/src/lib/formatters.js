// ============================================================
// FORMATEADORES DE PRESENTACIÓN
// ============================================================
// Convierten datos técnicos (fechas ISO, números) en texto legible
// para las pantallas.

// Formatea una fecha YYYY-MM-DD como DD/MM/YYYY.
export function formatearFecha(fecha) {
  if (!fecha || typeof fecha !== 'string') return '—'

  const partes = fecha.split('-')

  if (partes.length !== 3) return fecha

  const [anio, mes, dia] = partes
  return `${dia}/${mes}/${anio}`
}

// Muestra una hora HH:mm sin cambios, con guion si falta.
export function formatearHora(hora) {
  return hora || '—'
}

// Formatea un número como pesos colombianos.
export function formatearMoneda(valor) {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) return '$ 0'

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(numero)
}

// Obtiene las iniciales de un nombre para el avatar.
// "María García López" -> "MG"
export function iniciales(nombre) {
  if (!nombre || typeof nombre !== 'string') return '?'

  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join('')
}

// Pone en mayúscula la primera letra de un estado.
export function capitalizar(texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Devuelve la fecha de hoy en formato YYYY-MM-DD (zona local).
export function fechaHoy() {
  return formatearFechaLocal(new Date())
}

// Primer día del mes actual en formato YYYY-MM-DD.
// Es el valor inicial del filtro del dashboard.
export function inicioMesActual() {
  const hoy = new Date()
  return formatearFechaLocal(
    new Date(hoy.getFullYear(), hoy.getMonth(), 1),
  )
}

// Convierte un Date a YYYY-MM-DD sin usar UTC.
function formatearFechaLocal(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}
