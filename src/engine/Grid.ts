import { Renderable } from '../engine/Renderable';
import { Viewport } from '../engine/Viewport';
import { Context } from './Context';

export class Grid implements Renderable {
    spacing: number;
    color: string;

    constructor(
        private readonly context: Context,
        spacing = 1,
        color = '#ddd'
    ) {
        this.spacing = spacing;
        this.color = color;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const bounds = viewport.getWorldBounds();

        viewport.inWorldCoordinates(ctx, () => {
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
        });
    }
}
