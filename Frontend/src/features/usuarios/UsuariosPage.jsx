// ============================================================
// PANTALLA DE USUARIOS Y ROLES (SOLO ADMINISTRADOR)
// ============================================================
// Muestra la lista de personas registradas en la veterinaria y
// permite cambiarles el rol desde un menú desplegable.

import { useState } from 'react'
import { toast } from 'sonner'

// Lista inicial de usuarios que aparecen en la tabla.
const USUARIOS_INICIALES = [
  {
    id: 1,
    iniciales: 'AR',
    avatarColor: 'bg-primary',
    nombre: 'Dr. Alejandro Rivas',
    correo: 'a.rivas@sicvet.com',
    rol: 'Veterinario',
    activo: true,
  },
  {
    id: 2,
    iniciales: 'VS',
    avatarColor: 'bg-primary',
    nombre: 'Dra. Valentina Suárez',
    correo: 'v.suarez@sicvet.com',
    rol: 'Veterinario',
    activo: true,
  },
  {
    id: 3,
    iniciales: 'MD',
    avatarColor: 'bg-info',
    nombre: 'Marcos Delgado',
    correo: 'm.delgado@sicvet.com',
    rol: 'Recepcionista',
    activo: true,
  },
  {
    id: 4,
    iniciales: 'MG',
    avatarColor: 'bg-secondary',
    nombre: 'María García López',
    correo: 'maria.garcia@email.com',
    rol: 'Cliente',
    activo: true,
  },
]

const OPCIONES_ROL = [
  'Veterinario',
  'Administrador',
  'Recepcionista',
  'Peluquero',
  'Cliente',
]

// Escoge el color del cuadrito de rol según el puesto de la persona.
function claseBadgeRol(rol) {
  switch (rol) {
    case 'Veterinario':
      return 'bg-success-subtle text-success'
    case 'Administrador':
      return 'bg-primary-subtle text-primary'
    case 'Recepcionista':
      return 'bg-info-subtle text-info'
    case 'Peluquero':
      return 'bg-warning-subtle text-warning-emphasis'
    default:
      return 'bg-secondary-subtle text-secondary'
  }
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES)

  // Cuando el administrador elige otro rol en la lista, lo actualizamos y avisamos.
  function cambiarRol(id, nuevoRol) {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u)),
    )
    toast.success(`Rol actualizado a ${nuevoRol}`)
  }

  return (
    <div>
      {/* Tabla de Usuarios y Roles */}
      <div className="card border-0 shadow-sm rounded-4 p-3">
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr className="text-muted text-uppercase sicvet-inline-style-008">
                <th>USUARIO</th>
                <th>CORREO</th>
                <th>ROL ACTUAL</th>
                <th>ESTADO</th>
                <th className="text-end pe-3">CAMBIAR ROL</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className={`${usuario.avatarColor} text-white rounded-circle d-flex align-items-center justify-content-center fw-bold sicvet-inline-style-009`}
                      >
                        {usuario.iniciales}
                      </div>
                      <strong>{usuario.nombre}</strong>
                    </div>
                  </td>
                  <td className="text-secondary">{usuario.correo}</td>
                  <td>
                    <span
                      className={`badge ${claseBadgeRol(usuario.rol)} rounded-pill px-3 py-2`}
                    >
                      {usuario.rol}
                    </span>
                  </td>
                  <td>
                    <span className="text-success small fw-medium">
                      <i className="bi bi-circle-fill me-1 sicvet-inline-style-017" />{' '}
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="text-end pe-3">
                    <select
                      className="form-select form-select-sm border rounded-3 shadow-none d-inline-block w-auto"
                      value={usuario.rol}
                      onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                      aria-label={`Cambiar rol de ${usuario.nombre}`}
                    >
                      {OPCIONES_ROL.map((rol) => (
                        <option key={rol} value={rol}>
                          {rol}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
