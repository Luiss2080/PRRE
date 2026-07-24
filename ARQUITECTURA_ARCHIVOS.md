# Arquitectura de archivos - PRRE

Este documento describe la estructura del proyecto y el motivo de cada carpeta/archivo principal para facilitar mantenimiento, onboarding y escalabilidad.

## 1) Raíz del proyecto

### `index.html`
Plantilla HTML base que Vite usa como punto de entrada en desarrollo y build.

**Por qué existe:** separa la capa de documento web del código React, permitiendo que la app se monte dinámicamente en un contenedor (`#root`) y que Vite inyecte scripts optimizados.

### `package.json`
Define metadatos del proyecto, scripts (`dev`, `build`, `preview`, etc.) y dependencias.

**Por qué existe:** centraliza la gestión del ciclo de vida del proyecto (instalación, ejecución, compilación) y garantiza reproducibilidad del entorno.

### `package-lock.json`
Bloquea versiones exactas de dependencias instaladas.

**Por qué existe:** evita diferencias entre entornos (tu máquina, CI/CD, producción), reduciendo errores por cambios de versiones transitorias.

### `vite.config.js`
Configuración de Vite (build, dev server, alias, plugins, etc. según uso del proyecto).

**Por qué existe:** encapsula decisiones de tooling para adaptar rendimiento y comportamiento del bundler sin ensuciar código de aplicación.

### `netlify.toml`
Configuración de despliegue en Netlify (build command, publish dir, redirects, headers).

**Por qué existe:** define infraestructura como código para despliegues consistentes y versionados.

### `README.md`
Documentación general del proyecto.

**Por qué existe:** punto de entrada para desarrolladores con contexto funcional y técnico inicial.

### `.gitignore`
Lista de archivos/carpetas que Git no debe versionar (`node_modules`, builds, temporales, etc.).

**Por qué existe:** mantiene el repositorio limpio y evita subir artefactos generados o sensibles.

### `.oxlintrc.json`
Archivo de configuración de linting/formato estático (según la herramienta usada por el equipo).

**Por qué existe:** estandariza reglas de calidad y estilo para reducir deuda técnica y discusiones de formato.

### `.git/`
Metadatos internos de Git.

**Por qué existe:** habilita versionado, ramas, historial y colaboración.

### `node_modules/`
Dependencias instaladas localmente por npm.

**Por qué existe:** almacena paquetes requeridos para ejecutar y compilar la aplicación.

### `dist/`
Salida de build de producción generada por Vite.

**Por qué existe:** contiene archivos optimizados listos para servir en hosting/CDN.

---

## 2) Recursos estáticos

### `public/`
Archivos públicos servidos tal cual (sin pasar por el pipeline de transformación de Vite).

**Por qué existe:** ideal para recursos estáticos con rutas estables, favicons o assets que deben conservar nombre/ruta exacta.

### `public/img/`
Imágenes de uso público (`Colegio.jpeg`, logos, etc.).

**Por qué existe:** agrupa material gráfico accesible por URL directa y simplifica referencias estáticas.

### `public/favicon.svg`, `public/icons.svg`
Íconos y favicon de la aplicación.

**Por qué existe:** separa branding e iconografía global del código de interfaz.

### `img/`
Repositorio adicional de imágenes a nivel raíz (duplicadas o de trabajo según el flujo del proyecto).

**Por qué existe:** suele funcionar como banco de recursos visuales para diseño, prototipado o migración de assets.

> Recomendación arquitectónica: consolidar una sola fuente de verdad para imágenes (`public/img` o `src/assets`) para evitar duplicados y confusión.

---

## 3) Código fuente React

### `src/`
Núcleo de la aplicación cliente.

**Por qué existe:** separa código mantenible (componentes, contexto, utilidades, estilos) de configuración e infraestructura.

### `src/principal.jsx`
Punto de arranque de React (bootstrapping), donde se monta la app en el DOM.

**Por qué existe:** centraliza la inicialización de proveedores globales y render principal.

### `src/Aplicacion.jsx`
Componente raíz de negocio/presentación.

**Por qué existe:** organiza composición de módulos, layout global y flujo principal de la interfaz.

### `src/index.css`
Estilos globales base (reset, variables globales, tipografía general).

**Por qué existe:** define lineamientos visuales transversales para toda la app.

### `src/Aplicacion.css`
Estilos específicos del componente raíz o layout general.

**Por qué existe:** mantiene separación de responsabilidades entre estilo global y estilo de alto nivel de aplicación.

### `src/assets/`
Activos importados desde el código fuente (si aplica).

