// ============================================================
// CONTROLADOR DE MASCOTAS
// ============================================================
// Reglas de acceso:
//   - El personal (admin, recepción, veterinario, peluquero) puede
//     consultar todas las mascotas.
//   - El cliente solo puede ver y modificar SUS mascotas.
// La restricción se aplica aquí, no solo en el frontend, porque el
// frontend puede manipularse.

import { ESTADOS_CITA_ACTIVA, ROLES } from '../config/constantes.js'
import {
  buscarClientePorUsuarioId,
  db,
  siguienteId,
} from '../utils/almacen.js'
import {
  esNumeroPositivo,
  limpiarTexto,
  textoRequerido,
} from '../utils/validaciones.js'
import { responderError, responderExito } from '../utils/respuestas.js'

// ------------------------------------------------------------
// Utilidades internas
// ------------------------------------------------------------

// Devuelve el cliente vinculado al usuario autenticado.
function clienteDelUsuario(req) {
  return buscarClientePorUsuarioId(req.usuario.sub)
}

// Indica si el usuario autenticado es un cliente.
function esCliente(req) {
  return req.usuario.rol === ROLES.CLIENTE
}

// Agrega el nombre del propietario a la mascota para mostrarlo en
// las tablas del frontend.
function mascotaConPropietario(mascota) {
  const cliente = db.clientes.find(
    (item) => item.id === mascota.clienteId,
  )

  return {
    ...mascota,
    propietario: cliente
      ? {
          id: cliente.id,
          nombre: cliente.nombre,
          correo: cliente.correo,
          telefono: cliente.telefono,
        }
      : null,
  }
}

// Comprueba que la mascota pertenezca al cliente autenticado.
function puedeAcceder(req, mascota) {
  if (!esCliente(req)) return true

  const cliente = clienteDelUsuario(req)
  return Boolean(cliente) && mascota.clienteId === cliente.id
}

// ------------------------------------------------------------
// GET /api/mascotas
// ------------------------------------------------------------
// Filtro opcional: ?clienteId=1
export function listarMascotas(req, res) {
  const { clienteId } = req.query

  let mascotas = [...db.mascotas]

  if (esCliente(req)) {
    // El cliente solo ve las suyas, aunque envíe otro clienteId.
    const cliente = clienteDelUsuario(req)

    if (!cliente) {
      return responderExito(res, 'Mascotas obtenidas correctamente', {
        total: 0,
        mascotas: [],
      })
    }

    mascotas = mascotas.filter(
      (mascota) => mascota.clienteId === cliente.id,
    )
  } else if (clienteId) {
    mascotas = mascotas.filter(
      (mascota) => mascota.clienteId === Number(clienteId),
    )
  }

  mascotas.sort((a, b) => a.nombre.localeCompare(b.nombre))

  return responderExito(res, 'Mascotas obtenidas correctamente', {
    total: mascotas.length,
    mascotas: mascotas.map(mascotaConPropietario),
  })
}

// ------------------------------------------------------------
// GET /api/mascotas/:id
// ------------------------------------------------------------
export function obtenerMascota(req, res) {
  const mascota = db.mascotas.find(
    (item) => item.id === Number(req.params.id),
  )

  if (!mascota) {
    return responderError(res, 'Mascota no encontrada', 404)
  }

  if (!puedeAcceder(req, mascota)) {
    return responderError(res, 'No tienes permisos sobre esta mascota', 403)
  }

  return responderExito(res, 'Mascota obtenida correctamente', {
    mascota: mascotaConPropietario(mascota),
  })
}

