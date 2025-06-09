import { Context } from '../engine/Context';
import { RegularPolygonCollisionBody } from '../engine/physics/RegularPolygonCollisionBody';
import { RigidBody2D } from '../engine/physics/RigidBody2D';
import { Vec2D } from '../engine/vec/Vec2D';
import { Vec2DAverager } from '../engine/Vec2DAverager';
import { RegularPolygonRenderable } from './renderables/RegularPolygonRenderable';

export class Terrorist {
    private static readonly RADIUS = 3;
    private static readonly SIDES = 5;
    private static readonly MASS = 5;
    private static readonly MOMENT_OF_INERTIA = 0.1;
    private static readonly INITIAL_TORQUE = 1;
    private static readonly UPDATE_INTERVAL = 0.5;
    private static readonly FORCE_MAGNITUDE = 100;

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
        this.renderable = new RegularPolygonRenderable({
            position,
            radius: Terrorist.RADIUS,
            sides: Terrorist.SIDES,
            angle: angle,
            color: '#333',
        });

        this.collider = new RegularPolygonCollisionBody(
            this.context,
            position,
            Terrorist.RADIUS,
            Terrorist.SIDES,
            angle,
            'dynamic'
        );

        this.body = new RigidBody2D(
            position,
            angle,
            Terrorist.MASS,
            Terrorist.MOMENT_OF_INERTIA
        );
        this.body.applyTorque(Terrorist.INITIAL_TORQUE);
    }

    update(dt: number) {
        this.#timeAccumulator += dt;
        if (this.#timeAccumulator >= Terrorist.UPDATE_INTERVAL) {
            if (this.averageTarget.computeAverage(this.#sum)) {
                this.#sum.sub(this.body.position);
                this.#sum.normalize();
                this.#sum.scale(Terrorist.FORCE_MAGNITUDE);
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
