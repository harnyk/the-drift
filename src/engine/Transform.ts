import { Matrix3 } from "./Matrix3";
import { Vec2DLegacy } from "./vec/Vec2DLegacy";


export class Transform {
    position: Vec2DLegacy;
    rotation: number; // в радианах
    scale: Vec2DLegacy;

    constructor(
        position = new Vec2DLegacy(0, 0),
        rotation = 0,
        scale = new Vec2DLegacy(1, 1)
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

    applyToPoint(p: Vec2DLegacy): Vec2DLegacy {
        return this.matrix.transformPoint(p);
    }
}
