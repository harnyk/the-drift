import { Pool } from './Pool';
import { Vec2D } from './vec/Vec2D';

export class Context {
    public readonly vectorPool: Pool<Vec2D>;

    constructor() {
        this.vectorPool = new Pool<Vec2D>(
            () => new Vec2D(),
            (v) => v.zero()
        );
    }
}
