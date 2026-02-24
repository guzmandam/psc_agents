import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const getSchellingInterpretation = (v) => {
  if (v < 0.35) return { label: 'Excelente', badge: 'bg-emerald-600', text: 'La población está bien mezclada. No hay burbujas de eco significativas.' };
  if (v < 0.55) return { label: 'Moderado', badge: 'bg-amber-500', text: 'Hay cierto agrupamiento, pero los bandos no están completamente aislados.' };
  if (v < 0.75) return { label: 'Alto', badge: 'bg-orange-500', text: 'Se están formando clústeres. Los agentes prefieren estar cerca de los que piensan igual.' };
  return { label: 'Crítico', badge: 'bg-red-600', text: 'Segregación severa. Los bandos viven en burbujas casi impermeables.' };
};

const getSteelmanInterpretation = (v) => {
  if (v < 5) return { label: 'Inactivo', badge: 'bg-red-600', text: 'Casi nadie logra dialogar. El costo es prohibitivo o la capacidad es insuficiente.' };
  if (v < 20) return { label: 'Bajo', badge: 'bg-orange-500', text: 'Pocas interacciones exitosas. El diálogo existe pero es frágil.' };
  if (v < 50) return { label: 'Saludable', badge: 'bg-amber-500', text: 'Nivel razonable de síntesis. Los incentivos están funcionando parcialmente.' };
  return { label: 'Óptimo', badge: 'bg-emerald-600', text: 'Alto nivel de síntesis exitosa. Los agentes están activamente construyendo puentes.' };
};

const getDistanceInterpretation = (v) => {
  if (v < 0.3) return { label: 'Baja', badge: 'bg-orange-500', text: 'Los agentes solo dialogan con quienes son similares. Los puentes son cortos.' };
  if (v < 0.8) return { label: 'Moderada', badge: 'bg-amber-500', text: 'Se están formando puentes de alcance medio entre posturas diferentes.' };
  if (v < 1.4) return { label: 'Alta', badge: 'bg-emerald-600', text: 'Puentes largos: agentes de bandos muy opuestos logran sintetizar.' };
  return { label: 'Máxima', badge: 'bg-blue-600', text: 'Los extremos se están comunicando directamente. Máximo alcance de síntesis.' };
};

const getMobilityInterpretation = (v, agentCount) => {
  const ratio = agentCount > 0 ? v / agentCount : 0;
  if (ratio < 0.02) return { label: 'Estable', badge: 'bg-emerald-600', text: 'Casi nadie se muda. La población está cómoda con su entorno.' };
  if (ratio < 0.10) return { label: 'Moderada', badge: 'bg-amber-500', text: 'Algunos agentes buscan reubicarse. Hay zonas de tensión.' };
  if (ratio < 0.25) return { label: 'Alta', badge: 'bg-orange-500', text: 'Muchos agentes insatisfechos. Se observa reorganización constante.' };
  return { label: 'Éxodo', badge: 'bg-red-600', text: 'Migración masiva. La mayoría de agentes huye de su vecindario.' };
};

