import React, { useEffect, useState, lazy, Suspense } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { GridCanvas } from './components/GridCanvas';
import { MetricsDashboard } from './components/MetricsDashboard';
import { InteractionAnalytics } from './components/InteractionAnalytics';
import { SimulationGuide } from './components/SimulationGuide';
import { useStore } from './store/useStore';
import { GRID_WIDTH, GRID_HEIGHT, TICK_INTERVAL_MS } from './core/config';

const NetworkGraph3D = lazy(() =>
  import('./components/NetworkGraph3D').then((m) => ({ default: m.NetworkGraph3D }))
);

function App() {
  const initializeSimulation = useStore((state) => state.initializeSimulation);
  const isRunning = useStore((state) => state.isRunning);
  const tick = useStore((state) => state.tick);
  const darkMode = useStore((state) => state.darkMode);

  const [viewMode, setViewMode] = useState('grid');

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
            <InteractionAnalytics />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className={`flex-none rounded-xl shadow-md border transition-colors duration-300 overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className={`flex items-center gap-1 px-4 pt-3 pb-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100')
                  }`}
                >
                  Grilla 2D
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'graph'
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100')
                  }`}
                >
                  Red 3D
                </button>
              </div>

              <div className="flex justify-center p-4">
                {viewMode === 'grid' ? (
                  <GridCanvas width={600} height={600} gridCols={GRID_WIDTH} gridRows={GRID_HEIGHT} />
                ) : (
                  <Suspense fallback={
                    <div className={`flex items-center justify-center w-full ${darkMode ? 'text-gray-400' : 'text-slate-500'}`} style={{ height: '600px' }}>
                      Cargando visualización 3D...
                    </div>
                  }>
                    <NetworkGraph3D />
                  </Suspense>
                )}
              </div>
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
