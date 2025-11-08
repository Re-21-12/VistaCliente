### Manual Tecnico
### Estructura del Repositorio
frontTablero/
├── .github/
│   └── workflows/
│       └── docker-publish.yml
│
├── .vs/
│   ├── CopilotIndices/17.13.433.20974/
│   ├── CodeChunks.db
│   ├── SemanticSymbols.db
│   ├── FileContentIndex
│   ├── 86acaba6-6231-4d72-bbeb-bb022c54af82.vsidx
│   ├── v17/
│   ├── .wsuo
│   ├── DocumentLayout.json
│   ├── ProjectSettings.json
│   ├── VSWorkspaceState.json
│   └── slnx.sqlite
│
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   │
│   ├── environments/
│   │   └── environment.ts
│   │
│   ├── app/
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── core/
│   │   ├── guards/
│   │   │   ├── permission.guard.ts
│   │   │   ├── rol.guard.spec.ts
│   │   │   └── rol.guard.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   └── loading.interceptor.ts
│   │   │
│   │   ├── interfaces/
│   │   │   ├── auth-interface.ts
│   │   │   ├── imagen.ts
│   │   │   ├── models.ts
│   │   │   ├── navigation.interface.ts
│   │   │   ├── permiso.ts
│   │   │   ├── role.ts
│   │   │   └── usuario.ts
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── country.service.ts
│   │   │   ├── cuarto.service.ts
│   │   │   ├── equipo.service.ts
│   │   │   ├── imagen.service.ts
│   │   │   ├── jugador.service.ts
│   │   │   ├── loading.service.ts
│   │   │   ├── localidad.service.ts
│   │   │   ├── navigation.service.ts
│   │   │   ├── partido.service.ts
│   │   │   ├── permiso.service.ts
│   │   │   ├── permission.service.ts
│   │   │   ├── reporte.service.ts
│   │   │   ├── rol.service.ts
│   │   │   ├── role.service.ts
│   │   │   ├── socket.service.ts
│   │   │   ├── tablero.service.ts
│   │   │   └── usuario.service.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── permissions.ts
│   │   │   └── tablero.facade.ts
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── admin-page.component.css
│   │   │   ├── admin-page.component.html
│   │   │   └── admin-page.component.ts
│   │   │
│   │   ├── bienvenida-page/
│   │   │   ├── bienvenida-page.component.css
│   │   │   ├── bienvenida-page.component.html
│   │   │   └── bienvenida-page.component.ts
│   │   │
│   │   ├── equipos/
│   │   │   ├── equipos-page.component.css
│   │   │   ├── equipos-page.component.html
│   │   │   └── equipos-page.component.ts
│   │   │
│   │   ├── historial/
│   │   │   ├── historial.component.css
│   │   │   ├── historial.component.html
│   │   │   ├── historial.component.spec.ts
│   │   │   └── historial.component.ts
│   │   │
│   │   ├── home/
│   │   │   ├── home-page.component.css
│   │   │   ├── home-page.component.html
│   │   │   └── home-page.component.ts
│   │   │
│   │   ├── jugadores/
│   │   │   ├── jugadores-page.component.css
│   │   │   ├── jugadores-page.component.html
│   │   │   └── jugadores-page.component.ts
│   │   │
│   │   ├── localidades/
│   │   │   ├── localidades-page.component.css
│   │   │   ├── localidades-page.component.html
│   │   │   └── localidades-page.component.ts
│   │   │
│   │   ├── login/
│   │   │   ├── login.component.css
│   │   │   ├── login.component.html
│   │   │   ├── login.component.spec.ts
│   │   │   └── login.component.ts
│   │   │
│   │   ├── mcp-chat/
│   │   │   ├── mcp-chat.component.css
│   │   │   ├── mcp-chat.component.html
│   │   │   ├── mcp-chat.component.spec.ts
│   │   │   └── mcp-chat.component.ts
│   │   │
│   │   ├── partidos/
│   │   │   ├── partidos-page.component.css
│   │   │   ├── partidos-page.component.html
│   │   │   └── partidos-page.component.ts
│   │   │
│   │   ├── recursos/
│   │   │   ├── imagenes/
│   │   │   │   ├── imagenes.component.css
│   │   │   │   ├── imagenes.component.html
│   │   │   │   └── imagenes.component.ts
│   │   │
│   │   │   ├── recursos-page.component.css
│   │   │   ├── recursos-page.component.html
│   │   │   └── recursos-page.component.ts
│   │   │
│   │   ├── register/
│   │   │   ├── register.component.css
│   │   │   ├── register.component.html
│   │   │   ├── register.component.spec.ts
│   │   │   └── register.component.ts
│   │   │
│   │   ├── resultado-page/
│   │   │   ├── resultado-page.component.css
│   │   │   ├── resultado-page.component.html
│   │   │   ├── resultado-page.component.spec.ts
│   │   │   └── resultado-page.component.ts
│   │   │
│   │   ├── seguridad-admin/
│   │   │   ├── permisos/
│   │   │   │   ├── permisos.component.css
│   │   │   │   ├── permisos.component.html
│   │   │   │   └── permisos.component.ts
│   │   │
│   │   │   ├── roles/
│   │   │   │   ├── roles.component.css
│   │   │   │   ├── roles.component.html
│   │   │   │   └── roles.component.ts
│   │   │
│   │   │   └── seguridad-admin-page/
│   │   │       ├── seguridad-admin-page.component.css
│   │   │       ├── seguridad-admin-page.component.html
│   │   │       └── seguridad-admin-page.component.ts
│   │   │
│   │   ├── usuarios/
│   │   │   ├── usuarios.component.css
│   │   │   ├── usuarios.component.html
│   │   │   └── usuarios.component.ts
│   │   │
│   │   └── seleccion/
│   │       ├── seleccion.component.css
│   │       ├── seleccion.component.html
│   │       ├── seleccion.component.spec.ts
│   │       └── seleccion.component.ts
│
├── shared/
│   ├── notify.service.spec.ts
│   ├── notify.service.ts
│   └── shared/components/global-loader/
│       ├── global-loader.component.css
│       ├── global-loader.component.html
│       └── global-loader.component.ts
│
├── assets/
│   └── sounds/
│       ├── end.mp3
│       └── start.mp3
│
├── .editorconfig
├── .gitignore
├── Dockerfile
├── README.md
├── angular.json
├── nginx-default.conf
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json

