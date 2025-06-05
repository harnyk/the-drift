import { Vec2DLegacy } from '../vec/Vec2DLegacy';
import { CollisionBody } from './CollisionBody';

export type BodyType = 'static' | 'dynamic';

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

    #project(points: Vec2DLegacy[], axis: Vec2DLegacy): [number, number] {
        const norm = axis.normalize();
        const values = points.map((p) => p.dot(norm));
        return [Math.min(...values), Math.max(...values)];
    }
}
