import World from './World';
import Point from './Point';

export default abstract class WorldObject {
    public world: World;
    public position: Point;
    public collisionRadius: number;

    constructor(options: WorldObjectOptions) {
        this.world = options.world;
        this.position = options.position;
        this.collisionRadius = options.collisionRadius;
    }
}

interface WorldObjectOptions {
    world: World;
    position: Point;
    collisionRadius: number;
}
