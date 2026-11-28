// ============================================================
// PÁGINA DE INICIO DE SESIÓN
// ============================================================
// Conecta el formulario con POST /api/auth/login. Al recibir el
// token, AuthContext lo guarda y la aplicación navega al dashboard
// o a la ruta que el usuario intentaba abrir.

import { useState } from 'react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import AuthLayout from '../../layouts/AuthLayout'
import { rutaInicioPorRol } from '../../lib/navigation'
import { esTextoRequerido, minimoCaracteres } from '../../lib/validators'

export default function LoginPage() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // -------------------- Estado del formulario --------------------
  const [identificador, setIdentificador] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Mensaje enviado por la pantalla de registro tras crear la cuenta.
  const mensajeRegistro = location.state?.mensaje

  // Si ya hay una sesión activa, no mostramos el login.
  if (usuario) {
    return <Navigate to={rutaInicioPorRol(usuario.rol)} replace />
  }

  // -------------------- Envío del formulario --------------------
  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    // Validaciones locales para dar respuesta inmediata.
    if (
      !esTextoRequerido(identificador) ||
      !esTextoRequerido(contrasena)
    ) {
      setError('Completa todos los campos')
      return
    }

    if (!minimoCaracteres(contrasena, 6)) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setEnviando(true)

    try {
      const sesion = await login(identificador.trim(), contrasena)

      // Si ProtectedRoute guardó un destino, volvemos allí.
      const destino =
        location.state?.desde || rutaInicioPorRol(sesion?.usuario?.rol)
      navigate(destino, { replace: true })
    } catch (fallo) {
      setError(fallo.mensaje || 'No se pudo iniciar sesión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout titulo="Iniciar Sesión">
      {/* Confirmación de registro exitoso. */}
      {mensajeRegistro && (
        <div className="alert alert-success py-2 small" role="status">
          {mensajeRegistro}
        </div>
      )}

      <form onSubmit={manejarEnvio} noValidate>
        {/* -------------------- Correo o usuario -------------------- */}
        <div className="mb-3">
          <label
            htmlFor="identificador"
            className="form-label text-secondary fw-semibold small text-uppercase"
          >
            Correo o Usuario
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-secondary ps-3">
              <i className="bi bi-envelope" aria-hidden="true" />
            </span>

            <input
              id="identificador"
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="correo@ejemplo.com"
              autoComplete="username"
              autoFocus
              value={identificador}
              onChange={(evento) =>
                setIdentificador(evento.target.value)
              }
            />
          </div>
        </div>

        {/* -------------------- Contraseña -------------------- */}
        <div className="mb-2">
          <label
            htmlFor="contrasena"
            className="form-label text-secondary fw-semibold small text-uppercase"
          >
            Contraseña
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-secondary ps-3">
              <i className="bi bi-lock" aria-hidden="true" />
            </span>

            <input
              id="contrasena"
              type={verContrasena ? 'text' : 'password'}
              className="form-control border-start-0 border-end-0 px-0"
              autoComplete="current-password"
              placeholder="Ingrese su contraseña"
              value={contrasena}
              onChange={(evento) =>
                setContrasena(evento.target.value)
              }
            />

            {/* Botón para mostrar u ocultar la contraseña. */}
            <button
              type="button"
              className="input-group-text bg-white border-start-0 text-secondary pe-3 sicvet-inline-style-003"
              onClick={() => setVerContrasena((visible) => !visible)}
              aria-label={
                verContrasena
                  ? 'Ocultar contraseña'
                  : 'Mostrar contraseña'
              }
            >
              <i
                className={`bi ${
                  verContrasena ? 'bi-eye-slash' : 'bi-eye'
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* -------------------- Enlaces -------------------- */}
        <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
          <Link
            to="/registro"
            className="text-decoration-none small fw-semibold"
          >
            Registrar usuario
          </Link>

          <Link
            to="/recuperar"
            className="text-decoration-none small fw-semibold"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* -------------------- Error -------------------- */}
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        {/* -------------------- Botón -------------------- */}
        <button
          type="submit"
          className="btn btn-primary w-100 py-2 rounded-3 fw-semibold fs-6 d-flex align-items-center justify-content-center gap-2"
          disabled={enviando}
        >
          {enviando && (
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            />
          )}
          Ingresar
        </button>
      </form>
    </AuthLayout>
  )
}
