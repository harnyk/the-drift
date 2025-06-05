import { BoxCollisionBody } from '../engine/physics/BoxCollisionBody';
import { CollisionBody } from '../engine/physics/CollisionBody';
import { Vec2D } from '../engine/vec/Vec2D';
import { RoadBlockRenderable } from './renderables/RoadBlockRenderable';

export class Block {
    readonly renderable: RoadBlockRenderable;
    readonly collider: CollisionBody;

    constructor(
        public position: Vec2D,
        public angle: number,
        public size: Vec2D,
        public color: string
    ) {
        this.renderable = new RoadBlockRenderable({
            position: this.position,
            angle: this.angle,
            size: this.size,
            color: this.color,
        });

        this.collider = new BoxCollisionBody(
            this.position,
            this.size,
            this.angle,
            'static'
        );
    }
}
