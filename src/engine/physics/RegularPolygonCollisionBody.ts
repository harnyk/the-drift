import { Vec2DLegacy } from '../vec/Vec2DLegacy';
import { CollisionBody } from './CollisionBody';
import { BodyType } from './CollisionDetector';


export class RegularPolygonCollisionBody extends CollisionBody {
    radius: number;
    sides: number;

    constructor(
        position: Vec2DLegacy,
        radius: number,
        sides: number,
        angle = 0,
        type: BodyType = 'dynamic'
    ) {
        super(position, angle, type);
        this.radius = radius;
        this.sides = sides;
    }

    getVertices(): Vec2DLegacy[] {
        const verts: Vec2DLegacy[] = [];
        for (let i = 0; i < this.sides; i++) {
            const local = Vec2DLegacy.fromPolar(this.radius, (2 * Math.PI * i) / this.sides);
            verts.push(local.rotate(this.angle).add(this.position));
        }
        return verts;
    }
}
