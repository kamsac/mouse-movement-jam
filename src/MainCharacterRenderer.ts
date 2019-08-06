import MainCharacter from './MainCharacter';

export default class MainCharacterRenderer {
    private context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(player: MainCharacter): void {
        this.context.fillStyle = 'tomato';
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(
            player.position.x,
            player.position.y,
            player.collisionRadius,
            0,
            Math.PI * 2
        );
        this.context.stroke();
        this.context.fill();
    }
}
