import { Agent } from './Agent';

export class SimulationManager {
  constructor(width = 50, height = 50) {
    this.width = width;
    this.height = height;
    this.agents = [];
    this.grid = new Array(width * height).fill(null);
    this.metrics = {
      schelling_index: 0,
      steelmanning_rate: 0,
      avg_ideological_distance: 0,
      forced_mobility: 0
    };
    this.interactionEdges = [];
    this.interactionStats = {
      avgInteractionsAlike: 0,
      avgInteractionsCounter: 0,
      successRateAlike: 0,
      successRateCounter: 0,
      totalInteractionsThisTick: 0,
    };
  }

  getIndex(x, y) {
    return y * this.width + x;
  }

  initialize(hyperparams) {
    this.agents = [];
    this.grid.fill(null);
    this.interactionEdges = [];
    const totalCells = this.width * this.height;
    const popCount = Math.floor(totalCells * (hyperparams.population_density / 100));

    for (let i = 0; i < popCount; i++) {
      let x, y, idx;
      do {
        x = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.height);
        idx = this.getIndex(x, y);
      } while (this.grid[idx] !== null);
      
      const agent = new Agent(i, x, y, this.width, this.height);
      this.agents.push(agent);
      this.grid[idx] = agent;
    }
  }

  getNeighbors(agent) {
    const neighbors = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = agent.x + dx;
        const ny = agent.y + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          const neighbor = this.grid[this.getIndex(nx, ny)];
          if (neighbor) neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }

  tick(hyperparams) {
    let forced_mobility = 0;
    let synthesis_attempts = 0;
    let synthesis_success = 0;
    let total_ideological_distance = 0;
    let similar_neighbors_total = 0;
    let total_neighbors_counted = 0;

    const ALIKE_THRESHOLD = 0.5;

    let tickAlike = 0;
    let tickCounter = 0;
    let tickSuccessAlike = 0;
    let tickSuccessCounter = 0;

    const tickEdges = [];

    for (const agent of this.agents) {
      const neighbors = this.getNeighbors(agent);
      if (neighbors.length === 0) {
        agent.isDissatisfied = false;
        continue;
      }
      
      let similarCount = 0;
      for (const n of neighbors) {
        const diff = Math.abs(agent.ideology - n.ideology) / 2;
        if (diff <= agent.tolerance) {
          similarCount++;
        }
      }
      
      similar_neighbors_total += similarCount;
      total_neighbors_counted += neighbors.length;
      
      const similarRatio = similarCount / neighbors.length;
      
      if (similarRatio < (1 - agent.tolerance)) {
        agent.isDissatisfied = true;
      } else {
        agent.isDissatisfied = false;
      }
    }

    this.metrics.schelling_index = total_neighbors_counted > 0 
      ? similar_neighbors_total / total_neighbors_counted 
      : 0;

    const totalCells = this.width * this.height;
    const emptyCells = totalCells - this.agents.length;
    
    for (const agent of this.agents) {
      if (agent.isDissatisfied && emptyCells > 0) {
        const oldIdx = this.getIndex(agent.x, agent.y);
        this.grid[oldIdx] = null;
        
        let nx, ny, nidx;
        let attempts = 0;
        do {
          nx = Math.floor(Math.random() * this.width);
          ny = Math.floor(Math.random() * this.height);
          nidx = this.getIndex(nx, ny);
          attempts++;
        } while (this.grid[nidx] !== null && attempts < 100);
        
        if (this.grid[nidx] !== null) {
          this.grid[oldIdx] = agent;
          continue;
        }
        
        agent.x = nx;
        agent.y = ny;
        this.grid[nidx] = agent;
        forced_mobility++;
      }
    }

    for (const agent of this.agents) {
      const neighbors = this.getNeighbors(agent);
      if (neighbors.length === 0) continue;
      
      const target = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      synthesis_attempts++;

      const ideoDist = Math.abs(agent.ideology - target.ideology);
      const isAlike = ideoDist < ALIKE_THRESHOLD;

      if (isAlike) {
        tickAlike++;
        agent.interactionsAlike++;
      } else {
        tickCounter++;
        agent.interactionsCounter++;
      }
      
      const anonymityBonus = hyperparams.anonymity_level / 200; 
      const probSuccess = agent.synthesisCapacity - (hyperparams.synthesis_cost / 100) + anonymityBonus;
      
      let success = false;
      if (Math.random() < probSuccess) {
        synthesis_success++;
        total_ideological_distance += ideoDist;
        
        const statusGain = (ideoDist * hyperparams.status_incentive) / 10;
        agent.status += statusGain;
        target.status += statusGain;
        
        const stiffness = hyperparams.ideological_stiffness / 100;
        const pull = (target.ideology - agent.ideology) * (1 - stiffness) * 0.2;
        
        agent.ideology = Math.max(-1, Math.min(1, agent.ideology + pull));
        success = true;

        if (isAlike) {
          tickSuccessAlike++;
          agent.successAlike++;
        } else {
          tickSuccessCounter++;
          agent.successCounter++;
        }
      }

      tickEdges.push({
        source: agent.id,
        target: target.id,
        success,
        ideoDist,
      });
    }

    this.interactionEdges = tickEdges;

    this.interactionStats = {
      avgInteractionsAlike: this.agents.length > 0 ? tickAlike / this.agents.length : 0,
      avgInteractionsCounter: this.agents.length > 0 ? tickCounter / this.agents.length : 0,
      successRateAlike: tickAlike > 0 ? (tickSuccessAlike / tickAlike) * 100 : 0,
      successRateCounter: tickCounter > 0 ? (tickSuccessCounter / tickCounter) * 100 : 0,
      totalInteractionsThisTick: tickEdges.length,
    };

    this.metrics.forced_mobility = forced_mobility;
    this.metrics.steelmanning_rate = synthesis_attempts > 0 ? (synthesis_success / synthesis_attempts) * 100 : 0;
    this.metrics.avg_ideological_distance = synthesis_success > 0 ? total_ideological_distance / synthesis_success : 0;
  }
}
