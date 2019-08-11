import World from './World';
import Point from './Point';
import WorldObject from './WorldObject';
import AreaVariant from './AreaVariant';
import { createSpring } from 'spring-animator';
import {SOUND_NAMES} from './sound/SoundPlayer';

interface AreaOptions {
    variant: AreaVariant;
    position: Point,
    radius: number,
}

export default class Area extends WorldObject {
    public variant: AreaVariant;
    private targetRadius: number;
    private cleared: number;
    private maxHealth: number;
    private ticksToLive: number;
    private maxTicksToLive: number;
    private spring: any;

    constructor(world: World, areaOptions: AreaOptions) {
        super({
            world,
            position: areaOptions.position,
            collisionRadius: 0,
        });
        this.variant = areaOptions.variant;
        this.targetRadius = areaOptions.radius;
        this.cleared = 0;
        this.maxHealth = areaOptions.radius;
        this.maxTicksToLive = world.game.secondsToTicks(20);
        this.ticksToLive = this.maxTicksToLive;

        this.spring = createSpring(0.04, 0.4, 0);
        this.spring.setDestination(this.targetRadius);

        this.playSpawnSound();
    }

    public getDyingProgress(): number {
        return Math.min(1, 1 - (this.ticksToLive / this.maxTicksToLive));
    }

    public getClearProgress(): number {
        return Math.min(1, this.cleared / this.maxHealth);
    }

    public applyClearing(amount: number): void {
        this.cleared += amount;
        this.world.game.soundPlayer.playSound(SOUND_NAMES.ChargeSound, {detune: this.getClearProgress() * 100000});
    }

    public update(): void {
        super.update();

        this.spring.tick();
        this.collisionRadius = this.spring.getCurrentValue();

        this.updateLooseClearance();

        const areaLifeLeftProgress = (1 - this.getDyingProgress());
        const clearProgress = this.getClearProgress();
        if (clearProgress >= areaLifeLeftProgress && clearProgress > 0) {
            this.getCleared();
        }

        if (this.ticksToLive <= 0) {
            this.spring.setDestination(0);
            this.collisionRadius = this.spring.getCurrentValue();

            if (this.collisionRadius <= 0) {
                this.world.removeArea(this.id);
            }
        }

        if (!this.isCollidingCenter(this.world.mainCharacter)) {
            this.ticksToLive--;
        }
    }

    public getCurrentScoreWorth(): number {
        return Math.floor(this.cleared * 10);
    }

    public getCleared(): void {
        this.world.game.addScore(this.getCurrentScoreWorth());
        this.world.game.soundPlayer.playSound(SOUND_NAMES.EnemySpawn);
        this.world.lastClearedAreaTick = this.world.game.tick;
        this.world.spawnEnemy();
        this.world.removeArea(this.id);
    }

    private updateLooseClearance(): void {
        if (this.cleared > 0) {
            if (!this.isColliding(this.world.mainCharacter)) {
                this.applyClearing(-0.25);
            }
        }
    }

    private playSpawnSound(): void {
        const spawnSounds = [
            SOUND_NAMES.AreaSpawn1,
            SOUND_NAMES.AreaSpawn2,
            SOUND_NAMES.AreaSpawn3,
        ];
        const randomSpawnSound = spawnSounds[Math.floor(Math.random() * 3)];
        this.world.game.soundPlayer.playSound(randomSpawnSound, {volume: 0.2});
    }
}
