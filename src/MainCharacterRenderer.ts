import MainCharacter from './MainCharacter';
import AreaRenderer from './AreaRenderer';

export default class MainCharacterRenderer {
    private context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(mainCharacter: MainCharacter): void {
        this.context.fillStyle = '#444';
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(
            mainCharacter.position.x,
            mainCharacter.position.y,
            mainCharacter.collisionRadius,
            0,
            Math.PI * 2
        );
        this.context.closePath();
        this.context.stroke();
        this.context.fill();

        this.renderActiveArea(mainCharacter);
    }

    public renderActiveArea(mainCharacter: MainCharacter): void {
        this.context.fillStyle = AreaRenderer.visualSettingsByVariant[mainCharacter.world.activeAreaVariant].color;
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(
            mainCharacter.position.x,
            mainCharacter.position.y,
            mainCharacter.collisionRadius / 2,
            0,
            Math.PI * 2
        );
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    }
}
