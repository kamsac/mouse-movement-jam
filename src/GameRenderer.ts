import Game from './Game';
import World from './World';
import Size from './Size';
import MainCharacterRenderer from './MainCharacterRenderer';
import AreaRenderer from './AreaRenderer';
import Point from './Point';
import { createSpring } from 'spring-animator';

export const canvasSize: Size = {
    width: 800,
    height: 600,
};

interface CameraSettings {
    scale: number;
    offset: Point;
    ghosting: number;
    followSpring: {
        stiffness: number;
        dampening: number;
    }
}

export default class GameRenderer {
    private game: Game;
    public canvas!: HTMLCanvasElement;
    private context!: CanvasRenderingContext2D;

    private targetCameraPosition: Point;
    private cameraSpring: {
        x: any;
        y: any;
    };

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
            followSpring: {
                stiffness: 0.03,
                dampening: 0.2,
            }
        };

        this.cameraSpring = {
            x: createSpring(this.cameraSettings.followSpring.stiffness, this.cameraSettings.followSpring.dampening, this.game.world.player.position.x),
            y: createSpring(this.cameraSettings.followSpring.stiffness, this.cameraSettings.followSpring.dampening, this.game.world.player.position.y),
        };

        this.targetCameraPosition = new Point(0, 0);
        this.mainCharacterRenderer = new MainCharacterRenderer(this.context);
        this.areaRenderer = new AreaRenderer(this.context);
    }

    public render(world: World): void {
        this.clearCanvas();

        this.renderScore();

        this.updateScreenShake(world);
        this.centerCamera(world);
        this.offsetCamera();
        this.scaleCamera();

        this.cameraSpring.x.setDestination(this.targetCameraPosition.x);
        this.cameraSpring.y.setDestination(this.targetCameraPosition.y);
        this.cameraSpring.x.tick();
        this.cameraSpring.y.tick();

        this.context.translate(
            this.cameraSpring.x.getCurrentValue(),
            this.cameraSpring.y.getCurrentValue(),
        );

        world.areas.forEach((area) => {
            this.areaRenderer.render(area);
        });
        this.mainCharacterRenderer.render(world.player);
    }

    private renderScore(): void {
        const fontSize: number = 36;
        this.context.font = `bold ${fontSize}px monospace`;
        this.context.textAlign = 'left';
        this.context.fillStyle = '#000';
        this.context.lineWidth = 1;
        this.context.fillText(`Score: ${this.game.getScore()}`, fontSize, fontSize);
    }

    private centerCamera(world: World): void {
        this.targetCameraPosition.x = -world.player.position.x * this.cameraSettings.scale + canvasSize.width / 2;
        this.targetCameraPosition.y = -world.player.position.y * this.cameraSettings.scale + canvasSize.height / 2;
    }

    private offsetCamera(): void {
        this.targetCameraPosition.x += this.cameraSettings.offset.x * this.cameraSettings.scale;
        this.targetCameraPosition.y += this.cameraSettings.offset.y * this.cameraSettings.scale;
    }

    private setScreenShake(range: number): void {
        this.cameraSettings.offset.x = Math.round(Math.random() * range - (range / 2));
        this.cameraSettings.offset.y = Math.round(Math.random() * range - (range / 2));
    }

    private updateScreenShake(world: World): void {
        const force: number = world.player.currentArea
            ? world.player.currentArea.getClearProgress() * world.player.currentArea.collisionRadius * 4
            : 0;
        this.setScreenShake(force);
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