// ------------------------------------------------------------
// POST /api/mascotas
// ------------------------------------------------------------
export function crearMascota(req, res) {
  const { clienteId, nombre, especie, raza, edad, peso, notas } =
    req.body || {}

  // 1. Determinamos el propietario. Si quien crea es un cliente,
  //    se ignora cualquier clienteId enviado y se usa el suyo.
  let propietarioId

  if (esCliente(req)) {
    const cliente = clienteDelUsuario(req)

    if (!cliente) {
      return responderError(
        res,
        'No tienes un registro de cliente asociado',
        403,
      )
    }

    propietarioId = cliente.id
  } else {
    // Aceptamos IDs numéricos o cadenas numéricas, por eso no
    // usamos textoRequerido directamente.
    if (clienteId === undefined || clienteId === null || clienteId === '') {
      return responderError(res, 'Debes seleccionar un cliente', 400)
    }

    propietarioId = Number(clienteId)
  }

  // 2. El propietario debe existir.
  const clienteExiste = db.clientes.some(
    (cliente) => cliente.id === propietarioId,
  )

  if (!clienteExiste) {
    return responderError(res, 'El cliente indicado no existe', 404)
  }

  // 3. Validaciones de la mascota.
  if (!textoRequerido(nombre) || !textoRequerido(especie)) {
    return responderError(res, 'Nombre y especie son obligatorios', 400)
  }

  if (edad !== undefined && edad !== '' && !esNumeroPositivo(edad)) {
    return responderError(res, 'La edad debe ser un número mayor a cero', 400)
  }

  if (peso !== undefined && peso !== '' && !esNumeroPositivo(peso)) {
    return responderError(res, 'El peso debe ser un número mayor a cero', 400)
  }

  const nuevaMascota = {
    id: siguienteId('mascotas'),
    clienteId: propietarioId,
    nombre: limpiarTexto(nombre),
    especie: limpiarTexto(especie),
    raza: limpiarTexto(raza),
    edad: edad === undefined || edad === '' ? null : Number(edad),
    peso: peso === undefined || peso === '' ? null : Number(peso),
    notas: limpiarTexto(notas),
    creadoEn: new Date().toISOString(),
  }

  db.mascotas.push(nuevaMascota)

  return responderExito(
    res,
    'Mascota registrada correctamente',
    { mascota: mascotaConPropietario(nuevaMascota) },
    201,
  )
}

// ------------------------------------------------------------
// PUT /api/mascotas/:id
// ------------------------------------------------------------
export function actualizarMascota(req, res) {
  const mascota = db.mascotas.find(
    (item) => item.id === Number(req.params.id),
  )

  if (!mascota) {
    return responderError(res, 'Mascota no encontrada', 404)
  }

  if (!puedeAcceder(req, mascota)) {
    return responderError(res, 'No tienes permisos sobre esta mascota', 403)
  }

  const { nombre, especie, raza, edad, peso, notas } = req.body || {}

  if (nombre !== undefined) {
    if (!textoRequerido(nombre)) {
      return responderError(res, 'El nombre no puede estar vacío', 400)
    }
    mascota.nombre = limpiarTexto(nombre)
  }

  if (especie !== undefined) {
    if (!textoRequerido(especie)) {
      return responderError(res, 'La especie no puede estar vacía', 400)
    }
    mascota.especie = limpiarTexto(especie)
  }

  if (raza !== undefined) {
    mascota.raza = limpiarTexto(raza)
  }

  if (edad !== undefined) {
    if (edad !== '' && !esNumeroPositivo(edad)) {
      return responderError(
        res,
        'La edad debe ser un número mayor a cero',
        400,
      )
    }
    mascota.edad = edad === '' ? null : Number(edad)
  }

  if (peso !== undefined) {
    if (peso !== '' && !esNumeroPositivo(peso)) {
      return responderError(
        res,
        'El peso debe ser un número mayor a cero',
        400,
      )
    }
    mascota.peso = peso === '' ? null : Number(peso)
  }

  if (notas !== undefined) {
    mascota.notas = limpiarTexto(notas)
  }

  return responderExito(res, 'Mascota actualizada correctamente', {
    mascota: mascotaConPropietario(mascota),
  })
}

// ------------------------------------------------------------
// DELETE /api/mascotas/:id
// ------------------------------------------------------------
export function eliminarMascota(req, res) {
  const indice = db.mascotas.findIndex(
    (item) => item.id === Number(req.params.id),
  )

  if (indice === -1) {
    return responderError(res, 'Mascota no encontrada', 404)
  }

  const mascota = db.mascotas[indice]

  if (!puedeAcceder(req, mascota)) {
    return responderError(res, 'No tienes permisos sobre esta mascota', 403)
  }

  // No eliminamos mascotas con citas activas: primero hay que
  // cancelarlas o completarlas.
  const tieneCitasActivas = db.citas.some(
    (cita) =>
      cita.mascotaId === mascota.id &&
      ESTADOS_CITA_ACTIVA.includes(cita.estado),
  )

  if (tieneCitasActivas) {
    return responderError(
      res,
      'No se puede eliminar una mascota con citas activas',
      409,
    )
  }

  db.mascotas.splice(indice, 1)

  return responderExito(res, 'Mascota eliminada correctamente')
}
