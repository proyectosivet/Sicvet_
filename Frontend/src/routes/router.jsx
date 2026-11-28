// ============================================================
// ENRUTADOR PRINCIPAL
// ============================================================
// Define las rutas públicas (auth) y privadas (aplicación).

import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { rutaInicioPorRol } from '../lib/navigation'

// Páginas públicas.
import LoginPage from '../features/auth/LoginPage'
import RegistroPage from '../features/auth/RegistroPage'
import RecuperarPage from '../features/auth/RecuperarPage'

// Páginas privadas implementadas.
import AgendaPage from '../features/agenda/AgendaPage'
import HistorialCitasPage from '../features/citas/HistorialCitasPage'
import NuevaCitaPage from '../features/citas/NuevaCitaPage'
import ClientesPage from '../features/clientes/ClientesPage'
import DashboardPage from '../features/dashboard/DashboardPage'
import MascotasPage from '../features/mascotas/MascotasPage'
import PerfilPage from '../features/perfil/PerfilPage'
import ServiciosPage from '../features/servicios/ServiciosPage'
import UsuariosPage from '../features/usuarios/UsuariosPage'

// Estructura y protecciones.
import AppLayout from '../layouts/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleGate from './RoleGate'

// Páginas de error.
import NotFoundPage from '../features/errors/NotFoundPage'

import { ROLES } from '../lib/roles'

function InicioPorRol() {
  const { usuario } = useAuth()
  return <Navigate to={rutaInicioPorRol(usuario?.rol)} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* -------------------- Rutas públicas -------------------- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/recuperar" element={<RecuperarPage />} />

      {/* -------------------- Rutas privadas -------------------- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Al entrar a "/" redirige a la vista principal del rol. */}
          <Route path="/" element={<InicioPorRol />} />

          {/* Dashboard: todos los roles. */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Agenda: solo personal de la clínica. */}
          <Route
            path="/agenda"
            element={
              <RoleGate
                roles={[
                  ROLES.ADMINISTRADOR,
                  ROLES.RECEPCIONISTA,
                  ROLES.VETERINARIO,
                  ROLES.PELUQUERO,
                ]}
              >
                <AgendaPage />
              </RoleGate>
            }
          />

          {/* Clientes: administrador y recepcionista. */}
          <Route
            path="/clientes"
            element={
              <RoleGate
                roles={[ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA]}
              >
                <ClientesPage />
              </RoleGate>
            }
          />

          {/* Mascotas: todos (el cliente ve las suyas). */}
          <Route path="/mascotas" element={<MascotasPage />} />

          {/* Servicios: todos pueden consultarlos. */}
          <Route path="/servicios" element={<ServiciosPage />} />

          {/* Historial / mis citas. */}
          <Route path="/citas" element={<HistorialCitasPage />} />

          {/* Nueva cita: administrador, recepción y cliente. */}
          <Route
            path="/citas/nueva"
            element={
              <RoleGate
                roles={[
                  ROLES.ADMINISTRADOR,
                  ROLES.RECEPCIONISTA,
                  ROLES.CLIENTE,
                ]}
              >
                <NuevaCitaPage />
              </RoleGate>
            }
          />

          {/* Usuarios: solo administrador. */}
          <Route
            path="/usuarios"
            element={
              <RoleGate roles={[ROLES.ADMINISTRADOR]}>
                <UsuariosPage />
              </RoleGate>
            }
          />

          {/* Perfil: todos los roles. */}
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>
      </Route>

      {/* Cualquier ruta desconocida muestra 404. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
