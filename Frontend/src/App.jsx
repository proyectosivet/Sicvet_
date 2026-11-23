import PaginaLogin from './features/auth/PaginaLogin'

/**
 * Punto de entrada de la interfaz.
 *
 * Por ahora la aplicación muestra únicamente el login, para poder revisarlo
 * de forma aislada. Cuando agreguemos el enrutador, este componente solo
 * mostrará el proveedor de rutas y el login pasará a ser una ruta más.
 */
export default function App() {
  return <PaginaLogin />
}
