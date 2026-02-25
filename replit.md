# PSC Simulation

## Overview
Protocolo de Síntesis Crítica (PSC) — A Schelling-based agent simulation modeling ideological segregation dynamics vs. intellectual rigor (Steel-manning). Built with React + Vite + TailwindCSS + Zustand.

## Project Structure
- `src/` — React source code
  - `components/` — UI components (ControlPanel, GridCanvas, MetricsDashboard, SimulationGuide)
  - `core/` — Simulation logic (Agent, SimulationManager, config)
  - `store/` — Zustand state store
- `public/` — Static assets
- `index.html` — Entry point

## Tech Stack
- **Framework**: React 19 + Vite 7
- **Styling**: TailwindCSS v4 (via @tailwindcss/vite plugin)
- **State**: Zustand v5
- **Icons**: lucide-react

## Development
- Run: `npm run dev` → serves on `0.0.0.0:5000`
- Build: `npm run build` → outputs to `dist/`

## Configuration
- `vite.config.js`: Configured for Replit (host: 0.0.0.0, port: 5000, allowedHosts: true)
- Deployment: Static site (builds to `dist/`)
