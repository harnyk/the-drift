import { Context } from '../Context';
import { Vec2D } from '../vec/Vec2D';
import { BodyType } from './BodyType';
import { CollisionBody } from './CollisionBody';

export class RegularPolygonCollisionBody extends CollisionBody {
    private radius: number;
    private sides: number;

    constructor(
        private readonly context: Context,
        position: Vec2D,
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
            const vert = this.vertices[i];
            vert.assignPolar(this.radius, (2 * Math.PI * i) / this.sides);
            vert.rotate(this.angle);
            vert.add(this.position);
        }
    }
}