export const MetricsDashboard = () => {
  const metrics = useStore((s) => s.metrics);
  const tickCount = useStore((s) => s.tickCount);
  const darkMode = useStore((s) => s.darkMode);
  const agents = useStore((s) => s.agents);
  const [expanded, setExpanded] = useState(null);

  const toggle = (idx) => setExpanded(expanded === idx ? null : idx);

  const schellingInterp = getSchellingInterpretation(metrics.schelling_index);
  const steelmanInterp = getSteelmanInterpretation(metrics.steelmanning_rate);
  const distanceInterp = getDistanceInterpretation(metrics.avg_ideological_distance);
  const mobilityInterp = getMobilityInterpretation(metrics.forced_mobility, agents.length);

  const kpis = [
    {
      title: 'Índice de Schelling (Is)',
      value: metrics.schelling_index.toFixed(2),
      desc: 'Grado de agrupamiento por similitud ideológica.',
      light: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      dark: 'bg-indigo-950/40 border-indigo-800 text-indigo-200',
      interp: schellingInterp,
      detail: (
        <>
          <p><strong>Fórmula:</strong> Proporción promedio de vecinos &quot;similares&quot; respecto al total de vecinos, para todos los agentes.</p>
          <table className="mt-2 w-full text-xs">
            <thead><tr className="opacity-70"><th className="text-left py-1">Rango</th><th className="text-left py-1">Estado</th><th className="text-left py-1">Significado</th></tr></thead>
            <tbody>
              <tr><td className="py-1">0.00 &ndash; 0.34</td><td>Excelente</td><td>Mezcla constante, sin burbujas</td></tr>
              <tr><td className="py-1">0.35 &ndash; 0.54</td><td>Moderado</td><td>Algo de agrupamiento, pero no total</td></tr>
              <tr><td className="py-1">0.55 &ndash; 0.74</td><td>Alto</td><td>Clústeres formándose</td></tr>
              <tr><td className="py-1">0.75 &ndash; 1.00</td><td>Crítico</td><td>Segregación severa</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs opacity-70">Meta: mantenerlo lo más bajo posible. Un valor alto indica que el PSC no está logrando romper las burbujas.</p>
        </>
      ),
    },
    {
      title: 'Tasa Steel-manning (Tsm)',
      value: `${metrics.steelmanning_rate.toFixed(1)}%`,
      desc: 'Proporción de interacciones con síntesis exitosa.',
      light: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      dark: 'bg-emerald-950/40 border-emerald-800 text-emerald-200',
      interp: steelmanInterp,
      detail: (
        <>
          <p><strong>Fórmula:</strong> (Síntesis validadas / Intentos de interacción) &times; 100</p>
          <table className="mt-2 w-full text-xs">
            <thead><tr className="opacity-70"><th className="text-left py-1">Rango</th><th className="text-left py-1">Estado</th><th className="text-left py-1">Significado</th></tr></thead>
            <tbody>
              <tr><td className="py-1">0% &ndash; 4%</td><td>Inactivo</td><td>Red muerta, nadie dialoga</td></tr>
              <tr><td className="py-1">5% &ndash; 19%</td><td>Bajo</td><td>Diálogo frágil, pocas síntesis</td></tr>
              <tr><td className="py-1">20% &ndash; 49%</td><td>Saludable</td><td>Incentivos funcionando</td></tr>
              <tr><td className="py-1">50% &ndash; 100%</td><td>Óptimo</td><td>Alto nivel de puentes activos</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs opacity-70">Esta métrica se ve directamente afectada por synthesis_cost (la baja) y por la capacidad de síntesis individual de cada agente.</p>
        </>
      ),
    },
    {
      title: 'Distancia Ideológica Media (Davg)',
      value: metrics.avg_ideological_distance.toFixed(3),
      desc: 'Alcance promedio de los puentes de comunicación.',
      light: 'bg-amber-50 border-amber-200 text-amber-900',
      dark: 'bg-amber-950/40 border-amber-800 text-amber-200',
      interp: distanceInterp,
      detail: (
        <>
          <p><strong>Fórmula:</strong> promedio( |I_agente1 &minus; I_agente2| ) para cada interacción validada exitosamente.</p>
          <table className="mt-2 w-full text-xs">
            <thead><tr className="opacity-70"><th className="text-left py-1">Rango</th><th className="text-left py-1">Estado</th><th className="text-left py-1">Significado</th></tr></thead>
            <tbody>
              <tr><td className="py-1">0.00 &ndash; 0.29</td><td>Baja</td><td>Solo se hablan los similares</td></tr>
              <tr><td className="py-1">0.30 &ndash; 0.79</td><td>Moderada</td><td>Puentes de alcance medio</td></tr>
              <tr><td className="py-1">0.80 &ndash; 1.39</td><td>Alta</td><td>Bandos opuestos dialogando</td></tr>
              <tr><td className="py-1">1.40 &ndash; 2.00</td><td>Máxima</td><td>Extremos comunicándose directamente</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs opacity-70">Un status_incentive alto motiva a buscar al más opuesto (mayor recompensa), elevando esta métrica.</p>
        </>
      ),
    },
    {
      title: 'Movilidad Forzada',
      value: metrics.forced_mobility,
      desc: 'Agentes que abandonaron su vecindario esta ronda.',
      light: 'bg-rose-50 border-rose-200 text-rose-900',
      dark: 'bg-rose-950/40 border-rose-800 text-rose-200',
      interp: mobilityInterp,
      detail: (
        <>
          <p><strong>Fórmula:</strong> Conteo de agentes cuyo ratio de vecinos similares cayó por debajo de su umbral de tolerancia y tuvieron que reubicarse.</p>
          <table className="mt-2 w-full text-xs">
            <thead><tr className="opacity-70"><th className="text-left py-1">Ratio (mudanzas / agentes)</th><th className="text-left py-1">Estado</th><th className="text-left py-1">Significado</th></tr></thead>
            <tbody>
              <tr><td className="py-1">&lt; 2%</td><td>Estable</td><td>Población cómoda</td></tr>
              <tr><td className="py-1">2% &ndash; 9%</td><td>Moderada</td><td>Tensión en algunas zonas</td></tr>
              <tr><td className="py-1">10% &ndash; 24%</td><td>Alta</td><td>Reorganización constante</td></tr>
              <tr><td className="py-1">&ge; 25%</td><td>Éxodo</td><td>Migración masiva</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs opacity-70">Meta: reducir la movilidad logrando que los agentes prefieran quedarse y sintetizar a huir a una burbuja. Un buen PSC transforma la insatisfacción en diálogo.</p>
        </>
      ),
    },
  ];

  const card = darkMode
    ? 'bg-gray-900 border-gray-800 text-gray-100'
    : 'bg-white border-gray-100 text-gray-900';

  return (
    <div className={`p-6 rounded-xl shadow-md border h-full flex flex-col transition-colors duration-300 ${card}`}>
      <div className={`flex justify-between items-center mb-6 border-b pb-4 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h2 className="text-xl font-bold">Dashboard de KPIs</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-mono ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-slate-800 text-white'}`}>
          Ronda: {tickCount}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`rounded-lg border transition-colors duration-300 ${darkMode ? kpi.dark : kpi.light}`}>
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold opacity-80 mb-1">{kpi.title}</h3>
                  <p className="text-3xl font-bold font-mono mb-1">{kpi.value}</p>
                </div>
                <span className={`${kpi.interp.badge} text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                  {kpi.interp.label}
                </span>
              </div>
              <p className="text-xs opacity-70 leading-snug">{kpi.interp.text}</p>
              <p className="text-[10px] mt-2 opacity-50">{expanded === idx ? 'Clic para cerrar' : 'Clic para ver detalle'}</p>
            </button>

            {expanded === idx && (
              <div className={`px-4 pb-4 text-sm leading-relaxed border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-200/80'}`}>
                <div className="pt-3">
                  {kpi.detail}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
