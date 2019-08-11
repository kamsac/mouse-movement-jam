import World from './World';
import drawTable, {TableRowData} from './drawTable';
import Point from './Point';
import canvasSize from './canvasSize';
import { createSpring } from 'spring-animator';

const kindaCenterX: number = canvasSize.height * 0.3;
const topLeftTablePosition: Point = new Point(kindaCenterX, canvasSize.height * 0.15);
const haxLastRowTableToKeepConstantValuesWidth: TableRowData = {
    key: '',
    value: '      ',
    skipSemicolon: true,
};

export default class AreaRenderer {
    private context: CanvasRenderingContext2D;
    private opacitySpring = createSpring(0.02, 0.5, 0);

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(world: World): void {
        const opacityWhenVisible: number = 0.2;
        const isSlowEnough: boolean = world.mainCharacter.getMovementSpeed() === 0;
        this.opacitySpring.setDestination(isSlowEnough ? opacityWhenVisible : 0);
        this.opacitySpring.tick();
        const opacity: number = this.opacitySpring.getCurrentValue();

        const fontSize: number = 42;
        drawTable(
            {
                context: this.context, rows: [
                    {
                        key: 'SCORE',
                        value: `${world.game.getScore()}`,
                    },
                    {
                        key: 'LAST SCORE',
                        value: `${world.game.getLastGameScore()}`,
                    },
                    {
                        key: 'HIGH SCORE',
                        value: `${world.game.getHighScore()}`,
                    },
                    haxLastRowTableToKeepConstantValuesWidth,
                ],
                topLeftPosition: topLeftTablePosition,
                fontSize: fontSize,
                lineHeight: fontSize * 1.5,
                color: `rgba(0,0,0, ${opacity})`,
            },
        );
    }
}
