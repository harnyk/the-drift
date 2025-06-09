import { Context } from '../engine/Context';
import { RegularPolygonCollisionBody } from '../engine/physics/RegularPolygonCollisionBody';
import { RigidBody2D } from '../engine/physics/RigidBody2D';
import { Vec2D } from '../engine/vec/Vec2D';
import { RegularPolygonRenderable } from './renderables/RegularPolygonRenderable';

export class Terrorist {
    readonly renderable: RegularPolygonRenderable;
    readonly collider: RegularPolygonCollisionBody;
    readonly body: RigidBody2D;

    readonly #sum = new Vec2D();
    gravityConstant = 100;

    constructor(
        private readonly context: Context,
        position: Vec2D,
        angle = 0,
        private readonly gravitySources: Vec2D[]
    ) {
        const radius = 3;
        const sides = 5;

        this.renderable = new RegularPolygonRenderable({
            position,
            radius,
            sides,
            angle: angle,
            color: '#333',
        });

        this.collider = new RegularPolygonCollisionBody(
            this.context,
            position,
            radius,
            sides,
            angle,
            'dynamic'
        );

        this.body = new RigidBody2D(position, angle, 1, 0.1);
        this.body.applyTorque(1);
    }

    update(dt: number) {
        this.#sum.zero();
        for (const target of this.gravitySources) {
            const dx = target.x - this.body.position.x;
            const dy = target.y - this.body.position.y;
            const distSq = dx * dx + dy * dy;
            if (distSq <= 1e-5) continue;
            const invDist = 1 / Math.sqrt(distSq);
            const forceMag = this.gravityConstant / distSq;
            this.#sum.x += dx * invDist * forceMag;
            this.#sum.y += dy * invDist * forceMag;
        }
        this.body.applyForce(this.#sum);

        this.renderable.position.assign(this.body.position);
        this.renderable.angle = this.body.angle;
        this.collider.position.assign(this.body.position);
        this.collider.angle = this.body.angle;
        this.body.update(dt);
    }
}
