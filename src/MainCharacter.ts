import World from './World';
import Point from './Point';
import WorldObject from './WorldObject';

export default class MainCharacter extends WorldObject {
    public position: Point;

    constructor(world: World) {
        super({
            world,
            position: new Point(0, 0),
            collisionRadius: 16,
        });
        this.position = new Point(0, 0);
    }

    public update(): void {
        const movementDelta: Point = this.world.game.input.getMovementDelta();
        this.position.x += movementDelta.x;
        this.position.y += movementDelta.y;
    }
}
