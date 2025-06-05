import { Vec2D } from "./vec/Vec2D";


export class Matrix3 {
    values: number[];

    constructor(values?: number[]) {
        this.values = values || [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    static identity() {
        return new Matrix3();
    }

    static translation(tx: number, ty: number) {
        return new Matrix3([1, 0, tx, 0, 1, ty, 0, 0, 1]);
    }

    static rotation(angleRad: number) {
        const c = Math.cos(angleRad);
        const s = Math.sin(angleRad);
        return new Matrix3([c, -s, 0, s, c, 0, 0, 0, 1]);
    }

    static scale(sx: number, sy: number) {
        return new Matrix3([sx, 0, 0, 0, sy, 0, 0, 0, 1]);
    }

    multiply(other: Matrix3): Matrix3 {
        const a = this.values;
        const b = other.values;
        const r = new Array(9).fill(0);

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                r[row * 3 + col] =
                    a[row * 3 + 0] * b[0 * 3 + col] +
                    a[row * 3 + 1] * b[1 * 3 + col] +
                    a[row * 3 + 2] * b[2 * 3 + col];
            }
        }

        return new Matrix3(r);
    }

    transformPoint(p: Vec2D): Vec2D {
        const [a, b, c, d, e, f, g, h, i] = this.values;
        const x = p.x, y = p.y;
        const newX = a * x + b * y + c;
        const newY = d * x + e * y + f;
        return new Vec2D(newX, newY);
    }

    invert(): Matrix3 {
        const m = this.values;
        const [a, b, c, d, e, f, g, h, i] = m;

        const det = a * e * i +
            b * f * g +
            c * d * h -
            c * e * g -
            b * d * i -
            a * f * h;
        if (det === 0) throw new Error('Matrix not invertible');

        const inv = [
            (e * i - f * h) / det,
            (c * h - b * i) / det,
            (b * f - c * e) / det,
            (f * g - d * i) / det,
            (a * i - c * g) / det,
            (c * d - a * f) / det,
            (d * h - e * g) / det,
            (b * g - a * h) / det,
            (a * e - b * d) / det,
        ];

        return new Matrix3(inv);
    }
}
