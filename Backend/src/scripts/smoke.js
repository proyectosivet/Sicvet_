// ============================================================
// SCRIPT DE PRUEBAS RÁPIDAS (SMOKE TEST)
// ============================================================
// Comprueba los flujos principales de la API contra un servidor
// que ya esté ejecutándose.
//
// Uso:
//   1. En una terminal: npm run dev
//   2. En otra:        node src/scripts/smoke.js
//
// No modifica archivos: todo ocurre en la memoria del servidor.

const BASE = process.env.API_URL || 'http://localhost:3000/api'

// Contadores para el resumen final.
let exitosas = 0
let fallidas = 0

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------

// Realiza una petición y devuelve { status, cuerpo }.
async function peticion(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
  })

  let cuerpo = null

  try {
    cuerpo = await respuesta.json()
  } catch {
    cuerpo = null
  }

  return { status: respuesta.status, cuerpo }
}

// Comprueba una condición y muestra el resultado.
function verificar(nombre, condicion, detalle = '') {
  if (condicion) {
    exitosas += 1
    console.log(`  OK   ${nombre}`)
  } else {
    fallidas += 1
    console.error(`  FALLO ${nombre} ${detalle}`)
  }
}

// Cabecera con token Bearer.
function conToken(token) {
  return { Authorization: `Bearer ${token}` }
}