**Por qué existe:** recursos que sí deben pasar por el bundler (hashing, optimización y control por imports).

---

## 4) Componentes de interfaz

### `src/components/`
Contiene componentes reutilizables y módulos funcionales de la UI.

**Por qué existe:** modulariza la interfaz por dominio funcional, facilitando mantenimiento, pruebas y evolución incremental.

### `CatalogoRecursos.jsx`
Vista o sección para consultar/listar recursos.

**Por qué existe:** encapsula lógica de visualización y reglas de interacción del catálogo.

### `DisenoEstructura.jsx`
Componente orientado a estructura visual/distribución.

**Por qué existe:** separa decisiones de layout y presentación de la lógica de negocio.

### `ModalAutenticacion.jsx`
Modal de login/autenticación.

**Por qué existe:** encapsula la experiencia de autenticación como unidad reutilizable y desacoplada.

### `ModuloAyuda.jsx`
Sección de ayuda al usuario.

**Por qué existe:** desacopla contenido asistivo del resto de módulos operativos.

### `ModuloEspacios.jsx`
Gestión/consulta de espacios.

**Por qué existe:** delimita un subdominio funcional específico dentro de la app.

### `ModuloHistorial.jsx`
Visualización de historial de acciones o reservas.

**Por qué existe:** separa trazabilidad/auditoría de los flujos de operación activos.

### `ModuloRecursos.jsx`
Gestión/consulta de recursos.

**Por qué existe:** concentra reglas de negocio y UI relacionadas con recursos.

### `ModuloReportes.jsx`
Generación o visualización de reportes.

**Por qué existe:** aísla analítica/reporting, que suele evolucionar con requerimientos propios.

### `ModuloReservas.jsx`
Flujo de reservas.

**Por qué existe:** encapsula el proceso central de reserva para mantener cohesión funcional.

### `ModuloRoles.jsx`
Administración o visualización de roles/permisos.

**Por qué existe:** desacopla control de acceso y responsabilidades de usuario del resto de la interfaz.

### `PanelControl.jsx`
Dashboard o panel principal.

**Por qué existe:** actúa como hub de navegación/estado para conectar módulos.

### `PantallaCarga.jsx`
Pantalla de carga/splash.

**Por qué existe:** mejora UX durante inicialización o carga de datos.

---

## 5) Estado global (Context API)

### `src/context/`
Proveedores y contextos globales de React.

**Por qué existe:** evita prop drilling y centraliza estados transversales a múltiples componentes.

### `ContextoAutenticacion.jsx`
Estado y acciones de autenticación (sesión, usuario, permisos, etc.).

**Por qué existe:** unifica la gestión de acceso y permite que toda la app consuma el mismo estado de auth.

### `ContextoTema.jsx`
Estado de tema/apariencia (por ejemplo claro/oscuro o variantes visuales).

**Por qué existe:** mantiene consistencia visual y facilita cambio de tema desde cualquier parte de la app.

---

## 6) Utilidades y datos

### `src/utils/`
Funciones auxiliares y recursos de soporte desacoplados de la UI.

**Por qué existe:** promueve reutilización y reduce duplicación de lógica transversal.

### `datosSimulados.js`
Datos mock para desarrollo/pruebas locales.

**Por qué existe:** permite avanzar en UI y flujos sin depender de backend real en etapas tempranas o entornos offline.

---

## 7) Criterio arquitectónico general del proyecto

La estructura sigue una organización por capas y responsabilidades:

1. **Infraestructura y tooling** en raíz (`package.json`, `vite.config.js`, `netlify.toml`).
2. **Código de aplicación** en `src` (componentes, estado global, utilidades).
3. **Assets estáticos** en `public`/`img`.
4. **Artefactos generados** fuera del código fuente (`dist`, `node_modules`).

Este enfoque mejora:

- **Mantenibilidad:** cada archivo tiene una responsabilidad clara.
- **Escalabilidad:** se pueden agregar nuevos módulos en `src/components` sin romper el orden.
- **Onboarding:** un nuevo integrante entiende rápido dónde tocar cada cosa.
- **Despliegue confiable:** configuración explícita para build y hosting.

---

## 8) Mejora sugerida (opcional)

Para crecer sin fricción, se podría evolucionar a una estructura por features, por ejemplo:

- `src/features/reservas/...`
- `src/features/recursos/...`
- `src/shared/components/...`
- `src/shared/utils/...`

Con esto, cada dominio encapsula UI, hooks, servicios y tests en un mismo lugar, reduciendo acoplamiento entre módulos.
