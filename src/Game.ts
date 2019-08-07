import Stats from 'stats.js';
import GameRenderer from './GameRenderer';
import World from './World';
import Input from './Input';

export default class Game {
    public readonly ticksPerSecond: number;
    public input: Input;
    public tick: number;
    private readonly tickTime: number; // ms
    private lastTickTime: number; // ms
    private currentUpdateLag: number; // ms
    private readonly maxUpdateLag: number; // ms
    private fpsStats!: Stats;
    private world: World;
    private readonly gameRenderer: GameRenderer;

    public constructor() {
        this.ticksPerSecond = 60;
        this.tickTime = 1000 / this.ticksPerSecond;
        this.lastTickTime = 0;
        this.currentUpdateLag = 0;
        this.maxUpdateLag = 500;
        this.input = new Input();
        this.gameRenderer = new GameRenderer(this);
        this.tick = 0;
        this.world = new World(this);
        this.initFpsStats();
        this.requestNextFrame();
    }

    public restartWorld(): void {
        this.world = new World(this);
    }

    private requestNextFrame(): void {
        window.requestAnimationFrame((timestamp: number) => { this.gameLoop(timestamp); });
    }

    private gameLoop(time: number): void {
        this.fpsStats.begin();
        const tickDeltaTime: number = Math.min(this.maxUpdateLag, time - this.lastTickTime);
        this.currentUpdateLag += tickDeltaTime;

        while (this.currentUpdateLag > this.tickTime) {
            this.currentUpdateLag -= this.tickTime;
            this.update(this.tickTime / 1000);
        }
        this.render();
        this.lastTickTime = time;
        this.fpsStats.end();
        this.requestNextFrame();
    }

    private update(deltaTimeInSeconds: number): void {
        this.tick++;
        this.input.update();
        this.world.update();
    }

    private render(): void {
        this.gameRenderer.render(this.world);
    }

    private initFpsStats(): void {
        this.fpsStats = new Stats();
        this.fpsStats.showPanel(0);
        document.body.appendChild(this.fpsStats.dom);
    }
}
