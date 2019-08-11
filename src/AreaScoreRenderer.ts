import Area from './Area';
import AreaRenderer from './AreaRenderer';

export default class AreaScoreRenderer {
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(area: Area): void {
        const score: number = area.getCurrentScoreWorth();
        if (score <= 0) {
            return;
        }
        const fontSize: number = 32;
        this.context.font = `bold ${fontSize}px`;
        this.context.fillStyle = '#000';
        this.context.strokeStyle = '#fff';
        this.context.lineWidth = 1;
        this.context.textAlign = 'center';
        const x = area.position.x;
        const y = area.position.y - area.collisionRadius;
        this.context.strokeText(`${score}`, x, y);
        this.context.fillText(`${score}`, x, y);
    }
}
