// ============================================================
// LAYOUT DE AUTENTICACIÓN
// ============================================================
// Fondo, logo y tarjeta compartidos por login, registro y
// recuperación. Evita duplicar el mismo diseño en tres pantallas.

import { NOMBRE_APP } from '../lib/constants'

export default function AuthLayout({ titulo, children }) {
  return (
    <div className="min-vh-100 sicvet-inline-style-001">
      <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center py-4">
        {/* Logo del sistema. Vive en Frontend/public/assets. */}
        <img
          src="/assets/dashboard/img/logo.png"
          width="120"
          alt="Logo SICVET"
          className="img-fluid rounded mx-auto d-block mb-3"
        />

        {/* Nombre y descripción. */}
        <div className="text-center">
          <h1>{NOMBRE_APP}</h1>
          <p className="text-muted text-secondary small m-0">
            Sistema de gestión veterinaria
          </p>
        </div>

        {/* Tarjeta que contiene el formulario de cada pantalla. */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-sm-5 sicvet-inline-style-002">
          <h3 className="fw-bold mb-4 fs-4">{titulo}</h3>
          {children}
        </div>
      </div>
    </div>
  )
}
