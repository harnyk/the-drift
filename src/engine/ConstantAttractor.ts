import { Node } from './Node';
import { RigidBody2D } from './physics/RigidBody2D';
import { Vec2D } from './vec/Vec2D';

export interface ConstantVectorAttractorOptions {
    target: RigidBody2D;
    getSourcePosition: () => Vec2D;
    pullRate: number;
}

/**
 * A scene node that applies a constant, normalized pulling force
 * to a target body from a dynamic source position.
 */
export class ConstantAttractor extends Node {
    private readonly target: RigidBody2D;
    private readonly getSourcePosition: () => Vec2D;
    private readonly pullRate: number;

    constructor(private readonly options: ConstantVectorAttractorOptions) {
        super();

        this.target = options.target;
        this.getSourcePosition = options.getSourcePosition;
        this.pullRate = options.pullRate;
    }

    private readonly direction = new Vec2D();

    override update(dt: number) {
        super.update(dt);

        this.direction.assign(this.getSourcePosition());
        this.direction.sub(this.target.position);

        const len = this.direction.length;
        if (len === 0) return;

        this.direction.scale(this.pullRate / len);
        this.direction.scale(dt);

        this.target.applyForce(this.direction);
    }
}
