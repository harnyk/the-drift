import { Renderable } from '../engine/Renderable';
import { Viewport } from '../engine/Viewport';
import { Context } from './Context';
import { Node } from './Node';

export class Grid extends Node implements Renderable {
    readonly baseSpacing: number;
    readonly color: string;

    constructor(
        private readonly context: Context,
        baseSpacing = 1,
        color = '#ddd'
    ) {
        super();
        this.baseSpacing = baseSpacing;
        this.color = color;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const bounds = viewport.getWorldBounds();
        const zoom = viewport.zoom;

        // Адаптивный шаг: кратен baseSpacing * 2^n
        let adjustedSpacing = this.baseSpacing;
        const screenSpacing = zoom * adjustedSpacing;

        if (screenSpacing < 10) {
            while (zoom * adjustedSpacing < 10) {
                adjustedSpacing *= 2;
            }
        } else if (screenSpacing > 40) {
            while (zoom * adjustedSpacing > 40 && adjustedSpacing > this.baseSpacing) {
                adjustedSpacing /= 2;
            }
        }

        viewport.inWorldCoordinates(ctx, () => {
            ctx.beginPath();

            const startX = Math.floor(bounds.minX / adjustedSpacing) * adjustedSpacing;
            const endX = bounds.maxX;
            for (let x = startX; x <= endX; x += adjustedSpacing) {
                ctx.moveTo(x, bounds.minY);
                ctx.lineTo(x, bounds.maxY);
            }

            const startY = Math.floor(bounds.minY / adjustedSpacing) * adjustedSpacing;
            const endY = bounds.maxY;
            for (let y = startY; y <= endY; y += adjustedSpacing) {
                ctx.moveTo(bounds.minX, y);
                ctx.lineTo(bounds.maxX, y);
            }

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0.01;
            ctx.stroke();
        });
    }
}
