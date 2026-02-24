import React from 'react';
import { useStore } from '../store/useStore';
import { COLOR_PRESETS, rgbToHex, hexToRgb } from '../core/config';

const PARAM_INFO = {
  synthesis_cost: {
    short: 'Costo de Síntesis',
    desc: 'Energía requerida para intentar un Steel-man. Cuanto más alto, menos agentes logran interactuar. Simula el esfuerzo cognitivo de escuchar al otro lado.',
    low: 'El diálogo fluye fácilmente, muchas síntesis se intentan.',
    high: 'Nadie interactúa: el costo es prohibitivo. La red muere por inactividad.',
  },
  status_incentive: {
    short: 'Incentivo de Estatus',
    desc: 'Multiplicador de reputación que se gana al validar una síntesis con alguien ideológicamente opuesto. La ganancia es proporcional a la distancia ideológica.',
    low: 'No hay motivación para cruzar barreras. Los agentes solo hablan con similares.',
    high: 'Los agentes buscan activamente al más opuesto para maximizar su recompensa.',
  },
  anonymity_level: {
    short: 'Nivel de Anonimato',
    desc: 'Implementa el "Velo de la Ignorancia": los agentes no conocen la ideología de su interlocutor, reduciendo el sesgo de confirmación.',
    low: 'Los prejuicios de identidad pesan más. Los agentes evitan a los "diferentes".',
    high: 'Sin sesgo de identidad: los agentes interactúan solo con base en el contenido.',
  },
  ideological_stiffness: {
    short: 'Rigidez Ideológica',
    desc: 'Resistencia de un agente a cambiar su postura tras una síntesis exitosa. Define qué tan "terca" es la población.',
    low: 'Las ideologías convergen rápidamente hacia el centro tras cada síntesis.',
    high: 'Las posturas no se mueven aunque haya síntesis exitosa. Población terca.',
  },
  population_density: {
    short: 'Densidad de Población',
    desc: 'Porcentaje de casillas ocupadas en la cuadrícula. Afecta la facilidad con la que los agentes pueden mudarse o aislarse.',
    low: 'Muchos espacios vacíos: fácil aislarse y formar burbujas pequeñas.',
    high: 'Pocos espacios: los agentes insatisfechos tienen pocos lugares a dónde ir.',
  },
};

