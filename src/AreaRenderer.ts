import Area from './Area';
import AreaVariant from './AreaVariant';

interface AreaVisualSettings {
    [variant: string]: {
        color: string;
    }
}

export default class AreaRenderer {
    private context: CanvasRenderingContext2D;
    public static visualSettingsByVariant: AreaVisualSettings = {
        [AreaVariant.RED]: {
            color: '#f44',
        },
        [AreaVariant.GREEN]: {
            color: '#4f4',
        },
        [AreaVariant.BLUE]: {
            color: '#44f',
        },
    };

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public render(area: Area): void {
        this.context.fillStyle = AreaRenderer.visualSettingsByVariant[area.variant].color;
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 0;
        this.context.beginPath();
        this.context.arc(
            area.position.x,
            area.position.y,
            area.collisionRadius,
            0,
            Math.PI * 2,
        );
        this.context.fill();
    }
}
