import React from 'react';
import { useStore } from '../store/useStore';

const StatBar = ({ label, value, max, color, darkMode }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={darkMode ? 'text-gray-300' : 'text-slate-600'}>{label}</span>
        <span className={`font-mono font-semibold ${darkMode ? 'text-gray-100' : 'text-slate-800'}`}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
      </div>
      <div className={`w-full h-2.5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const RateCard = ({ title, rate, icon, color, darkMode }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-slate-100'}`}>
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{title}</p>
      <p className={`text-xl font-bold tabular-nums ${darkMode ? 'text-gray-100' : 'text-slate-800'}`}>
        {rate.toFixed(1)}%
      </p>
    </div>
  </div>
);

export const InteractionAnalytics = () => {
  const darkMode = useStore((s) => s.darkMode);
  const stats = useStore((s) => s.interactionStats);
  const agents = useStore((s) => s.agents);

  const totalAgents = agents.length;

  const cumulativeAlike = totalAgents > 0
    ? agents.reduce((sum, a) => sum + a.interactionsAlike, 0) / totalAgents
    : 0;
  const cumulativeCounter = totalAgents > 0
    ? agents.reduce((sum, a) => sum + a.interactionsCounter, 0) / totalAgents
    : 0;

  const cumulativeSuccessAlike = totalAgents > 0
    ? agents.reduce((sum, a) => sum + a.successAlike, 0)
    : 0;
  const cumulativeTotalAlike = totalAgents > 0
    ? agents.reduce((sum, a) => sum + a.interactionsAlike, 0)
    : 0;
  const cumulativeSuccessCounter = totalAgents > 0
    ? agents.reduce((sum, a) => sum + a.successCounter, 0)
    : 0;
  const cumulativeTotalCounter = totalAgents > 0
    ? agents.reduce((sum, a) => sum + a.interactionsCounter, 0)
    : 0;

  const cumRateAlike = cumulativeTotalAlike > 0
    ? (cumulativeSuccessAlike / cumulativeTotalAlike) * 100
    : 0;
  const cumRateCounter = cumulativeTotalCounter > 0
    ? (cumulativeSuccessCounter / cumulativeTotalCounter) * 100
    : 0;

  const maxAvg = Math.max(stats.avgInteractionsAlike, stats.avgInteractionsCounter, 0.01);

  return (
    <div className={`rounded-xl border p-5 transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
        Análisis de Interacciones
      </h3>

      <div className="space-y-5">
        <div>
          <p className={`text-xs uppercase tracking-wider mb-2 font-semibold ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            Promedio por agente (este tick)
          </p>
          <div className="space-y-3">
            <StatBar
              label="Con agentes afines"
              value={stats.avgInteractionsAlike}
              max={maxAvg}
              color="#60a5fa"
              darkMode={darkMode}
            />
            <StatBar
              label="Con agentes opuestos"
              value={stats.avgInteractionsCounter}
              max={maxAvg}
              color="#f87171"
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className={`border-t pt-4 ${darkMode ? 'border-gray-800' : 'border-slate-200'}`}>
          <p className={`text-xs uppercase tracking-wider mb-3 font-semibold ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            Tasa de éxito (este tick)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <RateCard
              title="Éxito con afines"
              rate={stats.successRateAlike}
              icon="≈"
              color="#60a5fa"
              darkMode={darkMode}
            />
            <RateCard
              title="Éxito con opuestos"
              rate={stats.successRateCounter}
              icon="≠"
              color="#f87171"
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className={`border-t pt-4 ${darkMode ? 'border-gray-800' : 'border-slate-200'}`}>
          <p className={`text-xs uppercase tracking-wider mb-3 font-semibold ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            Acumulado (promedio por agente)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Interacciones afines</p>
              <p className={`text-2xl font-bold tabular-nums ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {cumulativeAlike.toFixed(1)}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                Éxito: {cumRateAlike.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Interacciones opuestas</p>
              <p className={`text-2xl font-bold tabular-nums ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                {cumulativeCounter.toFixed(1)}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                Éxito: {cumRateCounter.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-between text-xs pt-2 border-t ${darkMode ? 'border-gray-800 text-gray-500' : 'border-slate-200 text-slate-400'}`}>
          <span>Total interacciones este tick</span>
          <span className="font-mono font-semibold">{stats.totalInteractionsThisTick}</span>
        </div>
      </div>
    </div>
  );
};
