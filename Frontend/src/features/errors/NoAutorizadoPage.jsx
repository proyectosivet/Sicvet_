// ============================================================
// PÁGINA 403
// ============================================================
// Se muestra cuando el usuario está autenticado pero su rol no
// tiene permiso para la pantalla solicitada.

import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'

export default function NoAutorizadoPage() {
  return (
    <div>
      <PageHeader titulo="Acceso denegado" />

      <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
        <i
          className="bi bi-shield-lock display-4 text-danger mb-3"
          aria-hidden="true"
        />
        <h4 className="fw-bold mb-2">No tienes permisos</h4>
        <p className="text-secondary mb-4">
          Tu rol no puede acceder a esta sección. Si crees que es un
          error, contacta al administrador.
        </p>
        <Link to="/dashboard" className="btn btn-primary rounded-3">
          Ir al dashboard
        </Link>
      </div>
    </div>
  )
}
