import { Point } from '../engine/Point';
import { Renderable } from '../engine/Renderable';
import { Viewport } from '../engine/Viewport';

export class RoadBlock implements Renderable {
    position: Point;
    angle: number;

    static size: Point = new Point(2, 0.5);

    constructor(position: Point, angle = 0) {
        this.position = position;
        this.angle = angle;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = 'blue';
        ctx.fillRect(
            RoadBlock.size.x * -0.5,
            RoadBlock.size.y * -0.5,
            RoadBlock.size.x,
            RoadBlock.size.y
        );

        ctx.restore();
    }
}
