import { Renderable } from '../engine/Renderable';
import { Viewport } from '../engine/Viewport';
import { Vec2D } from './vec/Vec2D';

export class Grid implements Renderable {
    spacing: number;
    color: string;

    constructor(spacing = 1, color = '#ddd') {
        this.spacing = spacing;
        this.color = color;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const size = viewport.canvasSize;
        const bounds = this.#getWorldBounds(viewport);

        ctx.save();
        const m = viewport.worldToScreen.values;
        ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);

        ctx.beginPath();
        for (
            let x = Math.floor(bounds.minX);
            x <= bounds.maxX;
            x += this.spacing
        ) {
            ctx.moveTo(x, bounds.minY);
            ctx.lineTo(x, bounds.maxY);
        }
        for (
            let y = Math.floor(bounds.minY);
            y <= bounds.maxY;
            y += this.spacing
        ) {
            ctx.moveTo(bounds.minX, y);
            ctx.lineTo(bounds.maxX, y);
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.01;
        ctx.stroke();
        ctx.restore();
    }

    #getWorldBounds(viewport: Viewport) {
        const size = viewport.canvasSize;
        const corners = [
            new Vec2D(0, 0),
            new Vec2D(size.x, 0),
            new Vec2D(size.x, size.y),
            new Vec2D(0, size.y),
        ].map((p) => viewport.screenToWorldPoint(p));

        const xs = corners.map((p) => p.x);
        const ys = corners.map((p) => p.y);

        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys),
        };
    }
}
