// ============================================================
// CONTROLADOR DE USUARIOS (solo administrador)
// ============================================================
// Permite listar, crear, editar, activar/desactivar y dar de baja
// al personal de la clínica. Las contraseñas siempre se guardan
// hasheadas y nunca se devuelven en las respuestas.

import bcrypt from 'bcryptjs'
import {
  BCRYPT_RONDAS,
  ESTADOS_USUARIO,
  ESTADOS_USUARIO_VALIDOS,
  ROLES,
  ROLES_PERSONAL,
} from '../config/constantes.js'
import {
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
  db,
  siguienteId,
  usuarioPublico,
} from '../utils/almacen.js'
import {
  esCorreoValido,
  limpiarTexto,
  normalizarCorreo,
  textoRequerido,
} from '../utils/validaciones.js'
import { responderError, responderExito } from '../utils/respuestas.js'

// ------------------------------------------------------------
// GET /api/usuarios
// ------------------------------------------------------------
// Filtros opcionales: ?rol=veterinario&estado=activo&buscar=ana
export function listarUsuarios(req, res) {
  const { rol, estado, buscar } = req.query

  let usuarios = [...db.usuarios]

  if (rol) {
    usuarios = usuarios.filter((usuario) => usuario.rol === rol)
  }

  if (estado) {
    usuarios = usuarios.filter((usuario) => usuario.estado === estado)
  }

  if (buscar) {
    const termino = String(buscar).trim().toLowerCase()

    usuarios = usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.correo.toLowerCase().includes(termino),
    )
  }

  // Ordenamos por nombre para que la tabla sea predecible.
  usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre))

  return responderExito(res, 'Usuarios obtenidos correctamente', {
    total: usuarios.length,
    usuarios: usuarios.map(usuarioPublico),
  })
}

// ------------------------------------------------------------
// POST /api/usuarios
// ------------------------------------------------------------
// Crea una cuenta de personal. El registro público solo crea
// clientes; este endpoint es exclusivo del administrador.
export function crearUsuario(req, res) {
  const { nombre, correo, password, rol, telefono, direccion } =
    req.body || {}

  // 1. Validaciones obligatorias.
  if (
    !textoRequerido(nombre) ||
    !textoRequerido(correo) ||
    !textoRequerido(password) ||
    !textoRequerido(rol)
  ) {
    return responderError(res, 'Completa todos los campos', 400)
  }

  if (!esCorreoValido(correo)) {
    return responderError(res, 'Ingresa un correo electrónico válido', 400)
  }

  if (String(password).length < 6) {
    return responderError(
      res,
      'La contraseña debe tener al menos 6 caracteres',
      400,
    )
  }

  // 2. Solo se puede crear personal desde este endpoint.
  //    Los clientes se crean con el registro público.
  if (!ROLES_PERSONAL.includes(rol)) {
    return responderError(
      res,
      `Rol inválido. Usa uno de: ${ROLES_PERSONAL.join(', ')}`,
      400,
    )
  }

  // 3. El correo debe ser único.
  if (buscarUsuarioPorCorreo(correo)) {
    return responderError(res, 'Ese correo ya está registrado', 409)
  }

  // 4. Creamos el usuario con la contraseña hasheada.
  const nuevoUsuario = {
    id: siguienteId('usuarios'),
    nombre: limpiarTexto(nombre),
    correo: normalizarCorreo(correo),
    passwordHash: bcrypt.hashSync(String(password), BCRYPT_RONDAS),
    rol,
    telefono: limpiarTexto(telefono),
    direccion: limpiarTexto(direccion),
    estado: ESTADOS_USUARIO.ACTIVO,
    creadoEn: new Date().toISOString(),
  }

  db.usuarios.push(nuevoUsuario)

  return responderExito(
    res,
    'Usuario creado correctamente',
    { usuario: usuarioPublico(nuevoUsuario) },
    201,
  )
}

