import Point from './Point';

export default class Input {
    private movementDelta: Point = new Point(0, 0);
    private queue: Point[] = [];

    constructor() {
        this.initEventListener();
    }

    public getMovementDelta(): Point {
        return this.movementDelta;
    }

    public update(): void {
        this.movementDelta = this.queue.reduce((acc, cur) => {
            acc.x += cur.x;
            acc.y += cur.y;
            return acc;
        }, new Point(0, 0));

        this.queue = [];
    }

    private handleMouseMove = (event: MouseEvent): void => {
        this.queue.push(new Point(event.movementX, event.movementY));
    };

    private initEventListener(): void {
        window.removeEventListener('mousemove', this.handleMouseMove, false);
        window.addEventListener('mousemove', this.handleMouseMove, false);
    }
}
