import Game from './Game';
import MainCharacter from './MainCharacter';
import Area from './Area';
import Point from './Point';
import AreaVariant from './AreaVariant';
import getRandomEnumValue from './getRandomEnumValue';

export default class World {
    public game: Game;
    public tick: number;
    public player: MainCharacter;
    public areas: Area[];
    public activeAreaVariant: AreaVariant;
    public lastClearedAreaTick: number;

    public constructor(game: Game) {
        this.game = game;
        this.tick = 0;
        this.player = new MainCharacter(this);
        this.areas = [];
        this.activeAreaVariant = AreaVariant.BLUE;
        this.lastClearedAreaTick = 0;
    }

    public update(): void {
        this.tick++;
        this.player.update();
        this.areas.forEach((area) => {
            area.update();
        });

        this.updateSpawningRandomAreas();
        this.updateRandomizeActiveAreaVariant();
    }

    public removeArea(id: string): void {
        this.areas = this.areas.filter((area) => area.id !== id);
    }

    public updateRandomizeActiveAreaVariant(): void {
        if (this.game.tick % this.game.secondsToTicks(5) === 0) {
            this.activeAreaVariant = getRandomEnumValue(AreaVariant);
        }
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
        const areaRadiusMin: number = this.player.collisionRadius;
        const areaRadiusMax: number = areaRadiusMin * 5;
        const areaRadius: number = Math.floor(Math.random() * areaRadiusMax) + areaRadiusMin;
        const positionOffsetRandomRange: number = 200;

        this.areas.push(
            new Area(
                this,
                {
                    position: new Point(
                        this.player.position.x + Math.floor(Math.random() * positionOffsetRandomRange*2) - positionOffsetRandomRange,
                        this.player.position.y + Math.floor(Math.random() * positionOffsetRandomRange*2) - positionOffsetRandomRange,
                    ),
                    variant: getRandomEnumValue(AreaVariant),
                    radius: areaRadius,
                },
            )
        );
    }
}
