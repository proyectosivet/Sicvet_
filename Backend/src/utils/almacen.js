// ============================================================
// ALMACÉN EN MEMORIA
// ============================================================
// Simula una base de datos usando arreglos. Todos los controladores
// leen y escriben aquí. Al reiniciar el servidor, los datos vuelven
// al estado inicial definido en la carpeta "data".
//
// Ventaja: no requiere instalar ni configurar una base de datos.
// Limitación: los cambios se pierden al reiniciar (es intencional).

import { usuariosSeed } from '../data/usuarios.js'
import { clientesSeed } from '../data/clientes.js'
import { mascotasSeed } from '../data/mascotas.js'
import { serviciosSeed } from '../data/servicios.js'
import { citasSeed } from '../data/citas.js'

// Copiamos los seeds para no modificar los arreglos originales.
// Así es posible reiniciar el estado si en el futuro se agrega un
// endpoint de "reset" para pruebas.
export const db = {
  usuarios: usuariosSeed.map((usuario) => ({ ...usuario })),
  clientes: clientesSeed.map((cliente) => ({ ...cliente })),
  mascotas: mascotasSeed.map((mascota) => ({ ...mascota })),
  servicios: serviciosSeed.map((servicio) => ({ ...servicio })),
  citas: citasSeed.map((cita) => ({ ...cita })),
}

// Contadores de IDs por colección. Empiezan en el ID más alto del
// seed para que los nuevos registros no repitan identificadores.
const contadores = {
  usuarios: Math.max(...db.usuarios.map((item) => item.id), 0),
  clientes: Math.max(...db.clientes.map((item) => item.id), 0),
  mascotas: Math.max(...db.mascotas.map((item) => item.id), 0),
  servicios: Math.max(...db.servicios.map((item) => item.id), 0),
  citas: Math.max(...db.citas.map((item) => item.id), 0),
}

// Devuelve el siguiente ID disponible para una colección y lo
// incrementa. Ejemplo: siguienteId('clientes') -> 5, 6, 7...
export function siguienteId(coleccion) {
  if (!(coleccion in contadores)) {
    throw new Error(`Colección desconocida: ${coleccion}`)
  }

  contadores[coleccion] += 1
  return contadores[coleccion]
}

// Busca un usuario por correo sin distinguir mayúsculas.
export function buscarUsuarioPorCorreo(correo) {
  const correoNormalizado = correo.trim().toLowerCase()
  return db.usuarios.find(
    (usuario) => usuario.correo.toLowerCase() === correoNormalizado,
  )
}

// Busca un usuario por ID.
export function buscarUsuarioPorId(id) {
  return db.usuarios.find((usuario) => usuario.id === Number(id))
}

// Devuelve el registro de cliente asociado a una cuenta de usuario.
// Es la pieza que conecta "quien inicia sesión" con "sus mascotas".
export function buscarClientePorUsuarioId(usuarioId) {
  return db.clientes.find(
    (cliente) => cliente.usuarioId === Number(usuarioId),
  )
}

// Convierte un usuario interno en un objeto seguro para enviar al
// frontend. Nunca incluye passwordHash.
export function usuarioPublico(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    estado: usuario.estado,
    creadoEn: usuario.creadoEn,
  }
}
