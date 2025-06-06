import { Vec2D } from '../vec/Vec2D';
import { Vec2DLegacy } from '../vec/Vec2DLegacy';
import { CollisionBody } from './CollisionBody';
import { BodyType } from './CollisionDetector';

export class BoxCollisionBody extends CollisionBody {
    size: Vec2DLegacy;

    constructor(
        position: Vec2DLegacy,
        size: Vec2DLegacy,
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

    protected computeVertices(): void {
        const half = this.size.scale(0.5);

        this.vertices[0].set(-half.x, -half.y);
        this.vertices[1].set(half.x, -half.y);
        this.vertices[2].set(half.x, half.y);
        this.vertices[3].set(-half.x, half.y);

        for (let i = 0; i < 4; i++) {
            this.vertices[i].rotate(this.angle).add(this.position);
        }
    }
}
