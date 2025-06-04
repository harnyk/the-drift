import { Matrix3 } from "./Matrix3";
import { Vec2D } from "./Vec2D";


export class Transform {
    position: Vec2D;
    rotation: number; // в радианах
    scale: Vec2D;

    constructor(
        position = new Vec2D(0, 0),
        rotation = 0,
        scale = new Vec2D(1, 1)
    ) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    get matrix(): Matrix3 {
        return Matrix3.translation(this.position.x, this.position.y)
            .multiply(Matrix3.rotation(this.rotation))
            .multiply(Matrix3.scale(this.scale.x, this.scale.y));
    }

    applyToPoint(p: Vec2D): Vec2D {
        return this.matrix.transformPoint(p);
    }
}
