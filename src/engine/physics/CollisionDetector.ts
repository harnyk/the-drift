import { Vec2D } from '../Vec2D';

export type BodyType = 'static' | 'dynamic';

export abstract class CollisionBody {
    position: Vec2D;
    angle: number;
    type: BodyType;

    constructor(position: Vec2D, angle = 0, type: BodyType = 'dynamic') {
        this.position = position;
        this.angle = angle;
        this.type = type;
    }

    abstract getVertices(): Vec2D[];

    getAxes(): Vec2D[] {
        const verts = this.getVertices();
        const axes: Vec2D[] = [];
        for (let i = 0; i < verts.length; i++) {
            const p1 = verts[i];
            const p2 = verts[(i + 1) % verts.length];
            const edge = p2.sub(p1);
            axes.push(new Vec2D(-edge.y, edge.x).normalize());
        }
        return axes;
    }
}

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

export class RegularPolygonCollisionBody extends CollisionBody {
    radius: number;
    sides: number;

    constructor(
        position: Vec2D,
        radius: number,
        sides: number,
        angle = 0,
        type: BodyType = 'dynamic'
    ) {
        super(position, angle, type);
        this.radius = radius;
        this.sides = sides;
    }

    getVertices(): Vec2D[] {
        const verts: Vec2D[] = [];
        for (let i = 0; i < this.sides; i++) {
            const local = Vec2D.fromPolar(this.radius, (2 * Math.PI * i) / this.sides);
            verts.push(local.rotate(this.angle).add(this.position));
        }
        return verts;
    }
}

export type CollisionPair = { a: CollisionBody; b: CollisionBody };

export class CollisionDetector {
    private bodies: CollisionBody[] = [];

    addBody(body: CollisionBody) {
        this.bodies.push(body);
    }

    removeBody(body: CollisionBody) {
        const index = this.bodies.indexOf(body);
        if (index >= 0) this.bodies.splice(index, 1);
    }

    detect(): CollisionPair[] {
        const pairs: CollisionPair[] = [];
        for (let i = 0; i < this.bodies.length; i++) {
            const a = this.bodies[i];
            for (let j = i + 1; j < this.bodies.length; j++) {
                const b = this.bodies[j];
                if (a.type === 'static' && b.type === 'static') continue;
                if (this.#overlap(a, b)) {
                    pairs.push({ a, b });
                }
            }
        }
        return pairs;
    }

    #overlap(a: CollisionBody, b: CollisionBody): boolean {
        const axes = [...a.getAxes(), ...b.getAxes()];

        const vertsA = a.getVertices();
        const vertsB = b.getVertices();

        for (const axis of axes) {
            const [minA, maxA] = this.#project(vertsA, axis);
            const [minB, maxB] = this.#project(vertsB, axis);
            if (maxA < minB || maxB < minA) return false;
        }
        return true;
    }


    #project(points: Vec2D[], axis: Vec2D): [number, number] {
        const norm = axis.normalize();
        const values = points.map((p) => p.dot(norm));
        return [Math.min(...values), Math.max(...values)];
    }
}
