import { Context } from '../engine/Context';
import { RegularPolygonCollisionBody } from '../engine/physics/RegularPolygonCollisionBody';
import { RigidBody2D } from '../engine/physics/RigidBody2D';
import { Vec2D } from '../engine/vec/Vec2D';
import { Vec2DAverager } from '../engine/Vec2DAverager';
import { RegularPolygonRenderable } from './renderables/RegularPolygonRenderable';

export class Terrorist {
    readonly renderable: RegularPolygonRenderable;
    readonly collider: RegularPolygonCollisionBody;
    readonly body: RigidBody2D;

    readonly #sum = new Vec2D();
    #timeAccumulator: number = 0;

    constructor(
        private readonly context: Context,
        position: Vec2D,
        angle = 0,
        private readonly averageTarget: Vec2DAverager
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
        this.#timeAccumulator += dt;
        if (this.#timeAccumulator >= 1) {
            if (this.averageTarget.computeAverage(this.#sum)) {
                this.#sum.sub(this.body.position);
                this.#sum.normalize();
                this.#sum.scale(50);
                this.body.applyForce(this.#sum);
            }
            this.#timeAccumulator = 0;
        }

        this.renderable.position.assign(this.body.position);
        this.renderable.angle = this.body.angle;
        this.collider.position.assign(this.body.position);
        this.collider.angle = this.body.angle;
        this.body.update(dt);
    }
}
