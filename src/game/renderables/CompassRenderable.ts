import { Renderable } from '../../engine/Renderable';
import { Viewport } from '../../engine/Viewport';
import { Vec2D } from '../../engine/vec/Vec2D';
import { Node } from '../../engine/Node';

export class CompassRenderable extends Node implements Renderable {
    size: number;
    #viewportCenter: Vec2D = new Vec2D();

    constructor(size = 50) {
        super();
        this.size = size;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        const padding = 10;
        this.#viewportCenter.x =
            viewport.canvasSize.x - this.size / 2 - padding;
        this.#viewportCenter.y = this.size / 2 + padding;
        const center = this.#viewportCenter;

        viewport.inScreenCoordinates(ctx, () => {
            ctx.translate(center.x, center.y);

            // Main circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = '#222';
            ctx.fill();

            // Rotate arrows by viewport rotation
            ctx.rotate(-viewport.rotation);

            // South arrow (90°, down)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.size / 2 - 5);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 4;
            ctx.stroke();

            // North arrow (270°, up)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -this.size / 2 + 5);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
}