// ------------------------------------------------------------
// Flujo de pruebas
// ------------------------------------------------------------
async function ejecutar() {
  console.log(`\nProbando API en ${BASE}\n`)

  // 1. Servidor vivo.
  const health = await peticion('/health')
  verificar('health responde 200', health.status === 200)

  // 2. Login inválido.
  const loginMal = await peticion('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identificador: 'admin@sicvet.com',
      password: 'incorrecta',
    }),
  })
  verificar('login inválido devuelve 401', loginMal.status === 401)

  // 3. Login de administrador.
  const loginAdmin = await peticion('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identificador: 'admin@sicvet.com',
      password: 'admin123',
    }),
  })
  verificar(
    'login admin devuelve token',
    loginAdmin.status === 200 && Boolean(loginAdmin.cuerpo?.datos?.token),
  )
  const tokenAdmin = loginAdmin.cuerpo?.datos?.token

  // 4. Perfil sin token.
  const sinToken = await peticion('/auth/perfil')
  verificar('perfil sin token devuelve 401', sinToken.status === 401)

  // 5. Perfil con token.
  const perfil = await peticion('/auth/perfil', {
    headers: conToken(tokenAdmin),
  })
  verificar(
    'perfil con token devuelve el usuario',
    perfil.status === 200 &&
      perfil.cuerpo?.datos?.usuario?.rol === 'administrador',
  )

  // 5b. Cambio de contraseña con la actual incorrecta.
  //     Debe ser 400, no 401, para no cerrar la sesión del usuario.
  const passwordMal = await peticion('/auth/password', {
    method: 'PUT',
    headers: conToken(tokenAdmin),
    body: JSON.stringify({
      passwordActual: 'incorrecta',
      passwordNueva: 'nueva123',
    }),
  })
  verificar(
    'contraseña actual incorrecta devuelve 400',
    passwordMal.status === 400,
  )

  // 5c. El token debe seguir siendo válido tras ese error.
  const perfilSigue = await peticion('/auth/perfil', {
    headers: conToken(tokenAdmin),
  })
  verificar(
    'la sesión sigue activa tras un error de contraseña',
    perfilSigue.status === 200,
  )

  // 6. Registro de un cliente nuevo.
  const correoNuevo = `prueba.${Date.now()}@sicvet.com`
  const registro = await peticion('/auth/registro', {
    method: 'POST',
    body: JSON.stringify({
      nombre: 'Cliente de prueba',
      correo: correoNuevo,
      password: 'prueba123',
      telefono: '3000000000',
    }),
  })
  verificar('registro devuelve 201', registro.status === 201)

  // 7. Registro duplicado.
  const duplicado = await peticion('/auth/registro', {
    method: 'POST',
    body: JSON.stringify({
      nombre: 'Cliente de prueba',
      correo: correoNuevo,
      password: 'prueba123',
    }),
  })
  verificar('registro duplicado devuelve 409', duplicado.status === 409)

  // 8. Login del cliente recién creado.
  const loginCliente = await peticion('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identificador: correoNuevo,
      password: 'prueba123',
    }),
  })
  verificar(
    'login del cliente nuevo funciona',
    loginCliente.status === 200,
  )
  const tokenCliente = loginCliente.cuerpo?.datos?.token

  // 9. El cliente no puede listar usuarios.
  const usuariosCliente = await peticion('/usuarios', {
    headers: conToken(tokenCliente),
  })
  verificar(
    'cliente recibe 403 en /usuarios',
    usuariosCliente.status === 403,
  )

  // 10. El administrador sí puede listar usuarios.
  const usuariosAdmin = await peticion('/usuarios', {
    headers: conToken(tokenAdmin),
  })
  verificar(
    'admin lista usuarios',
    usuariosAdmin.status === 200 &&
      usuariosAdmin.cuerpo?.datos?.total >= 5,
  )

  // 11. Listados de catálogos.
  const clientes = await peticion('/clientes', {
    headers: conToken(tokenAdmin),
  })
  verificar(
    'admin lista clientes',
    clientes.status === 200 && clientes.cuerpo?.datos?.total > 0,
  )

  const servicios = await peticion('/servicios', {
    headers: conToken(tokenAdmin),
  })
  verificar(
    'admin lista servicios',
    servicios.status === 200 && servicios.cuerpo?.datos?.total > 0,
  )

  // 12. Crear un cliente de prueba.
  const clienteNuevo = await peticion('/clientes', {
    method: 'POST',
    headers: conToken(tokenAdmin),
    body: JSON.stringify({
      nombre: 'Cliente Smoke',
      correo: `cliente.${Date.now()}@sicvet.com`,
      telefono: '3111111111',
    }),
  })
  verificar('crear cliente devuelve 201', clienteNuevo.status === 201)
  const clienteId = clienteNuevo.cuerpo?.datos?.cliente?.id

  // 13. Crear una mascota para ese cliente.
  const mascotaNueva = await peticion('/mascotas', {
    method: 'POST',
    headers: conToken(tokenAdmin),
    body: JSON.stringify({
      clienteId,
      nombre: 'Firulais',
      especie: 'Perro',
      raza: 'Criollo',
      edad: 2,
      peso: 12,
    }),
  })
  verificar('crear mascota devuelve 201', mascotaNueva.status === 201)
  const mascotaId = mascotaNueva.cuerpo?.datos?.mascota?.id

  // 14. Crear una cita para mañana.
  const manana = new Date()
  manana.setDate(manana.getDate() + 1)
  const fechaManana = [
    manana.getFullYear(),
    String(manana.getMonth() + 1).padStart(2, '0'),
    String(manana.getDate()).padStart(2, '0'),
  ].join('-')

  const citaNueva = await peticion('/citas', {
    method: 'POST',
    headers: conToken(tokenAdmin),
    body: JSON.stringify({
      clienteId,
      mascotaId,
      servicioId: 1,
      profesionalId: 3,
      fecha: fechaManana,
      hora: '16:00',
      notas: 'Cita creada por el smoke test',
    }),
  })
  verificar('crear cita devuelve 201', citaNueva.status === 201)

  // 15. Cruce de horario: misma fecha, hora y profesional.
  const cruce = await peticion('/citas', {
    method: 'POST',
    headers: conToken(tokenAdmin),
    body: JSON.stringify({
      clienteId,
      mascotaId,
      servicioId: 1,
      profesionalId: 3,
      fecha: fechaManana,
      hora: '16:00',
    }),
  })
  verificar('cruce de horario devuelve 409', cruce.status === 409)

  // 16. Dashboard del administrador.
  const dashboard = await peticion('/dashboard/resumen', {
    headers: conToken(tokenAdmin),
  })
  verificar(
    'dashboard devuelve métricas',
    dashboard.status === 200 &&
      typeof dashboard.cuerpo?.datos?.resumen?.citasHoy === 'number',
  )

  // 17. Recuperación simulada.
  const recuperar = await peticion('/auth/recuperar', {
    method: 'POST',
    body: JSON.stringify({ correo: 'admin@sicvet.com' }),
  })
  verificar('recuperar responde 200', recuperar.status === 200)

  // Resumen final.
  console.log(`\nResultado: ${exitosas} correctas, ${fallidas} fallidas\n`)

  if (fallidas > 0) {
    process.exitCode = 1
  }
}

// Ejecutamos y capturamos cualquier error de red.
ejecutar().catch((error) => {
  console.error('No se pudo ejecutar el smoke test:', error.message)
  process.exitCode = 1
})
