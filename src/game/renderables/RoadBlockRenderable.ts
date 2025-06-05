import { Vec2D } from '../../engine/vec/Vec2D';
import { Renderable } from '../../engine/Renderable';
import { Viewport } from '../../engine/Viewport';

export class RoadBlockRenderable implements Renderable {
    position: Vec2D;
    angle: number;
    size: Vec2D;
    color: string;
    constructor({
        position = new Vec2D(0, 0),
        angle = 0,
        size = new Vec2D(0.5, 0.5),
        color = 'blue',
    }: {
        position?: Vec2D;
        angle?: number;
        size?: Vec2D;
        color?: string;
    } = {}) {
        this.position = position;
        this.angle = angle;
        this.size = size;
        this.color = color;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.size.x * -0.5,
            this.size.y * -0.5,
            this.size.x,
            this.size.y
        );

        ctx.restore();
    }
}