const InfoTooltip = ({ paramKey, darkMode }) => {
  const info = PARAM_INFO[paramKey];
  if (!info) return null;

  const bg = darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800';
  const tagLow = darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700';
  const tagHigh = darkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-50 text-orange-700';

  return (
    <span className="relative group inline-flex items-center ml-1.5">
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold cursor-help border transition ${darkMode ? 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200' : 'border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-600'}`}
      >
        i
      </span>

      <span className={`pointer-events-none absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg shadow-xl border text-xs leading-relaxed opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150 ${bg}`}>
        <span className="font-semibold block mb-1">{info.short}</span>
        <span className="block mb-2 opacity-80">{info.desc}</span>

        <span className={`block rounded px-2 py-1 mb-1 ${tagLow}`}>
          <span className="font-semibold">Bajo:</span> {info.low}
        </span>
        <span className={`block rounded px-2 py-1 ${tagHigh}`}>
          <span className="font-semibold">Alto:</span> {info.high}
        </span>

        {/* Arrow */}
        <span className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] ${darkMode ? 'border-t-gray-800' : 'border-t-white'}`} />
      </span>
    </span>
  );
};

export const ControlPanel = () => {
  const hyperparams = useStore((s) => s.hyperparams);
  const setHyperparam = useStore((s) => s.setHyperparam);
  const isRunning = useStore((s) => s.isRunning);
  const toggleSimulation = useStore((s) => s.toggleSimulation);
  const initializeSimulation = useStore((s) => s.initializeSimulation);
  const loadScenario = useStore((s) => s.loadScenario);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const colorScheme = useStore((s) => s.colorScheme);
  const setColorScheme = useStore((s) => s.setColorScheme);
  const customColorA = useStore((s) => s.customColorA);
  const customColorB = useStore((s) => s.customColorB);
  const setCustomColorA = useStore((s) => s.setCustomColorA);
  const setCustomColorB = useStore((s) => s.setCustomColorB);

  const sliders = [
    { key: 'synthesis_cost', label: 'Costo de Síntesis (Energía)', min: 0, max: 100 },
    { key: 'status_incentive', label: 'Incentivo de Estatus', min: 0, max: 100 },
    { key: 'anonymity_level', label: 'Nivel de Anonimato (Velo)', min: 0, max: 100 },
    { key: 'ideological_stiffness', label: 'Rigidez Ideológica', min: 0, max: 100 },
    { key: 'population_density', label: 'Densidad de Población (%)', min: 10, max: 90 },
  ];

  const card = darkMode
    ? 'bg-gray-900 border-gray-800 text-gray-100'
    : 'bg-white border-gray-100 text-gray-900';

  const labelCls = darkMode ? 'text-gray-400' : 'text-gray-600';
  const valueCls = darkMode ? 'text-gray-100' : 'text-gray-800';
  const heading = darkMode ? 'text-gray-200' : 'text-gray-700';
  const sliderTrack = darkMode ? 'bg-gray-700' : 'bg-gray-200';
  const scenarioBtn = darkMode
    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700'
    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200';

  return (
    <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${card}`}>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Panel de Control</h2>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg border text-sm font-medium transition ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-yellow-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {darkMode ? '☀' : '☾'}
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={initializeSimulation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition font-medium text-sm"
        >
          Inicializar
        </button>
        <button
          onClick={toggleSimulation}
          className={`${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded-md transition font-medium text-sm w-32`}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className={`font-semibold ${heading}`}>Hiperparámetros</h3>
        {sliders.map((s) => (
          <div key={s.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${labelCls} flex items-center`}>
                {s.label}
                <InfoTooltip paramKey={s.key} darkMode={darkMode} />
              </span>
              <span className={`text-sm font-bold tabular-nums ${valueCls}`}>{hyperparams[s.key]}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={hyperparams[s.key]}
              onChange={(e) => setHyperparam(s.key, parseInt(e.target.value, 10))}
              className={`w-full h-2 ${sliderTrack} rounded-lg appearance-none cursor-pointer accent-blue-600`}
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        <h3 className={`font-semibold ${heading}`}>Esquema de Colores</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(COLOR_PRESETS).filter(([k]) => k !== 'custom').map(([key, preset]) => (
            <button
              key={key}
              onClick={() => setColorScheme(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-medium transition ${colorScheme === key
                ? 'ring-2 ring-blue-500 border-blue-500'
                : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="flex gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `rgb(${preset.colorA.join(',')})` }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `rgb(${preset.colorB.join(',')})` }} />
              </span>
              <span className="truncate">{preset.label}</span>
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-4 pt-2 ${colorScheme === 'custom' ? '' : 'opacity-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${labelCls}`}>Bando A (I = -1)</span>
            <input
              type="color"
              value={rgbToHex(customColorA)}
              onChange={(e) => setCustomColorA(hexToRgb(e.target.value))}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${labelCls}`}>Bando B (I = +1)</span>
            <input
              type="color"
              value={rgbToHex(customColorB)}
              onChange={(e) => setCustomColorB(hexToRgb(e.target.value))}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            />
          </div>
        </div>

        <div
          className="h-4 rounded-full mt-1"
          style={{
            background: `linear-gradient(to right, rgb(${customColorA.join(',')}), rgb(${customColorB.join(',')}))`
          }}
        />
      </div>

      <div className="space-y-3">
        <h3 className={`font-semibold ${heading}`}>Escenarios de Experimentación</h3>
        {[
          { key: 'A', label: 'Escenario A: Mercado de Estatus' },
          { key: 'B', label: 'Escenario B: Fatiga del Diálogo' },
          { key: 'C', label: 'Escenario C: Velo Total (Anonimato)' },
        ].map((sc) => (
          <button
            key={sc.key}
            onClick={() => loadScenario(sc.key)}
            className={`w-full text-left px-4 py-2 rounded-md transition text-sm font-medium border ${scenarioBtn}`}
          >
            {sc.label}
          </button>
        ))}
      </div>
    </div>
  );
};
