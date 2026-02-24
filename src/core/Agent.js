export class Agent {
  constructor(id, x, y, gridWidth, gridHeight) {
    this.id = id;
    this.x = x;
    this.y = y;
    // Ideology [-1, 1]
    this.ideology = Math.random() * 2 - 1;
    this.status = 1.0;
    
    // Tolerance (T) to ideological stress
    this.tolerance = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
    
    // Synthesis capacity (C)
    this.synthesisCapacity = 0.2 + Math.random() * 0.6; // 0.2 to 0.8
    
    this.anonymityTimer = 0;
    this.isDissatisfied = false;
  }
}
