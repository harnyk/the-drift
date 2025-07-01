import { RigidBody2D } from './RigidBody2D';
import { Context } from '../Context';

export class GravitySystem {
    constructor(
        private readonly context: Context,
        public readonly G: number = 10,
        public readonly softening: number = 0.5 // ε > 0
    ) {}

    applyMutualGravity(bodyA: RigidBody2D, bodyB: RigidBody2D) {
        this.context.vectorPool.borrow((acquire) => {
            const dir = acquire();
            dir.assign(bodyB.position);
            dir.sub(bodyA.position);

            const distSq = dir.x * dir.x + dir.y * dir.y + this.softening * this.softening;
            const dist = Math.sqrt(distSq);
            dir.scale(1 / dist); // normalize

            const forceMagnitude =
                (this.G * bodyA.mass * bodyB.mass) / distSq;

            const force = acquire();
            force.assign(dir);
            force.scale(forceMagnitude);

            bodyA.applyForce(force);
            force.scale(-1);
            bodyB.applyForce(force);
        });
    }
}
