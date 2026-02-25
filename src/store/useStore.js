import { create } from 'zustand';
import { SimulationManager } from '../core/SimulationManager';
import { GRID_WIDTH, GRID_HEIGHT, COLOR_PRESETS } from '../core/config';

const simManager = new SimulationManager(GRID_WIDTH, GRID_HEIGHT);

export const useStore = create((set, get) => ({
  hyperparams: {
    synthesis_cost: 50,
    status_incentive: 50,
    anonymity_level: 0,
    ideological_stiffness: 50,
    population_density: 30,
  },

  metrics: {
    schelling_index: 0,
    steelmanning_rate: 0,
    avg_ideological_distance: 0,
    forced_mobility: 0,
  },

  isRunning: false,
  agents: [],
  tickCount: 0,

  interactionEdges: [],
  interactionStats: {
    avgInteractionsAlike: 0,
    avgInteractionsCounter: 0,
    successRateAlike: 0,
    successRateCounter: 0,
    totalInteractionsThisTick: 0,
  },

  darkMode: true,
  colorScheme: 'blue-red',
  customColorA: [...COLOR_PRESETS['blue-red'].colorA],
  customColorB: [...COLOR_PRESETS['blue-red'].colorB],

  setHyperparam: (key, value) => set((state) => ({
    hyperparams: { ...state.hyperparams, [key]: value }
  })),

  initializeSimulation: () => {
    const { hyperparams } = get();
    simManager.initialize(hyperparams);
    set({
      agents: [...simManager.agents],
      tickCount: 0,
      metrics: { ...simManager.metrics },
      interactionEdges: [],
      interactionStats: { ...simManager.interactionStats },
    });
  },

  tick: () => {
    const { hyperparams, tickCount } = get();
    simManager.tick(hyperparams);
    set({
      agents: [...simManager.agents],
      tickCount: tickCount + 1,
      metrics: { ...simManager.metrics },
      interactionEdges: [...simManager.interactionEdges],
      interactionStats: { ...simManager.interactionStats },
    });
  },

  toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  setColorScheme: (scheme) => {
    const preset = COLOR_PRESETS[scheme];
    if (scheme !== 'custom' && preset) {
      set({ colorScheme: scheme, customColorA: [...preset.colorA], customColorB: [...preset.colorB] });
    } else {
      set({ colorScheme: scheme });
    }
  },

  setCustomColorA: (rgb) => set({ customColorA: rgb, colorScheme: 'custom' }),
  setCustomColorB: (rgb) => set({ customColorB: rgb, colorScheme: 'custom' }),

  getActiveColors: () => {
    const { colorScheme, customColorA, customColorB } = get();
    if (colorScheme === 'custom') return { colorA: customColorA, colorB: customColorB };
    const preset = COLOR_PRESETS[colorScheme];
    return preset ? { colorA: preset.colorA, colorB: preset.colorB } : { colorA: customColorA, colorB: customColorB };
  },

  loadScenario: (scenarioType) => {
    let newParams = {};
    switch (scenarioType) {
      case 'A':
        newParams = { status_incentive: 90, synthesis_cost: 40 };
        break;
      case 'B':
        newParams = { synthesis_cost: 95 };
        break;
      case 'C':
        newParams = { anonymity_level: 100 };
        break;
    }
    set((state) => ({
      hyperparams: { ...state.hyperparams, ...newParams }
    }));
  }
}));
