// ============================================================
// CONTEXTO DE AUTENTICACIÓN (definición)
// ============================================================
// Este archivo solo crea el contexto y el hook useAuth. Se separa
// del proveedor (AuthContext.jsx) para que Vite/ESLint distingan
// componentes de utilidades y para evitar dependencias circulares.

import { createContext, useContext } from 'react'

// Valor por defecto null: si alguien usa useAuth fuera del
// proveedor, lo detectamos con un error claro.
export const AuthContext = createContext(null)

// Hook de acceso al contexto de autenticación.
export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return contexto
}