### Diagrama de arquitectura
flowchart LR
    A[Usuario / Navegador] --> B[FrontTablero - Angular 17+]

    B -->|Consumo REST| C[Back-Tablero API (.NET 8)]
    C --> D[SQL Server]

    C -->|Emisión eventos| E[Redis Cache]
    C -->|CDC / ETL| F[ETL Stack - Replicator]

    F --> G[PostgreSQL DW]

    B -->|Auth| H[Keycloak / Proxy Auth]

### Detalle de microservicios y lenguajes
 ## Frontend: FrontTablero
   • Framework: Angular 17 (Standalone Components)
   • Lenguaje: TypeScript
   • Patrón: Servicios + Interceptores + Guards
   • Autenticación: Keycloak / JWT
   • Renderizado en tiempo real: WebSocket (SocketService)
   • Manejo de roles: PermissionService + Guards
   • Módulos principales:
        - Administración (equipos, jugadores, localidades, partidos)
        - Tablero en tiempo real (puntos, faltas, reloj)
        - Seguridad y roles
        - Reportes
        - MCP Chat (modulo de mensajería/chat)
 ## Backend relacionado
Aunque este documento es del frontend, se mencionan los servicios que consume:
   • Back-Tablero API (ASP.NET Core + SQL Server)
   • Mailer Service (PHP o Node, según el proyecto)
   • Admin Proxy Keycloak (NestJS)
   • WebSocket Server (Node)     

### Cómo levantar el sistema localmente 
 # Requisitos
   • Node.js 18+
   • Angular CLI
   • Git
   • Docker 
 # Instalación
