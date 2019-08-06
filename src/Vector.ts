export default class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(vector: Vector): Vector {
        return new Vector(
            this.x + vector.x,
            this.y + vector.y,
        );
    }

    public subtract(vector: Vector): Vector {
        return new Vector(
            this.x - vector.x,
            this.y - vector.y,
        );
    }

    public multiply(scale: number): Vector {
        return new Vector(
            this.x * scale,
            this.y * scale,
        );
    }

    public length(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    public normalized(): Vector {
        const length: number = this.length();
        return new Vector(
            this.x / length,
            this.y / length,
        );
    }

    public rotate(radians: number): Vector {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        return new Vector(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos,
        );
    }

    public angle(): number {
        const angle: number = Math.atan2(this.y, this.x);
        return angle < 0 ? 2 * Math.PI + angle : angle;
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

