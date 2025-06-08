import { Matrix3 } from './Matrix3';
import { Pool } from './Pool';
import { Vec2D } from './vec/Vec2D';

export class Context {
    public readonly vectorPool = new Pool<Vec2D>(
        () => new Vec2D(),
        (v) => {
            v.zero();
        }
    );
    public readonly matrixPool = new Pool<Matrix3>(
        () => new Matrix3(),
        (m) => {
            m.setIdentity();
        }
    );
}
