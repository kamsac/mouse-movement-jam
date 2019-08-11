import Enemy from './Enemy';

export default class MainCharacterRenderer {
    private context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(enemy: Enemy): void {
        this.context.fillStyle = '#000';
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(
            enemy.position.x,
            enemy.position.y,
            enemy.collisionRadius,
            0,
            Math.PI * 2
        );
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    }
}
