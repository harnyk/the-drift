import { Matrix3 } from "./Matrix3";
import { Point } from "./Point";


export class Transform {
    position: Point;
    rotation: number; // в радианах
    scale: Point;

    constructor(
        position = new Point(0, 0),
        rotation = 0,
        scale = new Point(1, 1)
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

    applyToPoint(p: Point): Point {
        return this.matrix.transformPoint(p);
    }
}
