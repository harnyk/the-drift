import { Renderable } from '../../engine/Renderable';
import { Viewport } from '../../engine/Viewport';
import { RigidBody2D } from '../../engine/physics/RigidBody2D';

export class SpeedometerRenderable implements Renderable {
    private body: RigidBody2D;

    constructor(body: RigidBody2D) {
        this.body = body;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const speed = this.body.velocity.length;

        viewport.inScreenCoordinates(ctx, () => {
            ctx.font = '20px monospace';
            ctx.fillStyle = '#8b008b';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';

            const text = `Speed: ${speed.toFixed(1)} u/s`;
            ctx.fillText(text, 10, viewport.canvasSize.y - 10);
        });
    }
}
