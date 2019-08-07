import Game from './Game';
import MainCharacter from './MainCharacter';
import Input from './Input';
import Area from './Area';
import Point from './Point';
import AreaVariant from './AreaVariant';

export default class World {
    public game: Game;
    public tick: number;
    public player: MainCharacter;
    public areas: Area[];

    public constructor(game: Game) {
        this.game = game;
        this.tick = 0;
        this.player = new MainCharacter(this);
        this.areas = [];

        this.spawnSomeExampleAreas();
    }

    public update(): void {
        this.tick++;
        this.player.update();
        this.areas.forEach((area) => {
            area.update();
        });
    }

    private spawnSomeExampleAreas() {
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
}