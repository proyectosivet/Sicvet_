// ============================================================
// PÁGINA DE PERFIL
// ============================================================
// Reúne el formulario de datos personales y el de cambio de
// contraseña.

import PageHeader from '../../components/ui/PageHeader'
import CambiarPasswordForm from './components/CambiarPasswordForm'
import PerfilForm from './components/PerfilForm'

export default function PerfilPage() {
  return (
    <div>
      <PageHeader
        titulo="Mi perfil"
        descripcion="Actualiza tus datos personales y tu contraseña."
      />

      <div className="row g-4">
        {/* Datos personales. */}
        <div className="col-12 col-lg-7">
          <PerfilForm />
        </div>

        {/* Seguridad. */}
        <div className="col-12 col-lg-5">
          <CambiarPasswordForm />
        </div>
      </div>
    </div>
  )
}