// ------------------------------------------------------------
// PUT /api/usuarios/:id
// ------------------------------------------------------------
// Actualiza los datos de un usuario. La contraseña no se cambia
// aquí; para eso existe /api/auth/password.
export function actualizarUsuario(req, res) {
  const usuario = buscarUsuarioPorId(req.params.id)

  if (!usuario) {
    return responderError(res, 'Usuario no encontrado', 404)
  }

  const { nombre, correo, rol, telefono, direccion } = req.body || {}

  if (nombre !== undefined) {
    if (!textoRequerido(nombre)) {
      return responderError(res, 'El nombre no puede estar vacío', 400)
    }
    usuario.nombre = limpiarTexto(nombre)
  }

  if (correo !== undefined) {
    if (!esCorreoValido(correo)) {
      return responderError(res, 'Ingresa un correo electrónico válido', 400)
    }

    const correoNormalizado = normalizarCorreo(correo)
    const existente = buscarUsuarioPorCorreo(correoNormalizado)

    if (existente && existente.id !== usuario.id) {
      return responderError(res, 'Ese correo ya está registrado', 409)
    }

    usuario.correo = correoNormalizado
  }

  if (rol !== undefined) {
    if (!ROLES_PERSONAL.includes(rol)) {
      return responderError(
        res,
        `Rol inválido. Usa uno de: ${ROLES_PERSONAL.join(', ')}`,
        400,
      )
    }
    usuario.rol = rol
  }

  if (telefono !== undefined) {
    usuario.telefono = limpiarTexto(telefono)
  }

  if (direccion !== undefined) {
    usuario.direccion = limpiarTexto(direccion)
  }

  // Si el usuario es un cliente vinculado, mantenemos sincronizado
  // su registro en la colección de clientes.
  const clienteVinculado = db.clientes.find(
    (cliente) => cliente.usuarioId === usuario.id,
  )

  if (clienteVinculado) {
    clienteVinculado.nombre = usuario.nombre
    clienteVinculado.correo = usuario.correo
    clienteVinculado.telefono = usuario.telefono
    clienteVinculado.direccion = usuario.direccion
  }

  return responderExito(
    res,
    'Usuario actualizado correctamente',
    { usuario: usuarioPublico(usuario) },
  )
}

// ------------------------------------------------------------
// PATCH /api/usuarios/:id/estado
// ------------------------------------------------------------
// Activa o desactiva una cuenta. Un usuario inactivo no puede
// iniciar sesión, pero sus datos e historial se conservan.
export function cambiarEstadoUsuario(req, res) {
  const usuario = buscarUsuarioPorId(req.params.id)

  if (!usuario) {
    return responderError(res, 'Usuario no encontrado', 404)
  }

  const { estado } = req.body || {}

  if (!ESTADOS_USUARIO_VALIDOS.includes(estado)) {
    return responderError(
      res,
      `Estado inválido. Usa: ${ESTADOS_USUARIO_VALIDOS.join(', ')}`,
      400,
    )
  }

  // Evitamos que el administrador se bloquee a sí mismo.
  if (
    usuario.id === Number(req.usuario.sub) &&
    estado === ESTADOS_USUARIO.INACTIVO
  ) {
    return responderError(
      res,
      'No puedes desactivar tu propia cuenta',
      400,
    )
  }

  usuario.estado = estado

  return responderExito(
    res,
    'Estado del usuario actualizado',
    { usuario: usuarioPublico(usuario) },
  )
}

// ------------------------------------------------------------
// DELETE /api/usuarios/:id
// ------------------------------------------------------------
// Baja lógica: no borramos el usuario para no romper citas ni
// historial. Simplemente queda inactivo.
export function eliminarUsuario(req, res) {
  const usuario = buscarUsuarioPorId(req.params.id)

  if (!usuario) {
    return responderError(res, 'Usuario no encontrado', 404)
  }

  if (usuario.id === Number(req.usuario.sub)) {
    return responderError(res, 'No puedes eliminar tu propia cuenta', 400)
  }

  // No permitimos desactivar al último administrador activo.
  const administradoresActivos = db.usuarios.filter(
    (item) =>
      item.rol === ROLES.ADMINISTRADOR &&
      item.estado === ESTADOS_USUARIO.ACTIVO,
  )

  if (
    usuario.rol === ROLES.ADMINISTRADOR &&
    administradoresActivos.length <= 1
  ) {

    return responderError(
      res,
      'Debe existir al menos un administrador activo',
      409,
    )
  }

  usuario.estado = ESTADOS_USUARIO.INACTIVO

  return responderExito(res, 'Usuario dado de baja correctamente')
}
