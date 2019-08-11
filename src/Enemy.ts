import World from './World';
import Point from './Point';
import WorldObject from './WorldObject';
import { createSpring } from 'spring-animator';
import Vector from './Vector';

interface EnemyOptions {
    position: Point;
}

enum EnemyState {
    PATROLL,
    CATCH_UP,
}

export default class Enemy extends WorldObject {
    private patrolDirection: Vector;
    private followPositionSpringX: any;
    private followPositionSpringY: any;
    private state: EnemyState;

    constructor(world: World, options: EnemyOptions) {
        super({
            world,
            position: options.position,
            collisionRadius: 16,
        });

        this.state = EnemyState.PATROLL;
        this.patrolDirection = new Vector(0, 1).rotate(Math.random() * Math.PI * 2).normalized();

        const stiffness = 0.01;
        const dampening = 0.7;

        this.followPositionSpringX = createSpring(stiffness, dampening, world.mainCharacter.position.x);
        this.followPositionSpringY = createSpring(stiffness, dampening, world.mainCharacter.position.y);
    }

    public update(): void {
        switch (this.state) {
            case EnemyState.PATROLL:
                this.updatePatrolling();
                break;
            case EnemyState.CATCH_UP:
                this.updateCatchUpMainCharacter();
                break;
            default:
                this.state = EnemyState.PATROLL;
        }
    }

    private updatePatrolling(): void {
        const distanceFromMainCharacter: number = this.getDistance(this.world.mainCharacter);

        if (distanceFromMainCharacter > 800) {
            this.state = EnemyState.CATCH_UP;
            return;
        }

        if (distanceFromMainCharacter > 600) {
            const isOnRight = this.position.x > this.world.mainCharacter.position.x;
            const isOnLeft = this.position.x < this.world.mainCharacter.position.x;
            const isBelow = this.position.y > this.world.mainCharacter.position.y;
            const isOver = this.position.y < this.world.mainCharacter.position.y;

            if (
                (isOnRight && this.patrolDirection.x > 0) ||
                (isOnLeft && this.patrolDirection.x < 0) ||
                (isBelow && this.patrolDirection.y > 0) ||
                (isOver && this.patrolDirection.y < 0)
            ) {
                this.turnPatrollingAround();
            }
        }
        const speed = 4;
        this.position = this.position.addVector(this.patrolDirection.multiply(speed));
    }

    private updateCatchUpMainCharacter(): void {
        if (this.world.tick % this.world.game.secondsToTicks(1) === 0) {
            this.followPositionSpringX.setDestination(this.world.mainCharacter.position.x);
            this.followPositionSpringY.setDestination(this.world.mainCharacter.position.y);
        }

        this.followPositionSpringX.tick();
        this.followPositionSpringY.tick();

        this.position.x = this.followPositionSpringX.getCurrentValue();
        this.position.y = this.followPositionSpringY.getCurrentValue();

        const distanceFromMainCharacter: number = this.getDistance(this.world.mainCharacter);
        if (distanceFromMainCharacter < (Math.random() * 250 + 50)) {
            this.state = EnemyState.PATROLL;
        }
    }

    private turnPatrollingAround(): void {
        this.patrolDirection = this.patrolDirection.rotate(Math.PI);
    }
}
