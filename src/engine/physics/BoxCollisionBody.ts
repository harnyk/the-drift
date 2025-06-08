import { Context } from '../Context';
import { Vec2D } from '../vec/Vec2D';
import { CollisionBody } from './CollisionBody';
import { BodyType } from './CollisionDetector';

export class BoxCollisionBody extends CollisionBody {
    size: Vec2D;

    constructor(
        private readonly context: Context,
        position: Vec2D,
        size: Vec2D,
        angle = 0,
        type: BodyType = 'dynamic'
    ) {
        super(position, angle, type);
        this.size = size;
        this.preallocate();
    }

    protected preallocateVertices(): void {
        for (let i = 0; i < 4; i++) {
            this.vertices.push(new Vec2D());
        }
    }
    protected preallocateAxes(): void {
        for (let i = 0; i < 4; i++) {
            this.axes.push(new Vec2D());
        }
    }

    #halfSize = new Vec2D();
    protected computeVertices(): void {
        const half = this.#halfSize
        half.assign(this.size)
        half.scale(0.5);

        this.vertices[0].set(-half.x, -half.y);
        this.vertices[1].set(half.x, -half.y);
        this.vertices[2].set(half.x, half.y);
        this.vertices[3].set(-half.x, half.y);

        for (let i = 0; i < 4; i++) {
            const vert = this.vertices[i];
            vert.rotate(this.angle)
            vert.add(this.position);
        }
    }
}
