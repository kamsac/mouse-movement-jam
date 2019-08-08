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
    private spring: any;

    constructor(world: World, areaOptions: AreaOptions) {
        super({
            world,
            position: areaOptions.position,
            collisionRadius: 0,
        });
        this.variant = areaOptions.variant;
        this.targetRadius = areaOptions.radius;

        this.spring = createSpring(0.04, 0.4, 0);
        this.spring.setDestination(this.targetRadius);
    }

    public update(): void {
        super.update();

        this.spring.tick();
        this.collisionRadius = this.spring.getCurrentValue();
    }
}
