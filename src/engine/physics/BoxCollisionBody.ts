import { Vec2D } from '../vec/Vec2D';
import { CollisionBody } from './CollisionBody';
import { BodyType } from './CollisionDetector';


export class BoxCollisionBody extends CollisionBody {
    size: Vec2D;

    constructor(
        position: Vec2D,
        size: Vec2D,
        angle = 0,
        type: BodyType = 'dynamic'
    ) {
        super(position, angle, type);
        this.size = size;
    }

    getVertices(): Vec2D[] {
        const half = this.size.scale(0.5);
        const local = [
            new Vec2D(-half.x, -half.y),
            new Vec2D(half.x, -half.y),
            new Vec2D(half.x, half.y),
            new Vec2D(-half.x, half.y),
        ];
        return local.map((p) => p.rotate(this.angle).add(this.position));
    }
}
