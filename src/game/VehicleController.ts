import { RigidBody2D } from '../engine/physics/RigidBody2D';
import { Point } from '../engine/Point';

export class VehicleController {
    private body: RigidBody2D;
    private throttle = 0;
    private steering = 0;

    maxForce = 10;
    maxSteeringRate = Math.PI; // рад/сек, ограничение на поворот
    friction = 2;
    angularFriction = 3;
    maxSpeed = 10

    constructor(body: RigidBody2D) {
        this.body = body;
    }

    setThrottle(amount: number) {
        this.throttle = amount; // -1..1
    }

    setSteering(amount: number) {
        this.steering = amount; // -1..1
    }

    setFriction(amount: number) {
        this.friction = amount;
    }

    setAngularFriction(amount: number) {
        this.angularFriction = amount;
    }

    update(dt: number) {
        this.#applyThrottleForce();
        this.#alignVelocityWithHeading(dt);
        this.#rotateBodyIfMoving(dt);
        this.#applyFriction(dt);
    }

    #applyThrottleForce() {
        const forward = Point.fromPolar(1, this.body.angle);
        const force = forward.scale(this.throttle * this.maxForce);
        this.body.applyForce(force);
    }

    #alignVelocityWithHeading(dt: number) {
        const velocity = this.body.velocity;
        const speed = velocity.length;
        if (speed <= 0.01 || Math.abs(this.steering) <= 0.01) return;

        const forward = Point.fromPolar(1, this.body.angle);
        const alignment = forward.dot(velocity.normalize());

        const currentDir = velocity.angle;
        const desiredDir =
            alignment >= 0 ? this.body.angle : this.body.angle + Math.PI;

        let delta = desiredDir - currentDir;
        while (delta > Math.PI) delta -= 2 * Math.PI;
        while (delta < -Math.PI) delta += 2 * Math.PI;

        const maxTurn = this.maxSteeringRate * dt;
        const turn = Math.sign(delta) * Math.min(Math.abs(delta), maxTurn);
        const newAngle = currentDir + turn;

        this.body.velocity = Point.fromPolar(speed, newAngle);
    }

    #rotateBodyIfMoving(dt: number) {
        const speed = this.body.velocity.length;
        if (speed <= 0.01) return;

        const rotationSpeed = this.steering * this.maxSteeringRate;
        this.body.angle += rotationSpeed * dt;
    }

    #applyFriction(dt: number) {
        const decay = Math.exp(-this.friction * dt);
        this.body.velocity = this.body.velocity.scale(decay);
        this.body.angularVelocity *= Math.exp(-this.angularFriction * dt);

        // 🚫 Ограничитель скорости
        const speed = this.body.velocity.length;
        if (speed > this.maxSpeed) {
            this.body.velocity = this.body.velocity
                .normalize()
                .scale(this.maxSpeed);
        }
    }
}
