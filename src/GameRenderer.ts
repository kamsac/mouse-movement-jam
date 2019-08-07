import Game from './Game';
import World from './World';
import Size from './Size';
import MainCharacterRenderer from './MainCharacterRenderer';
import AreaRenderer from './AreaRenderer';

export const canvasSize: Size = {
    width: 800,
    height: 600,
};

export default class GameRenderer {
    private game: Game;
    public canvas!: HTMLCanvasElement;
    private context!: CanvasRenderingContext2D;

    private mainCharacterRenderer: MainCharacterRenderer;
    private areaRenderer: AreaRenderer;

    public constructor(game: Game) {
        this.game = game;

        this.createCanvas();
        this.attachCanvas();

        this.mainCharacterRenderer = new MainCharacterRenderer(this.context);
        this.areaRenderer = new AreaRenderer(this.context);
    }

    public render(world: World): void {
        this.clearCanvas();
        this.centerCamera(world);

        world.areas.forEach((area) => {
            this.areaRenderer.render(area);
        });
        this.mainCharacterRenderer.render(world.player);
    }

    private centerCamera(world: World): void {
        this.context.translate(
            -world.player.position.x + canvasSize.width/2,
            -world.player.position.y + canvasSize.height/2,
        );
    }

    private clearCanvas(): void {
        this.context.setTransform(1,0,0,1,0,0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#eee';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private createCanvas(): void {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d')!;

        this.canvas.width = canvasSize.width;
        this.canvas.height = canvasSize.height;

        this.context.imageSmoothingEnabled = false;
        // @ts-ignore
        this.context.webkitImageSmoothingEnabled = false;
    }

    private attachCanvas(): void {
        document.body.appendChild(this.canvas);
    }
}
