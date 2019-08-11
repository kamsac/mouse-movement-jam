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
    private scoreOpacitySpring = createSpring(0.02, 0.5, 0);

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(world: World): void {
        const opacityWhenVisible: number = 0.2;
        const isSlowEnough: boolean = world.mainCharacter.getMovementSpeed() === 0;
        this.scoreOpacitySpring.setDestination(isSlowEnough ? opacityWhenVisible : 0);
        this.scoreOpacitySpring.tick();

        this.renderScores(world);

        if (world.game.getScore() === 0) {
            const opacity: number = this.scoreOpacitySpring.getCurrentValue() * 2;
            this.context.fillStyle = `rgba(0,0,0,${opacity})`;
            this.renderTitle();
            this.renderHelp();
        }
    }

    private renderScores(world: World): void {
        const opacity: number = this.scoreOpacitySpring.getCurrentValue();
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

    private renderTitle(): void {
        const title = 'Elkronez';
        const description = 'A game made for Mouse Movement Jam by Kamil Sacewicz. Enjoy!';

        this.context.font = '24px serif';
        this.context.fillText(title, paddingLeft, canvasSize.height * 0.65);
        this.context.font = '16px monospace';
        this.context.fillText(description, paddingLeft, canvasSize.height * 0.7);
    }

    private renderHelp(): void {
        const lines: string[] = [
            'Control your character by moving a mouse.',
            'Clear circles of your active color by moving fast inside them.',
            // 'Move fast inside the circles to clear them.',
            // 'Only circles of the same color as the active one can be cleared.',
            'Black dots are your enemies, they spawn after you clear a circle.',
            // 'Black dots are your enemies, avoid them.',
            // 'Every time a circle is cleared, new enemy spawns.',
            'Click anywhere to lock mouse pointer.',
        ];

        this.context.font = '16px monospace';
        const lineHeight = 24;
        lines.forEach((line, index) => {
            this.context.fillText(line, paddingLeft, canvasSize.height * 0.8 + lineHeight * index);
        });
    }
}

const paddingLeft = canvasSize.width * 0.09;
