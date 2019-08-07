import MainCharacter from './MainCharacter';
import AreaRenderer from './AreaRenderer';
import Area from './Area';

export default class MainCharacterRenderer {
    private context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(player: MainCharacter): void {
        this.context.fillStyle = '#444';
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

        if (player.currentArea) {
            this.renderActiveArea(player, player.currentArea);
        }
    }

    public renderActiveArea(player: MainCharacter, area: Area): void {
        this.context.fillStyle = AreaRenderer.visualSettingsByVariant[area.variant].color;
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(
            player.position.x,
            player.position.y,
            player.collisionRadius / 2,
            0,
            Math.PI * 2
        );
        this.context.stroke();
        this.context.fill();
    }
}
