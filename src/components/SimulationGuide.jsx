import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const sections = [
  {
    id: 'objetivo',
    title: 'Objetivo de la Simulación',
    content: (
      <>
        <p>
          El <strong>Protocolo de Síntesis Crítica (PSC)</strong> es un modelo de interacción social
          diseñado para combatir la <strong>segregación ideológica</strong> (basado en el modelo de Schelling)
          mediante la reingeniería de incentivos.
        </p>
        <p className="mt-2">
          En lugar de premiar la coincidencia de opiniones, el sistema premia la capacidad de los agentes
          para <strong>comprender y sintetizar posturas opuestas</strong> (Steel-manning).
        </p>
        <p className="mt-2">
          El objetivo es observar cómo diferentes configuraciones de &quot;costo de interacción&quot; y
          &quot;recompensa por estatus&quot; pueden <strong>prevenir la formación de burbujas de eco</strong>,
          demostrando que es posible lograr convivencia pacífica sin censura, simplemente gamificando
          el rigor intelectual.
        </p>
      </>
    ),
  },
  {
    id: 'agentes',
    title: 'Los Agentes',
    content: (
      <>
        <p>
          Cada punto en la cuadrícula es un <strong>agente</strong>: un individuo simulado con sus propias
          creencias y comportamientos. Cada agente posee cuatro variables internas:
        </p>
        <ul className="mt-3 space-y-2 list-none">
          <li>
            <strong>Ideología (I)</strong> &mdash; Un valor continuo entre <code>-1</code> y <code>+1</code>.
            Determina la &quot;postura&quot; del agente. Los extremos representan posturas opuestas;
            los valores cercanos a 0 representan posturas moderadas.
          </li>
          <li>
            <strong>Estatus (S)</strong> &mdash; Nivel de influencia acumulado. Se gana al lograr síntesis
            exitosas con agentes ideológicamente distantes. Visualmente se refleja en el tamaño del punto.
          </li>
          <li>
            <strong>Umbral de Tolerancia (T)</strong> &mdash; Porcentaje mínimo de vecinos &quot;similares&quot; que el
            agente necesita para sentirse cómodo. Si no se cumple, el agente se &quot;muda&quot; (se aísla).
          </li>
          <li>
            <strong>Capacidad de Síntesis (C)</strong> &mdash; Probabilidad base de que el agente logre un
            Steel-man exitoso al interactuar con un vecino.
          </li>
        </ul>
        <p className="mt-3 opacity-80 text-sm">
          Los agentes con un borde amarillo están &quot;insatisfechos&quot;: su entorno no cumple
          con su umbral de tolerancia y buscarán mudarse.
        </p>
      </>
    ),
  },
  {
    id: 'bandos',
    title: 'Bando A y Bando B',
    content: (
      <>
        <p>
          La simulación no asigna una &quot;posición política&quot; real a los bandos.
          Los bandos son <strong>abstracciones puras</strong>:
        </p>
        <ul className="mt-3 space-y-2 list-none">
          <li>
            <strong>Bando A (I = -1)</strong> &mdash; Representado por el primer color del esquema elegido.
            Simboliza un extremo ideológico cualquiera.
          </li>
          <li>
            <strong>Bando B (I = +1)</strong> &mdash; Representado por el segundo color.
            Simboliza el extremo opuesto.
          </li>
        </ul>
        <p className="mt-3">
          Los agentes con valores intermedios (cercanos a 0) son moderados y se muestran como una
          mezcla de ambos colores. El esquema de colores es puramente visual y puede cambiarse
          para representar cualquier dicotomía que quieras explorar: izquierda/derecha,
          tradición/innovación, regulación/libertad, etc.
        </p>
      </>
    ),
  },
  {
    id: 'hiperparametros',
    title: 'Hiperparámetros',
    content: (
      <>
        <p>Son las &quot;perillas&quot; que controlan el entorno de la simulación:</p>
        <div className="mt-3 space-y-4">
          <div>
            <strong>Costo de Síntesis (synthesis_cost)</strong>
            <p className="mt-1 text-sm opacity-80">
              Energía requerida para intentar un Steel-man. <strong>Bajo</strong>: el diálogo fluye fácilmente.
              <strong> Alto</strong>: nadie interactúa porque el costo es prohibitivo. Simula cuánto &quot;esfuerzo
              cognitivo&quot; cuesta escuchar al otro lado.
            </p>
          </div>
          <div>
            <strong>Incentivo de Estatus (status_incentive)</strong>
            <p className="mt-1 text-sm opacity-80">
              Multiplicador de estatus por validar a la oposición. <strong>Alto</strong>: los agentes buscan
              activamente el desacuerdo para ganar reputación. <strong>Bajo</strong>: no hay motivación para
              cruzar barreras ideológicas.
            </p>
          </div>
          <div>
            <strong>Nivel de Anonimato (anonymity_level)</strong>
            <p className="mt-1 text-sm opacity-80">
              Implementa el &quot;Velo de la Ignorancia&quot;. <strong>Alto</strong>: los agentes no saben
              la ideología de su interlocutor, reduciendo el sesgo de confirmación.
              <strong> Bajo</strong>: los prejuicios de identidad pesan más.
            </p>
          </div>
          <div>
            <strong>Rigidez Ideológica (ideological_stiffness)</strong>
            <p className="mt-1 text-sm opacity-80">
              Resistencia de un agente a cambiar su ideología tras una síntesis exitosa.
              <strong> Alta</strong>: la población es &quot;terca&quot;, las posturas no se mueven.
              <strong> Baja</strong>: las ideologías convergen rápidamente hacia el centro.
            </p>
          </div>
          <div>
            <strong>Densidad de Población (population_density)</strong>
            <p className="mt-1 text-sm opacity-80">
              Porcentaje de casillas ocupadas. <strong>Alta</strong>: hay poca movilidad,
              los agentes insatisfechos tienen pocos lugares a donde ir.
              <strong> Baja</strong>: es fácil aislarse y formar burbujas pequeñas.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'colores',
    title: 'Esquema de Colores',
    content: (
      <>
        <p>
          El esquema de colores es una herramienta de <strong>visualización</strong>. Cada agente se colorea
          interpolando linealmente entre el color del Bando A y el color del Bando B según su valor
          de ideología.
        </p>
        <p className="mt-2">
          Puedes cambiar los colores para ajustar la representación visual a tu contexto de estudio.
          Los presets ofrecen combinaciones con buen contraste perceptual. El modo personalizado
          te permite elegir cualquier par de colores con los selectores nativos del navegador.
        </p>
        <p className="mt-2 text-sm opacity-80">
          Los agentes insatisfechos siempre se marcan con un borde amarillo independientemente
          del esquema de colores elegido.
        </p>
      </>
    ),
  },
  {
    id: 'escenarios',
    title: 'Escenarios de Experimentación',
    content: (
      <>
        <div className="space-y-4">
          <div>
            <strong>Escenario A: El Mercado de Estatus</strong>
            <p className="text-sm opacity-80 mt-1">
              <em>Ajuste:</em> status_incentive alto (90), synthesis_cost medio (40).
            </p>
            <p className="text-sm mt-1">
              <strong>Hipótesis:</strong> Los agentes competirán por ser los &quot;mejores puentes&quot;.
              Veremos figuras de &quot;Líderes de Síntesis&quot; que conectan grupos opuestos para maximizar
              su propio estatus. Espera una tasa de Steel-manning alta y distancias ideológicas
              medias elevadas (los agentes buscan a los más opuestos porque dan más recompensa).
            </p>
          </div>
          <div>
            <strong>Escenario B: La Fatiga del Diálogo</strong>
            <p className="text-sm opacity-80 mt-1">
              <em>Ajuste:</em> synthesis_cost muy alto (95).
            </p>
            <p className="text-sm mt-1">
              <strong>Hipótesis:</strong> La población se volverá silenciosa. Aunque no haya insultos,
              la red muere por falta de actividad. Demuestra que la &quot;cortesía forzada&quot; tiene un límite:
              si el costo de dialogar es demasiado alto, la gente simplemente deja de intentarlo.
              Espera una tasa de Steel-manning casi nula.
            </p>
          </div>
          <div>
            <strong>Escenario C: El Velo Total</strong>
            <p className="text-sm opacity-80 mt-1">
              <em>Ajuste:</em> anonymity_level máximo (100).
            </p>
            <p className="text-sm mt-1">
              <strong>Hipótesis:</strong> La segregación de Schelling desaparece casi por completo porque
              los agentes no pueden identificar quién es &quot;diferente&quot;, probando que el <strong>prejuicio
              de identidad es el motor principal de la segregación</strong>. El Índice de Schelling
              debería mantenerse bajo.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'reglas',
    title: 'Reglas de Interacción',
    content: (
      <>
        <p>En cada ronda de la simulación ocurren cinco fases:</p>
        <ol className="mt-3 space-y-2 list-decimal list-inside">
          <li>
            <strong>Evaluación:</strong> Cada agente revisa a sus 8 vecinos adyacentes. Si la proporción
            de vecinos &quot;similares&quot; es menor que su umbral de tolerancia, se marca como insatisfecho.
          </li>
          <li>
            <strong>Movimiento:</strong> Los agentes insatisfechos se mudan a una celda vacía al azar,
            abandonando su vecindario actual (movilidad forzada).
          </li>
          <li>
            <strong>Interacción:</strong> Cada agente intenta dialogar con un vecino al azar. El Velo
            de la Ignorancia (anonimato) facilita la interacción reduciendo sesgos. Se cobra
            el costo de síntesis.
          </li>
          <li>
            <strong>Síntesis:</strong> Si la interacción procede, el éxito depende de la capacidad
            de síntesis del agente. Si hay éxito (Validación Cruzada), ambos ganan estatus
            proporcional a su distancia ideológica, y sus ideologías se acercan ligeramente
            (modulado por la rigidez ideológica).
          </li>
          <li>
            <strong>Actualización:</strong> Se recalculan todos los KPIs y se redibuja la cuadrícula.
          </li>
        </ol>
      </>
    ),
  },
];

export const SimulationGuide = () => {
  const darkMode = useStore((s) => s.darkMode);
  const [openSection, setOpenSection] = useState(null);

  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  const card = darkMode
    ? 'bg-gray-900 border-gray-800 text-gray-200'
    : 'bg-white border-gray-100 text-gray-800';

  const headerBtn = darkMode
    ? 'hover:bg-gray-800/60'
    : 'hover:bg-slate-50';

  const divider = darkMode ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`p-6 rounded-xl shadow-md border transition-colors duration-300 ${card}`}>
      <h2 className="text-xl font-bold mb-1">Guía de la Simulación</h2>
      <p className={`text-sm mb-5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        Haz clic en cada sección para expandirla.
      </p>

      <div className={`divide-y ${divider}`}>
        {sections.map((section) => {
          const isOpen = openSection === section.id;
          return (
            <div key={section.id}>
              <button
                onClick={() => toggle(section.id)}
                className={`w-full flex items-center justify-between py-3 px-2 rounded-md text-left font-semibold text-sm transition ${headerBtn}`}
              >
                <span>{section.title}</span>
                <span className={`text-lg transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              {isOpen && (
                <div className={`px-2 pb-4 text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
