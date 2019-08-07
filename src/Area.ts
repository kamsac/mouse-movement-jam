import World from './World';
import Point from './Point';
import WorldObject from './WorldObject';
import AreaVariant from './AreaVariant';

interface AreaOptions {
    variant: AreaVariant;
    position: Point,
    radius: number,
}

export default class Area extends WorldObject {
    public variant: AreaVariant;

    constructor(world: World, areaOptions: AreaOptions) {
        super({
            world,
            position: areaOptions.position,
            collisionRadius: areaOptions.radius,
        });
        this.variant = areaOptions.variant;
    }

    public update(): void {

    }
}
