import { Vec2D } from '../Vec2D';

export type BodyType = 'static' | 'dynamic';

export class CollisionBody {
    position: Vec2D;
    size: Vec2D;
    angle: number;
    type: BodyType;

    constructor(
        position: Vec2D,
        size: Vec2D,
        angle = 0,
        type: BodyType = 'dynamic'
    ) {
        this.position = position;
        this.size = size;
        this.angle = angle;
        this.type = type;
    }
}

export type CollisionPair = { a: CollisionBody; b: CollisionBody };

export class CollisionDetector {
    private bodies: CollisionBody[] = [];

    addBody(body: CollisionBody) {
        this.bodies.push(body);
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
        const axes = [
            Vec2D.fromPolar(1, a.angle),
            Vec2D.fromPolar(1, a.angle + Math.PI / 2),
            Vec2D.fromPolar(1, b.angle),
            Vec2D.fromPolar(1, b.angle + Math.PI / 2),
        ];

        const vertsA = this.#getVertices(a);
        const vertsB = this.#getVertices(b);

        for (const axis of axes) {
            const [minA, maxA] = this.#project(vertsA, axis);
            const [minB, maxB] = this.#project(vertsB, axis);
            if (maxA < minB || maxB < minA) return false;
        }
        return true;
    }

    #getVertices(b: CollisionBody): Vec2D[] {
        const half = b.size.scale(0.5);
        const local = [
            new Vec2D(-half.x, -half.y),
            new Vec2D(half.x, -half.y),
            new Vec2D(half.x, half.y),
            new Vec2D(-half.x, half.y),
        ];
        return local.map((p) => p.rotate(b.angle).add(b.position));
    }

    #project(points: Vec2D[], axis: Vec2D): [number, number] {
        const norm = axis.normalize();
        const values = points.map((p) => p.dot(norm));
        return [Math.min(...values), Math.max(...values)];
    }
}
