import Game from './Game';
import MainCharacter from './MainCharacter';
import Area from './Area';
import Point from './Point';
import AreaVariant from './AreaVariant';
import getRandomEnumValue from './getRandomEnumValue';
import Enemy from './Enemy';

export default class World {
    public game: Game;
    public tick: number;
    public mainCharacter: MainCharacter;
    public areas: Area[];
    public enemies: Enemy[];
    public activeAreaVariant: AreaVariant;
    public lastClearedAreaTick: number;

    public constructor(game: Game) {
        this.game = game;
        this.tick = 0;
        this.mainCharacter = new MainCharacter(this);
        this.areas = [];
        this.enemies = [];
        this.activeAreaVariant = AreaVariant.BLUE;
        this.lastClearedAreaTick = 0;
    }

    public update(): void {
        this.tick++;
        this.mainCharacter.update();
        this.areas.forEach((area) => {
            area.update();
        });
        this.enemies.forEach((enemy) => {
            enemy.update();
        });

        this.updateSpawningRandomAreas();
        this.updateRandomizeActiveAreaVariant();
    }

    public removeArea(id: string): void {
        this.areas = this.areas.filter((area) => area.id !== id);
    }

    public spawnEnemy(): void {
        const distanceFromMainCharacter = 1000;
        const movementDelta: Point = this.game.input.getMovementDelta();
        const offsetX = movementDelta.x > 0 ? distanceFromMainCharacter : -distanceFromMainCharacter;
        const offsetY = movementDelta.y > 0 ? distanceFromMainCharacter : -distanceFromMainCharacter;
        const position: Point = new Point(
            this.mainCharacter.position.x + offsetX,
            this.mainCharacter.position.y + offsetY,
        );
        this.enemies.push(new Enemy(this, {position}));
    }

    private updateRandomizeActiveAreaVariant(): void {
        if (this.game.tick % this.game.secondsToTicks(5) === 0) {
            this.activeAreaVariant = getRandomEnumValue(AreaVariant);
        }
    }

    private getMostPopularAreaVariantWithQuickAndDirtyHax(): AreaVariant {
        const countedByAreaVariant = {
            [AreaVariant.RED]: 0,
            [AreaVariant.GREEN]: 0,
            [AreaVariant.BLUE]: 0,
        };

        this.areas.forEach((area) => {
            countedByAreaVariant[area.variant]++;
        });

        if (countedByAreaVariant[AreaVariant.BLUE] > countedByAreaVariant[AreaVariant.GREEN] && countedByAreaVariant[AreaVariant.BLUE] > countedByAreaVariant[AreaVariant.RED]) {
            return AreaVariant.BLUE;
        }

        if (countedByAreaVariant[AreaVariant.GREEN] > countedByAreaVariant[AreaVariant.RED] && countedByAreaVariant[AreaVariant.GREEN] > countedByAreaVariant[AreaVariant.BLUE]) {
            return AreaVariant.GREEN;
        }

        return AreaVariant.RED;
    }

    private getNextActiveAreaVariantWithQuickAndDirtyHax(): AreaVariant {
        const countedByAreaVariant = {
            [AreaVariant.RED]: 0,
            [AreaVariant.GREEN]: 0,
            [AreaVariant.BLUE]: 0,
        };

        this.areas.forEach((area) => {
            countedByAreaVariant[area.variant]++;
        });

        const possibleVariants: AreaVariant[] = [];
        if (countedByAreaVariant[AreaVariant.RED] > 0) possibleVariants.push(AreaVariant.RED);
        if (countedByAreaVariant[AreaVariant.GREEN] > 0) possibleVariants.push(AreaVariant.GREEN);
        if (countedByAreaVariant[AreaVariant.BLUE] > 0) possibleVariants.push(AreaVariant.BLUE);

        const nextVariant: AreaVariant | undefined = possibleVariants
            .sort(() => Math.random() - 0.5)
            .find(() => true);

        if (!nextVariant) {
            return getRandomEnumValue(AreaVariant);
        }

        return nextVariant;
    }

    private updateSpawningRandomAreas(): void {
        if (this.game.tick % this.game.secondsToTicks(2) === 0) {
            this.spawnRandomArea();
        }
    }

    private spawnSomeExampleAreas(): void {
        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(50, 70),
                    variant: AreaVariant.RED,
                    radius: 64,
                },
            )
        );

        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(100, 150),
                    variant: AreaVariant.GREEN,
                    radius: 48,
                },
            )
        );
        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(150, 120),
                    variant: AreaVariant.GREEN,
                    radius: 38,
                },
            )
        );
        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(170, 170),
                    variant: AreaVariant.GREEN,
                    radius: 42,
                },
            )
        );
        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(120, 180),
                    variant: AreaVariant.GREEN,
                    radius: 36,
                },
            )
        );


        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(180, 70),
                    variant: AreaVariant.BLUE,
                    radius: 42,
                },
            )
        );
        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(220, 90),
                    variant: AreaVariant.BLUE,
                    radius: 64,
                },
            )
        );
    }

    private spawnRandomArea(): void {
        const areaRadiusMin: number = this.mainCharacter.collisionRadius * 1.5;
        const areaRadiusMax: number = areaRadiusMin * 3;
        const areaRadius: number = Math.floor(Math.random() * areaRadiusMax) + areaRadiusMin;
        const positionOffsetRandomRange: number = 300;

        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(
                        this.mainCharacter.position.x + Math.floor(Math.random() * positionOffsetRandomRange*2) - positionOffsetRandomRange,
                        this.mainCharacter.position.y + Math.floor(Math.random() * positionOffsetRandomRange*2) - positionOffsetRandomRange,
                    ),
                    variant: getRandomEnumValue(AreaVariant),
                    radius: areaRadius,
                },
            )
        );
    }
}
