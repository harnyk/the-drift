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
    }

    getVertices(): Vec2DLegacy[] {
        const half = this.size.scale(0.5);
        const local = [
            new Vec2DLegacy(-half.x, -half.y),
            new Vec2DLegacy(half.x, -half.y),
            new Vec2DLegacy(half.x, half.y),
            new Vec2DLegacy(-half.x, half.y),
        ];
        return local.map((p) => p.rotate(this.angle).add(this.position));
    }
}
