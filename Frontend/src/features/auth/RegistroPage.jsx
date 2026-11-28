// ============================================================
// PÁGINA DE REGISTRO
// ============================================================
// Crea una cuenta de cliente con POST /api/auth/registro. Al
// terminar, vuelve al login con un mensaje de confirmación.

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import AuthLayout from '../../layouts/AuthLayout'
import {
  esCorreoValido,
  esTextoRequerido,
  minimoCaracteres,
} from '../../lib/validators'

export default function RegistroPage() {
  const { usuario, registrar } = useAuth()
  const navigate = useNavigate()

  // -------------------- Estado del formulario --------------------
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Un usuario autenticado no necesita registrarse otra vez.
  if (usuario) {
    return <Navigate to="/dashboard" replace />
  }

  // -------------------- Envío del formulario --------------------
  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    const nombreLimpio = nombre.trim()
    const correoLimpio = correo.trim()

    // Validaciones locales.
    if (
      !esTextoRequerido(nombreLimpio) ||
      !esTextoRequerido(correoLimpio) ||
      !esTextoRequerido(contrasena) ||
      !esTextoRequerido(confirmarContrasena)
    ) {
      setError('Completa todos los campos')
      return
    }

    if (!esCorreoValido(correoLimpio)) {
      setError('Ingresa un correo electrónico válido')
      return
    }

    if (!minimoCaracteres(contrasena, 6)) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden')
      return
    }

    setEnviando(true)

    try {
      // El backend crea el usuario y su registro de cliente.
      await registrar({
        nombre: nombreLimpio,
        correo: correoLimpio,
        password: contrasena,
      })

      // Volvemos al login mostrando el mensaje de éxito.
      navigate('/login', {
        replace: true,
        state: {
          mensaje: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
        },
      })
    } catch (fallo) {
      setError(fallo.mensaje || 'No se pudo crear la cuenta')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout titulo="Crear Cuenta">
      <form onSubmit={manejarEnvio} noValidate>
        {/* -------------------- Nombre -------------------- */}
        <div className="mb-3">
          <label
            htmlFor="nombre"
            className="form-label text-secondary fw-semibold small text-uppercase"
          >
            Nombre completo
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-secondary ps-3">
              <i className="bi bi-person" aria-hidden="true" />
            </span>

            <input
              id="nombre"
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Tu nombre completo"
              autoComplete="name"
              autoFocus
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
            />
          </div>
        </div>

        {/* -------------------- Correo -------------------- */}
        <div className="mb-3">
          <label
            htmlFor="correo"
            className="form-label text-secondary fw-semibold small text-uppercase"
          >
            Correo electrónico
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-secondary ps-3">
              <i className="bi bi-envelope" aria-hidden="true" />
            </span>

            <input
              id="correo"
              type="email"
              className="form-control border-start-0 ps-0"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
            />
          </div>
        </div>

        {/* -------------------- Contraseña -------------------- */}
        <div className="mb-3">
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
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              value={contrasena}
              onChange={(evento) =>
                setContrasena(evento.target.value)
              }
            />

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

        {/* -------------------- Confirmar contraseña -------------------- */}
        <div className="mb-3">
          <label
            htmlFor="confirmarContrasena"
            className="form-label text-secondary fw-semibold small text-uppercase"
          >
            Confirmar contraseña
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-secondary ps-3">
              <i className="bi bi-lock-fill" aria-hidden="true" />
            </span>

            <input
              id="confirmarContrasena"
              type={verContrasena ? 'text' : 'password'}
              className="form-control border-start-0 ps-0"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              value={confirmarContrasena}
              onChange={(evento) =>
                setConfirmarContrasena(evento.target.value)
              }
            />
          </div>
        </div>

        {/* -------------------- Volver al login -------------------- */}
        <div className="d-flex justify-content-end align-items-center mt-2 mb-3">
          <Link
            to="/login"
            className="text-decoration-none small fw-semibold"
          >
            ¿Ya tienes una cuenta? Inicia sesión
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
          Registrarse
        </button>
      </form>
    </AuthLayout>
  )
}
