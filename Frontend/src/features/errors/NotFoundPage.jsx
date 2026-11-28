// ============================================================
// PÁGINA 404
// ============================================================
// Se muestra cuando la ruta no existe.

import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center sicvet-inline-style-002">
        <i
          className="bi bi-compass display-4 text-primary mb-3"
          aria-hidden="true"
        />
        <h1 className="fw-bold mb-2">404</h1>
        <p className="text-secondary mb-4">
          La página que buscas no existe o fue movida.
        </p>
        <Link to="/dashboard" className="btn btn-primary rounded-3">
          Volver al dashboard
        </Link>
      </div>
    </div>
  )
}
