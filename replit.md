# PSC Simulation

## Overview
Protocolo de Síntesis Crítica (PSC) — A Schelling-based agent simulation modeling ideological segregation dynamics vs. intellectual rigor (Steel-manning). Built with React + Vite + TailwindCSS + Zustand.

## Project Structure
- `src/` — React source code
  - `components/` — UI components
    - `ControlPanel.jsx` — Simulation controls, hyperparameter sliders, color scheme picker
    - `GridCanvas.jsx` — 2D canvas grid rendering agents
    - `NetworkGraph3D.jsx` — 3D force-directed graph visualization (react-force-graph-3d + Three.js)
    - `MetricsDashboard.jsx` — KPI cards (Schelling index, steel-manning rate, etc.)
    - `InteractionAnalytics.jsx` — Interaction breakdown: alike vs counter agents, success rates
    - `SimulationGuide.jsx` — Educational documentation/guide
  - `core/` — Simulation logic
    - `Agent.js` — Agent model (ideology, status, tolerance, interaction counters)
    - `SimulationManager.js` — Tick-based simulation (evaluation, movement, synthesis, interaction tracking)
    - `config.js` — Grid dimensions, tick interval, color presets, color utilities
  - `store/` — Zustand state store (agents, metrics, interactionEdges, interactionStats)
- `public/` — Static assets
- `index.html` — Entry point

## Tech Stack
- **Framework**: React 19 + Vite 7
- **Styling**: TailwindCSS v4 (via @tailwindcss/vite plugin)
- **State**: Zustand v5
- **3D Visualization**: react-force-graph-3d + Three.js
- **Icons**: lucide-react
- **Deployment**: Cloudflare Workers (@cloudflare/vite-plugin)

## Development
- Run: `npm run dev` → serves on `0.0.0.0:5000`
- Build: `npm run build` → outputs to `dist/`

## Features
- **2D Grid View**: Canvas-based Schelling grid with color-coded agents
- **3D Network Graph**: Force-directed 3D graph showing agents as nodes, interactions as edges
- **View Toggle**: Switch between 2D grid and 3D network views
- **Interaction Analytics**: Per-tick and cumulative stats on alike vs counter-agent interactions
- **Metrics Dashboard**: Schelling index, steel-manning rate, ideological distance, forced mobility

## Configuration
- `vite.config.js`: Configured for Replit (host: 0.0.0.0, port: 5000, allowedHosts: true) + Cloudflare plugin
- Deployment: Static site (builds to `dist/`)