git clone <url-del-repo>
cd frontTablero
npm install
 # Modo Desarrollo
ng serve -o
 - Acceso en:
http://localhost:4200
 # Construir producción
ng build --configuration production
 # Ejecutar con Docker
docker build -t front-tablero .
docker run -d -p 80:80 front-tablero
 # Puertos del sistema
| Servicio         | Puerto      |
| ---------------- | ----------- |
| Frontend Angular | 4200 / 80   |
| Backend .NET API | 5000 / 5001 |
| Keycloak         | 8080        |
| WebSocket        | 3000        |
| Redis            | 6379        |

### Especificación de endpoints por microservicio
Estos endpoint son consumidos desde Angular (no expuestos):
 # Autenticación (/api/Auth)
   • POST /login
   • POST /refresh
 # Usuarios (/api/Usuario)
   • GET /
   • POST /
   • PUT /{id}
 # Equipos (/api/Equipo)
   • GET /
   • POST /
 # Jugadores (/api/Jugador)
   • GET /
   • POST /
 # Partidos (/api/Partido)
   • GET /
   • POST /
   • GET /tablero/{id}
 # Tablero (/api/Tablero)
   • POST /punto
   • POST /falta
   • POST /cuarto
 # Reportes (/api/Reporte)
   • GET /estadisticas
   • GET /historial

### Seguridad
FrontTablero utiliza un flujo híbrido:
 # Autenticación
   • Login contra Back-Tablero (AuthController)
   • El backend valida con Keycloak
 # Interceptores 
________________________________________________________
auth.interceptor.ts      → Inserta JWT en cada solicitud
error.interceptor.ts     → Maneja 401, 403, 500
loading.interceptor.ts   → Indicador de carga global
 
# Guards
   • permission.guard.ts → Bloquea rutas sin permisos
   • rol.guard.ts → Controla acceso por roles
   • Roles típicos:
        - admin
        - marcador
        - operador
        - consulta
 # Almacenamiento de tokens
   • LocalStorage
   • Expira según configuración del Backend / Keycloak

### Bibliotecas/librerías utilizadas
 # Angular / TypeScript
   • Angular 17
   • RxJS
   • HttpClient
   • Standalone Components
   • Guards & Interceptors
 # Seguridad
   • Keycloak JS Adapter
   • JWT
 # UI
   • HTML/CSS puro
   • Angular templates
   • Componentes propios (no usa Material)
 # WebSocket
   • Socket.IO Client (en socket.service.ts)
 # Backend Integrado
   • API .NET 8
   • SQL Server
   • Redis (caching)
   • WebSockets

### Posibles errores y soluciones
- Error: “CORS blocked”
- Solución:
  Activar CORS en el backend o ajustar proxy.conf.json.
-Error: “401 Unauthorized”
-Causas:
  Token expirado
  Usuario sin permisos
-Solución:
  Revisar Keycloak
  Revisar roles
  Renovar sesión
-Error: WebSocket no conecta
-Solución:
  Verificar URL en socket.service.ts
  Revisar puerto 3000
  Revisar firewall
-Error: "Cannot GET /ruta"
-Solución:
  Configurar correctamente nginx-default.conf si se usa Docker.
-Error: Servicios no cargan datos
-Solución:
  Revisar environment.ts
  Confirmar URL del backend
  Revisar logs del backend

### Flujo de Operación del Tablero
sequenceDiagram
______________________________________________________
Frontend ->> Backend: Solicitar estado del partido
Backend ->> SQL Server: Leer estado actual
Backend ->> Frontend: Retornar datos
Frontend ->> WebSocket: Suscribirse a eventos
WebSocket ->> Frontend: Actualizaciones en tiempo real

 # Ciclo de Desarrollo
   • Crear componente → ng generate component
   • Crear servicio → ng generate service
   • Consumir API por HttpClient
   • Aplicar permisos con guards
   • Integrar WebSocket
   • Construcción → Docker
   • Despliegue → VPS / Nginx
