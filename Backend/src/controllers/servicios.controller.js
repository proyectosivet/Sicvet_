// ============================================================
// CONTROLADOR DE SERVICIOS
// ============================================================
// Catálogo de servicios de la veterinaria. Todos los usuarios
// autenticados pueden consultarlo; solo el administrador puede
// crear, editar o dar de baja servicios (permisos en las rutas).

import { db, siguienteId } from '../utils/almacen.js'
import {
  esNumeroPositivo,
  limpiarTexto,
  textoRequerido,
} from '../utils/validaciones.js'
import { responderError, responderExito } from '../utils/respuestas.js'

// ------------------------------------------------------------
// GET /api/servicios
// ------------------------------------------------------------
// Filtros opcionales: ?categoria=Estética&activo=true
export function listarServicios(req, res) {
  const { categoria, activo } = req.query

  let servicios = [...db.servicios]

  if (categoria) {
    servicios = servicios.filter(
      (servicio) =>
        servicio.categoria.toLowerCase() ===
        String(categoria).toLowerCase(),
    )
  }

  // "activo" llega como texto desde la URL ("true" o "false").
  if (activo !== undefined) {
    const valor = String(activo) === 'true'
    servicios = servicios.filter((servicio) => servicio.activo === valor)
  }

  servicios.sort((a, b) => a.nombre.localeCompare(b.nombre))

  return responderExito(res, 'Servicios obtenidos correctamente', {
    total: servicios.length,
    servicios,
  })
}

// ------------------------------------------------------------
// POST /api/servicios
// ------------------------------------------------------------
export function crearServicio(req, res) {
  const { nombre, descripcion, precio, duracionMin, categoria } =
    req.body || {}

  // 1. Validaciones obligatorias.
  if (
    !textoRequerido(nombre) ||
    !textoRequerido(categoria) ||
    !esNumeroPositivo(precio) ||
    !esNumeroPositivo(duracionMin)
  ) {
    return responderError(
      res,
      'Nombre, categoría, precio y duración son obligatorios',
      400,
    )
  }

  const nuevoServicio = {
    id: siguienteId('servicios'),
    nombre: limpiarTexto(nombre),
    descripcion: limpiarTexto(descripcion),
    precio: Number(precio),
    duracionMin: Number(duracionMin),
    categoria: limpiarTexto(categoria),
    activo: true,
  }

  db.servicios.push(nuevoServicio)

  return responderExito(
    res,
    'Servicio creado correctamente',
    { servicio: nuevoServicio },
    201,
  )
}

// ------------------------------------------------------------
// PUT /api/servicios/:id
// ------------------------------------------------------------
export function actualizarServicio(req, res) {
  const servicio = db.servicios.find(
    (item) => item.id === Number(req.params.id),
  )

  if (!servicio) {
    return responderError(res, 'Servicio no encontrado', 404)
  }

  const { nombre, descripcion, precio, duracionMin, categoria, activo } =
    req.body || {}

  if (nombre !== undefined) {
    if (!textoRequerido(nombre)) {
      return responderError(res, 'El nombre no puede estar vacío', 400)
    }
    servicio.nombre = limpiarTexto(nombre)
  }

  if (descripcion !== undefined) {
    servicio.descripcion = limpiarTexto(descripcion)
  }

  if (precio !== undefined) {
    if (!esNumeroPositivo(precio)) {
      return responderError(res, 'El precio debe ser mayor a cero', 400)
    }
    servicio.precio = Number(precio)
  }

  if (duracionMin !== undefined) {
    if (!esNumeroPositivo(duracionMin)) {
      return responderError(
        res,
        'La duración debe ser mayor a cero',
        400,
      )
    }
    servicio.duracionMin = Number(duracionMin)
  }

  if (categoria !== undefined) {
    if (!textoRequerido(categoria)) {
      return responderError(res, 'La categoría no puede estar vacía', 400)
    }
    servicio.categoria = limpiarTexto(categoria)
  }

  if (activo !== undefined) {
    servicio.activo = Boolean(activo)
  }

  return responderExito(res, 'Servicio actualizado correctamente', {
    servicio,
  })
}

// ------------------------------------------------------------
// DELETE /api/servicios/:id
// ------------------------------------------------------------
// Baja lógica: el servicio deja de ofrecerse pero se conserva para
// que las citas históricas sigan mostrando su nombre y precio.
export function eliminarServicio(req, res) {
  const servicio = db.servicios.find(
    (item) => item.id === Number(req.params.id),
  )

  if (!servicio) {
    return responderError(res, 'Servicio no encontrado', 404)
  }

  servicio.activo = false

  return responderExito(res, 'Servicio dado de baja correctamente', {
    servicio,
  })
}
