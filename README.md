Tablero de Marcador — Vista Cliente

Interfaz ligera solo-lectura para visualizar un partido en curso: periodo, posesión, puntaje, faltas, bonus, reloj de juego, reloj de tiro (24s) y contador de 8s. Sin controles de edición ni acciones de mesa.

Características

Marcador en vivo: puntos de Local y Visitante.

Periodo actual: 1/4…4/4 u OT en prórrogas.

Posesión: indicador visual (no manipulable).

Bonus: se activa al llegar a ≥ 5 faltas por equipo.

Reloj de juego: MM:SS.

Reloj de tiro: cuenta atrás de 24s.

Conteo de 8 segundos: visible mientras corre.

Tema oscuro/claro con persistencia en localStorage y soporte prefers-color-scheme.

AppBar con brand, toggle de tema y navegación mínima.

Sidebar con sección Marcador (incluye “Partidos”) y Cuenta (Perfil).

Botón “Regresar al Perfil” en vistas cliente.

Responsive y con etiquetas ARIA básicas.

Requisitos

Node.js 18+ y npm

Angular 17+ (standalone components)

Navegador moderno

🚀 Instalación y ejecución
# Instalar dependencias
npm install

# Desarrollo
npm start
# o
ng serve -o

# Producción
npm run build
# o
ng build --configuration production

🗺️ Rutas (cliente)

/seleccion — portada del marcador

/tablero — vista del partido (cliente)

/resultado — pantalla de resultado final

/partidos — listado/cliente de partidos (opcional)

/bienvenida — perfil (Regresar al Perfil apunta aquí)

Las rutas de administración no se muestran en el menú cliente.

Componentes clave
AppComponent (layout)

Barra superior (brand, sección actual, botón de tema).

Sidebar con secciones:

Marcador: Tablero, Partidos

Cuenta: Perfil

Persistencia de tema en localStorage('theme') = 'dark'|'light'.

Añade dark-theme / light-theme a document.documentElement.

Snippet — tema (TS):

toggleTheme() {
  this.isDarkMode.update(v => !v);
  localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  this.applyTheme();
}

private applyTheme() {
  const root = document.documentElement;
  root.classList.remove('dark-theme', 'light-theme');
  root.classList.add(this.isDarkMode() ? 'dark-theme' : 'light-theme');

  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (meta) meta.content = this.isDarkMode() ? '#0b1224' : '#ffffff';
}

HomePageComponent (marcador cliente)

Solo lectura de:

scoreLocal, scoreVisit

foulsLocal, foulsVisit, BONUS

quarter

possession (local | visit | none) — sin handlers de click

timerSeconds (reloj de juego)

shotClock() (24s)

showBackcourt8() y backcourtSeconds() (8s)

Botón “Regresar al Perfil” → /bienvenida.

Snippet — botón volver (HTML):

<footer class="client-footer">
  <button class="btn" routerLink="/bienvenida" aria-label="Regresar al perfil">Regresar</button>
</footer>

Contrato de estado (consumido por cliente)

Estos campos deben estar disponibles (p. ej., vía facade/servicio o router.getCurrentNavigation()?.extras.state):

type ClientScoreboardState = {
  locNombre: string;                    // nombre de la localidad/recinto
  quarter: number;                      // 1..4, >4 => OT
  possession: 'local' | 'visit' | 'none';
  timerSeconds: number;                 // reloj de juego en segundos
  shotClock: number;                    // reloj de tiro 24s
  backcourtSeconds: number | null;      // 8s: null si no corre
  local: { nombre: string; puntos: number; faltas: number; };
  visit: { nombre: string; puntos: number; faltas: number; };
};


El cliente no muta este estado; solo lo muestra.

Estilos y tema

El tema se controla por clases en <html>: dark-theme / light-theme.

Variables CSS (token design) cambian con el tema.

El AppBar usa backdrop-filter y degradados suaves.

Sidebar con secciones y resaltes (hover/active) + soporte responsive.

Snippet — raíz de tema (CSS):

:root,
.dark-theme {
  --bg: rgba(12, 15, 23, 0.94);
  --border: #2c3654;
  --text: #eaf0f6;
  --muted: #a8b0c3;
  --accent: #2b78e4;
  --chip: #1a2133;
}

.light-theme {
  --bg: rgba(248, 250, 252, 0.94);
  --border: #e2e8f0;
  --text: #1e293b;
  --muted: #64748b;
  --accent: #3b82f6;
  --chip: #f8fafc;
}

🧭 Sidebar (sección “Marcador”)

Estructura mínima esperada del servicio de navegación (NavigationService) tras filtrado cliente:

type NavigationItem = { label: string; route: string };
type NavigationSection = { title: string; items: NavigationItem[] };

[
  {
    title: 'Marcador',
    items: [
      { label: 'Tablero', route: '/tablero' },
      { label: 'Partidos', route: '/partidos' }
    ]
  },
  {
    title: 'Cuenta',
    items: [{ label: 'Perfil', route: '/bienvenida' }]
  }
]

Accesibilidad (A11y)

aria-label y aria-live="polite" en contadores.

Botones con title/aria-label.

Indicadores bonus/posesión con texto accesible.

Contraste adecuado en ambos temas.

Pruebas manuales rápidas

Cambiar tema y recargar: debe persistir.

Simular estado con bonus (faltas >= 5): aparece badge BONUS.

possession = 'local' | 'visit' | 'none': cambia el indicador visual; no debe ser clickeable.

backcourtSeconds: null oculta la cápsula; valores 8→0 la muestran.

“Regresar” navega a /bienvenida.

🛠️ Scripts útiles
npm run lint
npm run build
npm run start
