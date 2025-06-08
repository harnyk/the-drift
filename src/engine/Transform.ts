import { Matrix3Legacy } from "./Matrix3";
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

    get matrix(): Matrix3Legacy {
        return Matrix3Legacy.translation(this.position.x, this.position.y)
            .multiply(Matrix3Legacy.rotation(this.rotation))
            .multiply(Matrix3Legacy.scale(this.scale.x, this.scale.y));
    }

    applyToPoint(p: Vec2DLegacy): Vec2DLegacy {
        return this.matrix.transformPoint(p);
    }
}
