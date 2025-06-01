import { Renderable } from '../engine/Renderable';
import { Viewport } from '../engine/Viewport';
import { RigidBody2D } from '../engine/physics/RigidBody2D';

export class Speedometer implements Renderable {
    private body: RigidBody2D;

    constructor(body: RigidBody2D) {
        this.body = body;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const speed = this.body.velocity.length;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // экранные координаты
        ctx.font = '20px monospace';
        ctx.fillStyle = '#0f0';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';

        const text = `Speed: ${speed.toFixed(1)} u/s`;
        ctx.fillText(text, 10, viewport.canvasSize.y - 10);
        ctx.restore();
    }
}
