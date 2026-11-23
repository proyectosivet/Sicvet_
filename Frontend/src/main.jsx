import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
 * Orden de los estilos (importante):
 * 1. Bootstrap: base del diseño que ya tenemos en el prototipo.
 * 2. Bootstrap Icons: los iconos "bi bi-*" usados en todo el HTML.
 * 3. sicvet.css: clases compartidas del prototipo (sicvet-inline-style-*).
 * 4. index.css: nuestros ajustes globales.
 *
 * Si sicvet.css se importa antes que Bootstrap, sus reglas pueden ser
 * sobrescritas por Bootstrap y el diseño se ve distinto.
 */
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/sicvet.css'
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
