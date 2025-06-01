export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromPolar(length: number, angleRad: number): Point {
        return new Point(
            Math.cos(angleRad) * length,
            Math.sin(angleRad) * length
        );
    }

    scale(s: number) {
        return new Point(this.x * s, this.y * s);
    }

    add(p: Point) {
        return new Point(this.x + p.x, this.y + p.y);
    }

    dot(other: Point): number {
        return this.x * other.x + this.y * other.y;
    }

    cross(other: Point): number {
        return this.x * other.y - this.y * other.x;
    }

    get length(): number {
        return Math.hypot(this.x, this.y);
    }

    get angle(): number {
        return Math.atan2(this.y, this.x);
    }

    rotate(angleRad: number): Point {
        const c = Math.cos(angleRad);
        const s = Math.sin(angleRad);
        return new Point(this.x * c - this.y * s, this.x * s + this.y * c);
    }

    normalize(): Point {
        const len = this.length;
        return len === 0
            ? new Point(0, 0)
            : new Point(this.x / len, this.y / len);
    }
}
