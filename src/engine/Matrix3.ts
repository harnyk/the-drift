import { Vec2D } from './vec/Vec2D';

export class Matrix3 {
    values: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1]; // row-major

    assign(other: Matrix3): void {
        for (let i = 0; i < 9; i++) {
            this.values[i] = other.values[i];
        }
    }

    setIdentity(): void {
        const v = this.values;
        v[0] = 1;
        v[1] = 0;
        v[2] = 0;

        v[3] = 0;
        v[4] = 1;
        v[5] = 0;

        v[6] = 0;
        v[7] = 0;
        v[8] = 1;
    }

    setTranslation(tx: number, ty: number): void {
        const v = this.values;
        v[0] = 1;
        v[1] = 0;
        v[2] = tx;

        v[3] = 0;
        v[4] = 1;
        v[5] = ty;

        v[6] = 0;
        v[7] = 0;
        v[8] = 1;
    }

    setRotation(angleRad: number): void {
        const c = Math.cos(angleRad);
        const s = Math.sin(angleRad);
        const v = this.values;
        v[0] = c;
        v[1] = -s;
        v[2] = 0;

        v[3] = s;
        v[4] = c;
        v[5] = 0;

        v[6] = 0;
        v[7] = 0;
        v[8] = 1;
    }

    setScale(sx: number, sy: number): void {
        const v = this.values;
        v[0] = sx;
        v[1] = 0;
        v[2] = 0;

        v[3] = 0;
        v[4] = sy;
        v[5] = 0;

        v[6] = 0;
        v[7] = 0;
        v[8] = 1;
    }

    multiply(other: Matrix3): void {
        const a = this.values;
        const b = other.values;
        const r0 = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
        const r1 = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
        const r2 = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

        const r3 = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
        const r4 = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
        const r5 = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

        const r6 = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
        const r7 = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
        const r8 = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

        a[0] = r0;
        a[1] = r1;
        a[2] = r2;

        a[3] = r3;
        a[4] = r4;
        a[5] = r5;

        a[6] = r6;
        a[7] = r7;
        a[8] = r8;
    }

    transformPointInPlace(p: Vec2D): void {
        const v = this.values;
        const x = p.x;
        const y = p.y;
        const newX = v[0] * x + v[1] * y + v[2];
        const newY = v[3] * x + v[4] * y + v[5];
        p.set(newX, newY);
    }

    invertInPlace(): void {
        const m = this.values;
        const [a, b, c, d, e, f, g, h, i] = m;

        const det =
            a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

        if (det === 0) throw new Error('Matrix not invertible');

        const inv0 = (e * i - f * h) / det;
        const inv1 = -(b * i - c * h) / det;
        const inv2 = (b * f - c * e) / det;

        const inv3 = -(d * i - f * g) / det;
        const inv4 = (a * i - c * g) / det;
        const inv5 = -(a * f - c * d) / det;

        const inv6 = (d * h - e * g) / det;
        const inv7 = -(a * h - b * g) / det;
        const inv8 = (a * e - b * d) / det;

        m[0] = inv0;
        m[1] = inv1;
        m[2] = inv2;

        m[3] = inv3;
        m[4] = inv4;
        m[5] = inv5;

        m[6] = inv6;
        m[7] = inv7;
        m[8] = inv8;
    }
}
