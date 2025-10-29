# Tablero de Marcador — Vista Cliente

Interfaz de solo lectura para visualizar un partido en curso: periodo, posesión, puntaje, faltas, bonus, reloj de juego, reloj de tiro (24s) y contador de 8s. Sin controles de edición.

# Características

Marcador en vivo: puntos de Local y Visitante.

Periodo actual: 1/4…4/4 u OT en prórrogas.

Posesión: indicador visual (local | visit | none) no manipulable.

Bonus: se activa con 5 o más faltas por equipo.

Reloj de juego: MM:SS.

Reloj de tiro: cuenta atrás de 24 s.

Conteo de 8 segundos: visible cuando está activo.

Tema oscuro/claro con persistencia en localStorage y soporte prefers-color-scheme.

AppBar con marca, conmutador de tema y navegación mínima.

Sidebar con sección Marcador (incluye Partidos) y Cuenta (Perfil).

Botón Regresar al Perfil en las vistas cliente.

Diseño responsive y etiquetas ARIA básicas.

# Requisitos

Node.js 18 o superior

npm

Angular 17 o superior (standalone components)

Navegador moderno

Instalación y ejecución
# Instalar dependencias
npm install

# Desarrollo
npm start
# Ejecutar
ng serve -o

# Producción
npm run build
# Constructor
ng build --configuration production

# Rutas (cliente)

/seleccion — portada del marcador

/tablero — vista del partido (cliente, solo lectura)

/resultado — pantalla de resultado final

/partidos — listado/cliente de partidos

/bienvenida — perfil (objetivo de “Regresar al Perfil”)

Las rutas de administración no se muestran en el menú cliente.
