// ============================================================
// PROVEEDOR DE AUTENTICACIÓN
// ============================================================
// Mantiene en memoria el usuario y el token, los sincroniza con
// localStorage y expone las acciones de login, registro, logout y
// actualización de perfil.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { api } from '../lib/api'
import { EVENTO_SESION_EXPIRADA } from '../lib/constants'
import {
  guardarSesion,
  leerSesion,
  limpiarSesion,
  obtenerExpiracion,
  tokenVigente,
} from '../lib/sesion'

export function AuthProvider({ children }) {
  // ----------------------------------------------------------
  // Estado inicial: recuperamos la sesión guardada, pero solo si
  // el token sigue vigente. Si está vencido, limpiamos todo.
  // ----------------------------------------------------------
  const [sesion, setSesion] = useState(() => {
    const guardada = leerSesion()

    if (guardada?.token && guardada?.usuario && tokenVigente(guardada.token)) {
      return guardada
    }

    limpiarSesion()
    return { token: null, usuario: null }
  })

  // "cargando" es true mientras verificamos el token contra el
  // backend al abrir la aplicación.
  const [cargando, setCargando] = useState(Boolean(sesion.token))

  // ----------------------------------------------------------
  // Cerrar sesión: borra el almacenamiento y el estado.
  // ----------------------------------------------------------
  const logout = useCallback(() => {
    limpiarSesion()
    setSesion({ token: null, usuario: null })
    setCargando(false)
  }, [])

  // ----------------------------------------------------------
  // Si la API responde 401, api.js dispara este evento y aquí
  // cerramos la sesión para que ProtectedRoute redirija al login.
  // ----------------------------------------------------------
  useEffect(() => {
    function manejarSesionExpirada() {
      logout()
    }

    window.addEventListener(EVENTO_SESION_EXPIRADA, manejarSesionExpirada)

    return () => {
      window.removeEventListener(
        EVENTO_SESION_EXPIRADA,
        manejarSesionExpirada,
      )
    }
  }, [logout])

  // ----------------------------------------------------------
  // Verificación inicial contra el backend.
  // ----------------------------------------------------------
  // Aunque el token no esté vencido, el usuario podría haber sido
  // desactivado. GET /auth/perfil confirma que sigue siendo válido.
  useEffect(() => {
    let activo = true

    async function verificarSesion() {
      if (!sesion.token) {
        setCargando(false)
        return
      }

      try {
        const respuesta = await api.get('/auth/perfil')

        if (!activo) return

        const usuario = respuesta.datos.usuario

        // Guardamos los datos frescos por si cambiaron en el backend.
        guardarSesion(sesion.token, usuario)
        setSesion({ token: sesion.token, usuario })
      } catch {
        // Token inválido, expirado o usuario inactivo.
        if (activo) logout()
      } finally {
        if (activo) setCargando(false)
      }
    }

    verificarSesion()

    return () => {
      activo = false
    }
  }, [sesion.token, logout])

  // ----------------------------------------------------------
  // Cierre automático cuando el JWT llega a su expiración.
  // ----------------------------------------------------------
  useEffect(() => {
    if (!sesion.token) return undefined

    const expiracion = obtenerExpiracion(sesion.token)

    if (!expiracion) return undefined

    const restante = expiracion - Date.now()

    if (restante <= 0) {
      // Programamos el cierre en el siguiente tick para no llamar a
      // setState de forma síncrona dentro del efecto.
      const temporizador = setTimeout(logout, 0)
      return () => clearTimeout(temporizador)
    }

    const temporizador = setTimeout(logout, restante)

    return () => clearTimeout(temporizador)
  }, [sesion.token, logout])

  // ----------------------------------------------------------
  // Acciones expuestas a las pantallas
  // ----------------------------------------------------------

  // Inicia sesión y guarda token + usuario.
  const login = useCallback(async (identificador, password) => {
    const respuesta = await api.post('/auth/login', {
      identificador,
      password,
    })

    const { token, usuario } = respuesta.datos

    guardarSesion(token, usuario)
    setSesion({ token, usuario })

    return usuario
  }, [])

  // Registra un cliente nuevo. No inicia sesión automáticamente:
  // el usuario vuelve al login para confirmar sus credenciales.
  const registrar = useCallback(async (datos) => {
    const respuesta = await api.post('/auth/registro', datos)
    return respuesta.datos.usuario
  }, [])

  // Actualiza el perfil y refresca el usuario en memoria y en
  // localStorage para que el sidebar/topbar cambien al instante.
  const actualizarPerfil = useCallback(async (datos) => {
    const respuesta = await api.put('/auth/perfil', datos)
    const usuario = respuesta.datos.usuario

    setSesion((actual) => {
      if (!actual.token) return actual

      guardarSesion(actual.token, usuario)
      return { ...actual, usuario }
    })

    return usuario
  }, [])

  // Memorizamos el valor para evitar renderizados innecesarios.
  const valor = useMemo(
    () => ({
      usuario: sesion.usuario,
      token: sesion.token,
      autenticado: Boolean(sesion.usuario),
      cargando,
      login,
      registrar,
      logout,
      actualizarPerfil,
    }),
    [
      sesion.usuario,
      sesion.token,
      cargando,
      login,
      registrar,
      logout,
      actualizarPerfil,
    ],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
