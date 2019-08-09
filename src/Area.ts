import World from './World';
import Point from './Point';
import WorldObject from './WorldObject';
import AreaVariant from './AreaVariant';
import { createSpring } from 'spring-animator';

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

        this.spring = createSpring(0.04, 0.4, 0);
        this.spring.setDestination(this.targetRadius);
    }

    public getClearProgress(): number {
        return Math.min(1, this.cleared / this.maxHealth);
    }

    public applyClearing(amount: number): void {
        this.cleared += amount;
    }

    public update(): void {
        super.update();

        this.spring.tick();
        this.collisionRadius = this.spring.getCurrentValue();

        this.updateLooseClearance();
        if (this.getClearProgress() >= 1) {
            this.getCleared();
        }
    }

    public getCleared(): void {
        this.world.game.addScore(100);
        this.world.removeArea(this.id);
    }

    private updateLooseClearance(): void {
        if (this.cleared > 0) {
            if (!this.isColliding(this.world.player)) {
                this.applyClearing(-0.25);
            }
        }
    }
}
