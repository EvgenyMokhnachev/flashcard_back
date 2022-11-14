class Game {
    private currentX: number;
    private startTime: number;
    private acceleration: number;
    private timeStep: number;

    constructor(currentX?: number, startTime?: number, acceleration?: number, timeStep?: number) {
        this.currentX = currentX || 1.0;
        this.startTime = startTime;
        this.acceleration = acceleration;
        this.timeStep = timeStep;
    }
}

export default Game;
