export class Agent {
  constructor(id, x, y, gridWidth, gridHeight) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.ideology = Math.random() * 2 - 1;
    this.status = 1.0;

    this.tolerance = 0.3 + Math.random() * 0.4;
    this.synthesisCapacity = 0.2 + Math.random() * 0.6;

    this.anonymityTimer = 0;
    this.isDissatisfied = false;

    this.interactionsAlike = 0;
    this.interactionsCounter = 0;
    this.successAlike = 0;
    this.successCounter = 0;
  }
}
