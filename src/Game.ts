import Stats from 'stats.js';
import GameRenderer from './GameRenderer';
import World from './World';
import Input from './Input';
import SoundPlayer, {SOUND_NAMES} from './sound/SoundPlayer';

export default class Game {
    public readonly ticksPerSecond: number;
    public input: Input;
    public tick: number;
    public world: World;
    public readonly soundPlayer: SoundPlayer;
    private readonly tickTime: number; // ms
    private lastTickTime: number; // ms
    private currentUpdateLag: number; // ms
    private readonly maxUpdateLag: number; // ms
    private fpsStats!: Stats;
    private readonly gameRenderer: GameRenderer;
    private score: number;

    public constructor() {
        this.ticksPerSecond = 60;
        this.tickTime = 1000 / this.ticksPerSecond;
        this.lastTickTime = 0;
        this.currentUpdateLag = 0;
        this.maxUpdateLag = 500;
        this.input = new Input();
        this.world = new World(this);
        this.score = 0;
        this.tick = 0;
        this.soundPlayer = new SoundPlayer();
        this.gameRenderer = new GameRenderer(this);
        this.initFpsStats();
        this.requestNextFrame();
    }

    public restartWorld(): void {
        this.world = new World(this);
        this.score = 0;
        this.soundPlayer.playSound(SOUND_NAMES.GameOver, {volume: 0.3});
    }

    public addScore(points: number): void {
        this.score += points;
    }

    public getScore(): number {
        return this.score;
    }

    public secondsToTicks(seconds: number): number {
        return seconds * this.ticksPerSecond;
    }

    public ticksToSeconds(ticks: number): number {
        return ticks / this.ticksPerSecond;
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
