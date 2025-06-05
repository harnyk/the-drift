import { Vec2D } from '../vec/Vec2D';

export class RigidBody2D {
    position: Vec2D;
    velocity: Vec2D;
    acceleration: Vec2D;
    force: Vec2D;
    angle: number;
    angularVelocity: number;
    angularForce: number;

    mass: number;
    momentOfInertia: number; // для вращения (можно пока = 1)

    constructor(
        position = new Vec2D(0, 0),
        angle = 0,
        mass = 1,
        momentOfInertia = 1
    ) {
        this.position = position;
        this.velocity = new Vec2D(0, 0);
        this.acceleration = new Vec2D(0, 0);
        this.force = new Vec2D(0, 0);

        this.angle = angle;
        this.angularVelocity = 0;
        this.angularForce = 0;

        this.mass = mass;
        this.momentOfInertia = momentOfInertia;
    }

    applyForce(force: Vec2D) {
        this.force.x += force.x;
        this.force.y += force.y;
    }

    applyTorque(torque: number) {
        this.angularForce += torque;
    }

    update(dt: number) {
        // линейная физика
        this.acceleration.x = this.force.x / this.mass;
        this.acceleration.y = this.force.y / this.mass;

        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        // угловая физика
        const angularAcceleration = this.angularForce / this.momentOfInertia;
        this.angularVelocity += angularAcceleration * dt;
        this.angle += this.angularVelocity * dt;

        // сбрасываем силы (одноразовые, как импульс)
        this.force.x = 0;
        this.force.y = 0;
        this.angularForce = 0;
    }
}
