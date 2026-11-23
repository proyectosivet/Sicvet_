import { useState } from 'react'

/**
 * Página de inicio de sesión.
 *
 * Por ahora solo contiene la vista y la validación básica del formulario.
 * La autenticación real se conectará más adelante en `manejarEnvio`.
 */
export default function PaginaLogin() {
  // ---------------------------------------------------------------------------
  // ESTADO DEL FORMULARIO
  // En React los campos son "controlados": su valor vive en el estado y la
  // pantalla siempre refleja ese valor. Sin `value` + `onChange` no funcionan.
  // ---------------------------------------------------------------------------

  // Texto del campo "Correo o Usuario".
  const [identificador, setIdentificador] = useState('')

  // Texto del campo "Contraseña". Se escribe "contrasena" (sin ñ) para evitar
  // problemas de codificación en nombres de variables.
  const [contrasena, setContrasena] = useState('')

  // ---------------------------------------------------------------------------
  // ESTADO DE LA INTERFAZ
  // ---------------------------------------------------------------------------

  // Controla si la contraseña se muestra como texto o como puntos.
  const [verContrasena, setVerContrasena] = useState(false)

  // Mensaje de error de validación. Vacío = no se muestra.
  const [error, setError] = useState('')

  // ---------------------------------------------------------------------------
  // FUNCIÓN QUE SE EJECUTA AL ENVIAR EL FORMULARIO
  // ---------------------------------------------------------------------------
  function manejarEnvio(evento) {
    // Evita el comportamiento nativo del formulario (recargar la página).
    // Sin esto, React pierde el estado y la pantalla se reinicia.
    evento.preventDefault()

    // Limpia el mensaje anterior en cada intento.
    setError('')

    // `trim()` quita espacios al inicio y al final.
    const identificadorLimpio = identificador.trim()

    // Validación 1: ambos campos son obligatorios.
    if (!identificadorLimpio || !contrasena) {
      setError('Completa todos los campos')
      return
    }

    // Validación 2: longitud mínima de la contraseña.
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    // Aquí se conectará la autenticación real:
    // 1. Enviar las credenciales al backend.
    // 2. Guardar la sesión en el contexto de autenticación.
    // 3. Navegar a la pantalla correspondiente según el rol.
  }

  return (
    // Capa exterior: ocupa toda la altura de la pantalla y aplica el fondo.
    // `sicvet-inline-style-001` viene de styles.css (imagen + cover + fixed).
    <div className="min-vh-100 sicvet-inline-style-001">
      {/* Contenedor de Bootstrap que centra el contenido vertical y horizontalmente. */}
      <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center py-4">
        {/*
          Logo del prototipo.
          Las rutas que empiezan por "/" apuntan a la carpeta `public/`:
          public/assets/... se sirve como /assets/...
        */}
        <img
          src="/assets/dashboard/img/logo.png"
          width="120"
          alt="Logo SICVET"
          className="img-fluid rounded mx-auto d-block mb-3"
        />

        {/* Título y subtítulo con utilidades de Bootstrap. */}
        <div className="text-center">
          <h1>SICVET</h1>
          <p className="text-muted text-secondary small m-0">Sistema de gestión veterinaria</p>
        </div>

        {/*
          Tarjeta del formulario.
          `sicvet-inline-style-002` limita el ancho a 440px (viene de styles.css).
          `p-4 p-sm-5` da un relleno que crece en pantallas grandes.
        */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-sm-5 sicvet-inline-style-002">
          <h3 className="fw-bold mb-4 fs-4">Iniciar Sesión</h3>

          {/*
            `noValidate` desactiva los mensajes automáticos del navegador:
            la validación y los mensajes los controlamos nosotros.
            `onSubmit` se ejecuta al pulsar el botón o presionar Enter.
          */}
          <form onSubmit={manejarEnvio} noValidate>
            {/* ------------------------- Campo: correo o usuario ------------------------- */}
            <div className="mb-3">
              {/*
                `htmlFor` + `id` conectan la etiqueta con el campo.
                Es obligatorio para accesibilidad: al pulsar el texto se enfoca el campo.
              */}
              <label
                htmlFor="identificador"
                className="form-label text-secondary fw-semibold small text-uppercase"
              >
                Correo o Usuario
              </label>

              {/*
                `input-group` es un componente de Bootstrap que une varios
                elementos en un solo control con bordes continuos.
              */}
              <div className="input-group">
                {/* Icono decorativo: aria-hidden evita que el lector de pantalla lo lea. */}
                <span className="input-group-text bg-white border-end-0 text-secondary ps-3">
                  <i className="bi bi-envelope" aria-hidden="true" />
                </span>

                {/*
                  Campo controlado:
                  - `value` muestra el estado.
                  - `onChange` actualiza el estado en cada tecla.
                  - `border-start-0` quita el borde doble junto al icono.
                  - `autoComplete="username"` permite que el navegador lo rellene.
                  - `autoFocus` pone el cursor aquí al cargar la página.
                */}
                <input
                  id="identificador"
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="correo@ejemplo.com"
                  autoComplete="username"
                  autoFocus
                  value={identificador}
                  onChange={(evento) => setIdentificador(evento.target.value)}
                />
              </div>
            </div>

            {/* --------------------------- Campo: contraseña --------------------------- */}
            <div className="mb-2">
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

                {/*
                  `type` cambia dinámicamente según `verContrasena`:
                  'password' oculta los caracteres y 'text' los muestra.
                */}
                <input
                  id="contrasena"
                  type={verContrasena ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0 px-0"
                  autoComplete="current-password"
                  value={contrasena}
                  onChange={(evento) => setContrasena(evento.target.value)}
                  placeholder="Ingrese su contraseña"
                />

                {/*
                  Botón del ojo.
                  `type="button"` es importante: dentro de un formulario, un
                  botón sin tipo se comporta como submit y enviaría el formulario.
                  `sicvet-inline-style-003` aporta cursor:pointer.
                  Se usa un botón (no un span) para que se pueda usar con teclado.
                */}
                <button
                  type="button"
                  className="input-group-text bg-white border-start-0 text-secondary pe-3 sicvet-inline-style-003"
                  onClick={() => setVerContrasena((visible) => !visible)}
                  aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <i
                    className={`bi ${verContrasena ? 'bi-eye-slash' : 'bi-eye'}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {/* Enlace de recuperación: por ahora es un marcador de posición. */}
            <div className="text-end mb-4">
              <a href="#" className="text-decoration-none small fw-semibold">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/*
              Mensaje de error de validación.
              `error && (...)` solo dibuja el bloque si la cadena tiene contenido.
              `role="alert"` hace que el lector de pantalla anuncie el mensaje.
            */}
            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                {error}
              </div>
            )}

            {/*
              `type="submit"` dispara `manejarEnvio`.
              `w-100` hace que ocupe todo el ancho de la tarjeta.
            */}
            <button type="submit" className="btn btn-primary w-100 py-2 rounded-3 fw-semibold fs-6">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
