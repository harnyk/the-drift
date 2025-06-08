import { Context } from '../engine/Context';
import { BoxCollisionBody } from '../engine/physics/BoxCollisionBody';
import { CollisionBody } from '../engine/physics/CollisionBody';
import { Vec2D } from '../engine/vec/Vec2D';
import { RoadBlockRenderable } from './renderables/RoadBlockRenderable';

export class Block {
    readonly renderable: RoadBlockRenderable;
    readonly collider: CollisionBody;

    constructor(
        private readonly context: Context,
        public readonly position = new Vec2D(),
        public readonly size = new Vec2D(),
        public angle: number,
        public color: string
    ) {
        this.renderable = new RoadBlockRenderable(this.context, {
            position: this.position,
            angle: this.angle,
            size: this.size,
            color: this.color,
        });

        this.collider = new BoxCollisionBody(
            this.context,
            this.position,
            this.size,
            this.angle,
            'static'
        );
    }
}
