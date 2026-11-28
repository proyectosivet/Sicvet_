// ============================================================
// CONTROLADOR DE CLIENTES
// ============================================================
// Un cliente es el propietario de las mascotas. Puede tener una
// cuenta de usuario vinculada (usuarioId) o ser un registro creado
// por recepción.
//
// Permisos (se aplican en las rutas):
//   - administrador y recepcionista: lectura y escritura
//   - veterinario: solo lectura

import { ESTADOS_CITA_ACTIVA } from '../config/constantes.js'
import {
  buscarClientePorUsuarioId,
  buscarUsuarioPorCorreo,
  db,
  siguienteId,
} from '../utils/almacen.js'
import {
  esCorreoValido,
  limpiarTexto,
  normalizarCorreo,
  textoRequerido,
} from '../utils/validaciones.js'
import { responderError, responderExito } from '../utils/respuestas.js'

// ------------------------------------------------------------
// Utilidad interna: agrega el número de mascotas al cliente.
// ------------------------------------------------------------
function clienteConResumen(cliente) {
  const numeroMascotas = db.mascotas.filter(
    (mascota) => mascota.clienteId === cliente.id,
  ).length

  return {
    ...cliente,
    numeroMascotas,
  }
}

// ------------------------------------------------------------
// GET /api/clientes
// ------------------------------------------------------------
// Filtro opcional: ?buscar=texto (nombre, correo o teléfono).
export function listarClientes(req, res) {
  const { buscar } = req.query

  let clientes = [...db.clientes]

  if (buscar) {
    const termino = String(buscar).trim().toLowerCase()

    clientes = clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.correo.toLowerCase().includes(termino) ||
        cliente.telefono.toLowerCase().includes(termino),
    )
  }

  clientes.sort((a, b) => a.nombre.localeCompare(b.nombre))

  return responderExito(res, 'Clientes obtenidos correctamente', {
    total: clientes.length,
    clientes: clientes.map(clienteConResumen),
  })
}

// ------------------------------------------------------------
// GET /api/clientes/:id
// ------------------------------------------------------------
// Devuelve el cliente junto con todas sus mascotas.
export function obtenerCliente(req, res) {
  const cliente = db.clientes.find(
    (item) => item.id === Number(req.params.id),
  )

  if (!cliente) {
    return responderError(res, 'Cliente no encontrado', 404)
  }

  const mascotas = db.mascotas.filter(
    (mascota) => mascota.clienteId === cliente.id,
  )

  return responderExito(res, 'Cliente obtenido correctamente', {
    cliente: { ...clienteConResumen(cliente), mascotas },
  })
}

// ------------------------------------------------------------
// POST /api/clientes
// ------------------------------------------------------------
export function crearCliente(req, res) {
  const { nombre, correo, telefono, direccion } = req.body || {}

  // 1. Validaciones obligatorias.
  if (
    !textoRequerido(nombre) ||
    !textoRequerido(correo) ||
    !textoRequerido(telefono)
  ) {
    return responderError(
      res,
      'Nombre, correo y teléfono son obligatorios',
      400,
    )
  }

  if (!esCorreoValido(correo)) {
    return responderError(res, 'Ingresa un correo electrónico válido', 400)
  }

  const correoNormalizado = normalizarCorreo(correo)

  // 2. Evitamos clientes duplicados por correo.
  const correoDuplicado = db.clientes.some(
    (cliente) => cliente.correo.toLowerCase() === correoNormalizado,
  )

  if (correoDuplicado) {
    return responderError(res, 'Ya existe un cliente con ese correo', 409)
  }

  // 3. Si el correo pertenece a una cuenta de cliente sin vincular,
  //    la enlazamos automáticamente. Así el usuario verá sus datos.
  const usuarioExistente = buscarUsuarioPorCorreo(correoNormalizado)
  const yaVinculado = usuarioExistente
    ? buscarClientePorUsuarioId(usuarioExistente.id)
    : null

  const nuevoCliente = {
    id: siguienteId('clientes'),
    usuarioId:
      usuarioExistente && !yaVinculado ? usuarioExistente.id : null,
    nombre: limpiarTexto(nombre),
    correo: correoNormalizado,
    telefono: limpiarTexto(telefono),
    direccion: limpiarTexto(direccion),
    creadoEn: new Date().toISOString(),
  }

  db.clientes.push(nuevoCliente)

  return responderExito(
    res,
    'Cliente creado correctamente',
    { cliente: clienteConResumen(nuevoCliente) },
    201,
  )
}

// ------------------------------------------------------------
// PUT /api/clientes/:id
// ------------------------------------------------------------
export function actualizarCliente(req, res) {
  const cliente = db.clientes.find(
    (item) => item.id === Number(req.params.id),
  )

  if (!cliente) {
    return responderError(res, 'Cliente no encontrado', 404)
  }

  const { nombre, correo, telefono, direccion } = req.body || {}

  if (nombre !== undefined) {
    if (!textoRequerido(nombre)) {
      return responderError(res, 'El nombre no puede estar vacío', 400)
    }
    cliente.nombre = limpiarTexto(nombre)
  }

  if (correo !== undefined) {
    if (!esCorreoValido(correo)) {
      return responderError(res, 'Ingresa un correo electrónico válido', 400)
    }

    const correoNormalizado = normalizarCorreo(correo)
    const duplicado = db.clientes.some(
      (item) =>
        item.id !== cliente.id &&
        item.correo.toLowerCase() === correoNormalizado,
    )

    if (duplicado) {
      return responderError(res, 'Ya existe un cliente con ese correo', 409)
    }

    cliente.correo = correoNormalizado
  }

  if (telefono !== undefined) {
    cliente.telefono = limpiarTexto(telefono)
  }

  if (direccion !== undefined) {
    cliente.direccion = limpiarTexto(direccion)
  }

  // 4. Mantenemos sincronizada la cuenta de usuario vinculada.
  if (cliente.usuarioId) {
    const usuario = db.usuarios.find(
      (item) => item.id === cliente.usuarioId,
    )

    if (usuario) {
      usuario.nombre = cliente.nombre
      usuario.correo = cliente.correo
      usuario.telefono = cliente.telefono
      usuario.direccion = cliente.direccion
    }
  }

  return responderExito(res, 'Cliente actualizado correctamente', {
    cliente: clienteConResumen(cliente),
  })
}

// ------------------------------------------------------------
// DELETE /api/clientes/:id
// ------------------------------------------------------------
// No borramos clientes con mascotas ni con citas activas para no
// dejar datos huérfanos.
export function eliminarCliente(req, res) {
  const indice = db.clientes.findIndex(
    (item) => item.id === Number(req.params.id),
  )

  if (indice === -1) {
    return responderError(res, 'Cliente no encontrado', 404)
  }

  const cliente = db.clientes[indice]

  const tieneMascotas = db.mascotas.some(
    (mascota) => mascota.clienteId === cliente.id,
  )

  if (tieneMascotas) {
    return responderError(
      res,
      'No se puede eliminar un cliente con mascotas registradas',
      409,
    )
  }

  const tieneCitasActivas = db.citas.some(
    (cita) =>
      cita.clienteId === cliente.id &&
      ESTADOS_CITA_ACTIVA.includes(cita.estado),
  )

  if (tieneCitasActivas) {
    return responderError(
      res,
      'No se puede eliminar un cliente con citas activas',
      409,
    )
  }

  db.clientes.splice(indice, 1)

  return responderExito(res, 'Cliente eliminado correctamente')
}
