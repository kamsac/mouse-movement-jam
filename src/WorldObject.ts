import World from './World';
import Point from './Point';

export default abstract class WorldObject {
    public world: World;
    public position: Point;
    public collisionRadius: number;
    public ticksLived: number;

    constructor(options: WorldObjectOptions) {
        this.world = options.world;
        this.position = options.position;
        this.collisionRadius = options.collisionRadius;
        this.ticksLived = 0;
    }

    public update(): void {
        this.ticksLived++;
    }

    public getDistance(otherWorldObject: WorldObject): number {
        const x: number = this.position.x - otherWorldObject.position.x;
        const y: number = this.position.y - otherWorldObject.position.y;
        return Math.sqrt(x*x+y*y);
    }

    public getDistanceQuick(otherWorldObject: WorldObject): number {
        const x: number = this.position.x - otherWorldObject.position.x;
        const y: number = this.position.y - otherWorldObject.position.y;
        return x + y;
    }

    public isColliding = (otherWorldObject: WorldObject): boolean => {
        const distance: number = this.getDistance(otherWorldObject);
        return (this.collisionRadius + otherWorldObject.collisionRadius) > distance;
    }

    public isCollidingCenter = (otherWorldObject: WorldObject): boolean => {
        const distance: number = this.getDistance(otherWorldObject);
        return (otherWorldObject.collisionRadius) > distance;
    }
}

interface WorldObjectOptions {
    world: World;
    position: Point;
    collisionRadius: number;
}
