import React, { useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { GridCanvas } from './components/GridCanvas';
import { MetricsDashboard } from './components/MetricsDashboard';
import { SimulationGuide } from './components/SimulationGuide';
import { useStore } from './store/useStore';
import { GRID_WIDTH, GRID_HEIGHT, TICK_INTERVAL_MS } from './core/config';

function App() {
  const initializeSimulation = useStore((state) => state.initializeSimulation);
  const isRunning = useStore((state) => state.isRunning);
  const tick = useStore((state) => state.tick);
  const darkMode = useStore((state) => state.darkMode);

  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => { tick(); }, TICK_INTERVAL_MS);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, tick]);

  return (
    <div className={`min-h-screen p-6 md:p-8 font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">

        <header className={`mb-8 border-b pb-4 ${darkMode ? 'border-gray-800' : 'border-slate-200'}`}>
          <h1 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Protocolo de Síntesis Crítica (PSC)
          </h1>
          <p className={`mt-2 max-w-3xl ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Simulación basada en Schelling de dinámicas de segregación ideológica vs gamificación del rigor intelectual (Steel-manning).
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            <ControlPanel />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className={`flex-none flex justify-center p-4 rounded-xl shadow-md border transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <GridCanvas width={600} height={600} gridCols={GRID_WIDTH} gridRows={GRID_HEIGHT} />
            </div>
            <div className="grow">
              <MetricsDashboard />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <SimulationGuide />
        </div>

      </div>
    </div>
  );
}

export default App;
