import { IVec2D } from './IVec2D';

export class Vec2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    assign(vec: IVec2D) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }

    assignPolar(length: number, angleRad: number) {
        this.x = Math.cos(angleRad) * length;
        this.y = Math.sin(angleRad) * length;
        return this;
    }

    clone() {
        return new Vec2D(this.x, this.y);
    }

    zero() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    scale(s: number) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    add(p: IVec2D) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    sub(p: IVec2D) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    }

    dot(other: IVec2D): number {
        return this.x * other.x + this.y * other.y;
    }

    cross(other: IVec2D): number {
        return this.x * other.y - this.y * other.x;
    }

    get length(): number {
        return Math.hypot(this.x, this.y);
    }

    get angle(): number {
        return Math.atan2(this.y, this.x);
    }

    rotate(angleRad: number) {
        const c = Math.cos(angleRad);
        const s = Math.sin(angleRad);
        this.x = this.x * c - this.y * s;
        this.y = this.x * s + this.y * c;
        return this;
    }

    normalize() {
        const len = this.length;
        return len === 0
            ? new Vec2D(0, 0)
            : new Vec2D(this.x / len, this.y / len);
    }
}
