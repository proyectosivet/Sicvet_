// ============================================================
// CONTROLADOR DE AUTENTICACIÓN
// ============================================================
// Maneja login, registro, recuperación simulada, perfil y cambio
// de contraseña. Usa bcrypt para las contraseñas y JWT para la
// sesión.

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  BCRYPT_RONDAS,
  ESTADOS_USUARIO,
  JWT_ALGORITMO,
  JWT_EXPIRACION,
  ROLES,
} from '../config/constantes.js'
import {
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
  buscarClientePorUsuarioId,
  db,
  siguienteId,
  usuarioPublico,
} from '../utils/almacen.js'
import {
  esCorreoValido,
  esTexto,
  limpiarTexto,
  normalizarCorreo,
  textoRequerido,
} from '../utils/validaciones.js'
import { responderError, responderExito } from '../utils/respuestas.js'

// ------------------------------------------------------------
// Utilidad interna: firma el token de sesión.
// ------------------------------------------------------------
// El payload solo lleva datos de identificación y rol. Nunca
// incluimos la contraseña ni información sensible.
function firmarToken(usuario) {
  return jwt.sign(
    {
      // "sub" (subject) es el identificador del usuario.
      sub: String(usuario.id),
      rol: usuario.rol,
      nombre: usuario.nombre,
      correo: usuario.correo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRACION,
      algorithm: JWT_ALGORITMO,
    },
  )
}

// ------------------------------------------------------------
// POST /api/auth/login
// ------------------------------------------------------------
// Recibe { identificador, password }. "identificador" puede ser el
// correo o el nombre exacto del usuario.
export function login(req, res) {
  const { identificador, password } = req.body || {}

  // 1. Validación básica de tipos y campos vacíos.
  if (
    !esTexto(identificador) ||
    !esTexto(password) ||
    !identificador.trim() ||
    !password
  ) {
    return responderError(res, 'Completa todos los campos', 400)
  }

  const identificadorLimpio = limpiarTexto(identificador).toLowerCase()

  // 2. Buscamos por correo y, si no aparece, por nombre.
  //    La comparación es en minúsculas para no distinguir mayúsculas.
  let usuarioEncontrado = buscarUsuarioPorCorreo(identificadorLimpio)

  if (!usuarioEncontrado) {
    usuarioEncontrado = db.usuarios.find(
      (usuario) => usuario.nombre.toLowerCase() === identificadorLimpio,
    )
  }

  // 3. Mensaje genérico: no revelamos si el correo existe o no.
  if (!usuarioEncontrado) {
    return responderError(res, 'Correo o contraseña incorrectos', 401)
  }

  // 4. Comparamos la contraseña recibida con el hash guardado.
  const coincide = bcrypt.compareSync(
    password,
    usuarioEncontrado.passwordHash,
  )

  if (!coincide) {
    return responderError(res, 'Correo o contraseña incorrectos', 401)
  }

  // 5. Una cuenta inactiva no puede iniciar sesión.
  if (usuarioEncontrado.estado !== ESTADOS_USUARIO.ACTIVO) {
    return responderError(
      res,
      'Tu cuenta está inactiva. Contacta al administrador.',
      403,
    )
  }

  // 6. Generamos el token y respondemos con el usuario público.
  const token = firmarToken(usuarioEncontrado)

  return responderExito(
    res,
    'Inicio de sesión exitoso',
    {
      token,
      usuario: usuarioPublico(usuarioEncontrado),
    },
    200,
  )
}

