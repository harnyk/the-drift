import { Vec2D } from "../engine/Vec2D";
import { Renderable } from "../engine/Renderable";
import { Viewport } from "../engine/Viewport";


export class Car implements Renderable {
    position: Vec2D;
    angle: number;

    constructor(position: Vec2D, angle = 0) {
        this.position = position;
        this.angle = angle;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = 'blue';
        ctx.fillRect(-0.5, -0.25, 1, 0.5); // размер 1×0.5 юнитов

        this.#renderWheel(ctx, new Vec2D(0.35, 0.3));
        this.#renderWheel(ctx, new Vec2D(-0.35, 0.3));
        this.#renderWheel(ctx, new Vec2D(0.35, -0.3));
        this.#renderWheel(ctx, new Vec2D(-0.35, -0.3));

        ctx.restore();
    }

    #renderWheel(ctx: CanvasRenderingContext2D, center: Vec2D = new Vec2D(0, 0)) {
        ctx.fillStyle = 'black';
        const size = new Vec2D(0.2, 0.1);
        ctx.fillRect(center.x - size.x / 2, center.y - size.y / 2, size.x, size.y);
    }
}
