import World from './World';
import Point from './Point';
import WorldObject from './WorldObject';
import Area from './Area';

export default class MainCharacter extends WorldObject {
    public position: Point;
    public currentArea: Area | undefined;
    private clearanceRequiredMovementForce: number;

    constructor(world: World) {
        super({
            world,
            position: new Point(0, 0),
            collisionRadius: 16,
        });
        this.position = new Point(0, 0);
        this.clearanceRequiredMovementForce = 10;
    }

    public update(): void {
        const movementDelta: Point = this.world.game.input.getMovementDelta();
        this.position.x += movementDelta.x;
        this.position.y += movementDelta.y;

        this.currentArea = this.findClosestCollidingArea();
        this.updateAreaClearance();
    }

    private findClosestCollidingArea(): Area | undefined {
        return this.world.areas
            .filter(this.isCollidingCenter)
            .reverse()
            .find(() => true);
    }

    private updateAreaClearance(): void {
        if (this.currentArea && this.currentArea.variant === this.world.activeAreaVariant) {
            const movementDelta: Point = this.world.game.input.getMovementDelta();
            const clearanceForce: number = Math.abs(movementDelta.x) + Math.abs(movementDelta.y);
            if (clearanceForce > this.clearanceRequiredMovementForce) {
                this.currentArea.applyClearing(1);
            }
        }
    }
}