// ------------------------------------------------------------
// POST /api/auth/registro
// ------------------------------------------------------------
// Crea una cuenta con rol "cliente". Además crea el registro de
// cliente para que pueda tener mascotas y citas.
export function registro(req, res) {
  const { nombre, correo, password, telefono, direccion } = req.body || {}

  // 1. Validaciones de los campos obligatorios.
  if (
    !textoRequerido(nombre) ||
    !textoRequerido(correo) ||
    !textoRequerido(password)
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

  // 2. El correo debe ser único en todo el sistema.
  const correoNormalizado = normalizarCorreo(correo)

  if (buscarUsuarioPorCorreo(correoNormalizado)) {
    return responderError(res, 'Ese correo ya está registrado', 409)
  }

  // 3. Creamos el usuario con la contraseña hasheada.
  const nuevoUsuario = {
    id: siguienteId('usuarios'),
    nombre: limpiarTexto(nombre),
    correo: correoNormalizado,
    passwordHash: bcrypt.hashSync(String(password), BCRYPT_RONDAS),
    rol: ROLES.CLIENTE,
    telefono: limpiarTexto(telefono),
    direccion: limpiarTexto(direccion),
    estado: ESTADOS_USUARIO.ACTIVO,
    creadoEn: new Date().toISOString(),
  }

  db.usuarios.push(nuevoUsuario)

  // 4. Creamos el cliente vinculado a la cuenta. Así el usuario
  //    puede registrar mascotas y agendar citas.
  const nuevoCliente = {
    id: siguienteId('clientes'),
    usuarioId: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    correo: nuevoUsuario.correo,
    telefono: nuevoUsuario.telefono,
    direccion: nuevoUsuario.direccion,
    creadoEn: nuevoUsuario.creadoEn,
  }

  db.clientes.push(nuevoCliente)

  return responderExito(
    res,
    'Cuenta creada correctamente. Ya puedes iniciar sesión.',
    { usuario: usuarioPublico(nuevoUsuario) },
    201,
  )
}

// ------------------------------------------------------------
// POST /api/auth/recuperar
// ------------------------------------------------------------
// Simula el envío de un enlace de recuperación. Como el proyecto no
// envía correos reales, siempre responde con el mismo mensaje para
// no revelar si el correo está registrado.
//
// La pantalla de restablecimiento queda pendiente para una fase
// posterior, por eso este endpoint no genera ni devuelve tokens.
export function recuperarPassword(req, res) {
  const { correo } = req.body || {}

  if (!textoRequerido(correo) || !esCorreoValido(correo)) {
    return responderError(res, 'Ingresa un correo electrónico válido', 400)
  }

  // Buscamos el usuario solo para dejar constancia en la consola del
  // servidor. La respuesta es idéntica exista o no el correo.
  const usuario = buscarUsuarioPorCorreo(correo)

  if (usuario) {
    console.log(
      `[SICVET] Solicitud de recuperación para ${usuario.correo} ` +
        '(envío de correo simulado, no implementado).',
    )
  }

  return responderExito(
    res,
    'Si el correo está registrado, recibirás un enlace de recuperación.',
    undefined,
    200,
  )
}

// ------------------------------------------------------------
// GET /api/auth/perfil
// ------------------------------------------------------------
// Devuelve los datos del usuario autenticado. El middleware
// verificarToken ya validó el JWT y guardó req.usuario.
export function obtenerPerfil(req, res) {
  const usuario = buscarUsuarioPorId(req.usuario.sub)

  if (!usuario) {
    return responderError(res, 'Usuario no encontrado', 404)
  }

  return responderExito(
    res,
    'Perfil obtenido correctamente',
    { usuario: usuarioPublico(usuario) },
    200,
  )
}

// ------------------------------------------------------------
// PUT /api/auth/perfil
// ------------------------------------------------------------
// Permite actualizar nombre, correo, teléfono y dirección.
export function actualizarPerfil(req, res) {
  const usuario = buscarUsuarioPorId(req.usuario.sub)

  if (!usuario) {
    return responderError(res, 'Usuario no encontrado', 404)
  }

  const { nombre, correo, telefono, direccion } = req.body || {}

  // 1. Validamos y actualizamos solo los campos enviados.
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

    // Si el correo pertenece a otro usuario, rechazamos el cambio.
    if (existente && existente.id !== usuario.id) {
      return responderError(res, 'Ese correo ya está registrado', 409)
    }

    usuario.correo = correoNormalizado
  }

  if (telefono !== undefined) {
    usuario.telefono = limpiarTexto(telefono)
  }

  if (direccion !== undefined) {
    usuario.direccion = limpiarTexto(direccion)
  }

  // 2. Mantenemos sincronizado el registro de cliente vinculado.
  //    Así los listados administrativos muestran los datos nuevos.
  const clienteVinculado = buscarClientePorUsuarioId(usuario.id)

  if (clienteVinculado) {
    clienteVinculado.nombre = usuario.nombre
    clienteVinculado.correo = usuario.correo
    clienteVinculado.telefono = usuario.telefono
    clienteVinculado.direccion = usuario.direccion
  }

  return responderExito(
    res,
    'Perfil actualizado correctamente',
    { usuario: usuarioPublico(usuario) },
    200,
  )
}

// ------------------------------------------------------------
// PUT /api/auth/password
// ------------------------------------------------------------
// Cambia la contraseña del usuario autenticado.
export function cambiarPassword(req, res) {
  const usuario = buscarUsuarioPorId(req.usuario.sub)

  if (!usuario) {
    return responderError(res, 'Usuario no encontrado', 404)
  }

  const { passwordActual, passwordNueva } = req.body || {}

  if (!esTexto(passwordActual) || !esTexto(passwordNueva)) {
    return responderError(res, 'Completa todos los campos', 400)
  }

  // 1. La contraseña actual debe coincidir con el hash guardado.
  //    Usamos 400 (no 401) para que el frontend no interprete este
  //    error como una sesión expirada y cierre la sesión.
  if (!bcrypt.compareSync(passwordActual, usuario.passwordHash)) {
    return responderError(res, 'La contraseña actual es incorrecta', 400)
  }

  // 2. La nueva contraseña debe tener una longitud mínima.
  if (passwordNueva.length < 6) {
    return responderError(
      res,
      'La nueva contraseña debe tener al menos 6 caracteres',
      400,
    )
  }

  // 3. Guardamos únicamente el hash de la nueva contraseña.
  usuario.passwordHash = bcrypt.hashSync(passwordNueva, BCRYPT_RONDAS)

  return responderExito(res, 'Contraseña actualizada correctamente')
}
