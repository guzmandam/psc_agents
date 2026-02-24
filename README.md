# PSC — Protocolo de Síntesis Crítica

Simulación interactiva basada en el modelo de Schelling para estudiar la segregación ideológica y el efecto de recompensar el Steel-manning (síntesis de posturas opuestas) en lugar de la coincidencia de opiniones.

## Descripción

El **Protocolo de Síntesis Crítica (PSC)** es un modelo de interacción social que combate la formación de burbujas de eco mediante la reingeniería de incentivos: los agentes ganan estatus al comprender y validar posturas opuestas, no al rodearse de quienes piensan igual.

La app incluye:

- **Cuadrícula de agentes** con ideología continua (Bando A ↔ Bando B), estatus y tolerancia
- **Hiperparámetros** ajustables: costo de síntesis, incentivo de estatus, anonimato, rigidez ideológica, densidad de población
- **Escenarios predefinidos**: Mercado de Estatus, Fatiga del Diálogo, Velo Total
- **KPIs en tiempo real**: Índice de Schelling, tasa Steel-manning, distancia ideológica media, movilidad forzada
- **Guía integrada** y tooltips (icono ℹ) en cada parámetro
- **Modo oscuro** y **esquemas de color** personalizables para los agentes

El diseño teórico completo está en [PROJECT.md](./PROJECT.md).

## Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4** (vía `@tailwindcss/vite`)
- **Zustand** (estado global)
- Lógica de simulación en JS puro (`src/core/`)

## Requisitos

- Node.js 20+ (recomendado 20.19+ o 22.12+ para Vite 7)
- npm

## Instalación y uso

```bash
# Clonar (o navegar al directorio del proyecto)
cd PSC_agents

# Instalar dependencias
npm install

# Desarrollo (hot reload)
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

Tras `npm run dev`, la app suele estar en `http://localhost:5173`.

## Estructura del proyecto

```
src/
  core/           # Lógica de simulación (independiente de la UI)
    Agent.js
    SimulationManager.js
    config.js     # Constantes de cuadrícula, presets de color, helpers RGB
  store/
    useStore.js   # Estado global (Zustand): hiperparámetros, métricas, agentes, UI
  components/
    ControlPanel.jsx    # Sliders, escenarios, esquema de colores, dark mode
    GridCanvas.jsx     # Renderizado en canvas de la cuadrícula y agentes
    MetricsDashboard.jsx  # KPIs con interpretación por rangos y detalle expandible
    SimulationGuide.jsx   # Guía en acordeón (objetivo, agentes, bandos, etc.)
  App.jsx
  main.jsx
  index.css
```

## Despliegue

El proyecto está disponible en producción en <a href="https://psc-agents.bdswtechstuff.workers.dev/" target="_blank" rel="noopener noreferrer">Cloudflare Pages &rarr; psc-agents.bdswtechstuff.workers.dev</a>.

## Licencia

Proyecto de código abierto; revisa el repositorio para términos concretos si los hubiera.
