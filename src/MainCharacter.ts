import World from './World';
import Point from './Point';
import WorldObject from './WorldObject';
import Area from './Area';
import Enemy from './Enemy';

export default class MainCharacter extends WorldObject {
    public position: Point;
    public currentArea: Area | undefined;
    public readonly clearanceRequiredMinSpeed: number;
    private movementSpeed: number;

    constructor(world: World) {
        super({
            world,
            position: new Point(0, 0),
            collisionRadius: 16,
        });
        this.position = new Point(0, 0);
        this.clearanceRequiredMinSpeed = 10;
        this.movementSpeed = 0;
    }

    public update(): void {
        const movementDelta: Point = this.world.game.input.getMovementDelta();
        this.position.x += movementDelta.x;
        this.position.y += movementDelta.y;

        this.movementSpeed = Math.abs(movementDelta.x) + Math.abs(movementDelta.y);

        this.currentArea = this.findClosestCollidingArea();
        this.updateAreaClearance();

        const collidingEnemy: Enemy | undefined = this.world.enemies.find((enemy) => this.isColliding(enemy));
        if (collidingEnemy) {
            this.world.game.restartWorld();
        }
    }

    public getMovementSpeed(): number {
        return this.movementSpeed;
    }

    private findClosestCollidingArea(): Area | undefined {
        return this.world.areas
            .filter(this.isCollidingCenter)
            .reverse()
            .find(() => true);
    }

    private updateAreaClearance(): void {
        if (this.currentArea && this.currentArea.variant === this.world.activeAreaVariant) {
            if (this.movementSpeed > this.clearanceRequiredMinSpeed) {
                this.currentArea.applyClearing(1);
            }
        }
    }
}
