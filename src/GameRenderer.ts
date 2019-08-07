import Game from './Game';
import World from './World';
import Size from './Size';
import MainCharacterRenderer from './MainCharacterRenderer';
import AreaRenderer from './AreaRenderer';
import Point from './Point';

export const canvasSize: Size = {
    width: 800,
    height: 600,
};

interface CameraSettings {
    scale: number;
    offset: Point;
    ghosting: number;
}

export default class GameRenderer {
    private game: Game;
    public canvas!: HTMLCanvasElement;
    private context!: CanvasRenderingContext2D;

    private cameraSettings: CameraSettings;
    private mainCharacterRenderer: MainCharacterRenderer;
    private areaRenderer: AreaRenderer;

    public constructor(game: Game) {
        this.game = game;

        this.createCanvas();
        this.attachCanvas();

        this.cameraSettings = {
            scale: 1,
            offset: new Point(0, 0),
            ghosting: 0.4,
        };

        this.mainCharacterRenderer = new MainCharacterRenderer(this.context);
        this.areaRenderer = new AreaRenderer(this.context);
    }

    public render(world: World): void {
        this.clearCanvas();

        this.centerCamera(world);
        this.offsetCamera();
        this.scaleCamera();

        world.areas.forEach((area) => {
            this.areaRenderer.render(area);
        });
        this.mainCharacterRenderer.render(world.player);
    }

    private centerCamera(world: World): void {
        this.context.translate(
            -world.player.position.x * this.cameraSettings.scale + canvasSize.width / 2,
            -world.player.position.y * this.cameraSettings.scale + canvasSize.height / 2,
        );
    }

    private offsetCamera(): void {
        this.context.translate(
            this.cameraSettings.offset.x * this.cameraSettings.scale,
            this.cameraSettings.offset.y * this.cameraSettings.scale,
        );
    }

    private scaleCamera(): void {
        this.context.scale(this.cameraSettings.scale, this.cameraSettings.scale);
    }

    private clearCanvas(): void {
        this.context.setTransform(1,0,0,1,0,0);

        this.context.fillStyle = `rgba(255, 255, 255, ${(1 - this.cameraSettings.ghosting) })`;
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

        this.canvas.addEventListener('mousedown', () => {
            this.canvas.requestPointerLock();
        });
    }

    private isPointerLocked(): boolean {
        return document.pointerLockElement === this.canvas;
    }
}
