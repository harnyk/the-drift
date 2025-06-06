import { Vec2D } from '../vec/Vec2D';
import { Vec2DLegacy } from '../vec/Vec2DLegacy';
import { CollisionBody } from './CollisionBody';
import { BodyType } from './CollisionDetector';

export class RegularPolygonCollisionBody extends CollisionBody {
    private radius: number;
    private sides: number;

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
        this.preallocate();
    }

    protected preallocateVertices(): void {
        for (let i = 0; i < this.sides; i++) {
            this.vertices.push(new Vec2D());
        }
    }

    protected preallocateAxes(): void {
        for (let i = 0; i < this.sides; i++) {
            this.axes.push(new Vec2D());
        }
    }

    protected computeVertices(): void {
        for (let i = 0; i < this.sides; i++) {
            const local = Vec2DLegacy.fromPolar(
                this.radius,
                (2 * Math.PI * i) / this.sides
            );
            this.vertices[i]
                .set(local.x, local.y)
                .rotate(this.angle)
                .add(this.position);
        }
    }
}
