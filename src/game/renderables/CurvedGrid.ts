import { Renderable } from '../../engine/Renderable';
import { Viewport } from '../../engine/Viewport';
import { Context } from '../../engine/Context';
import { ImmutableVec2D } from '../../engine/vec/Vec2D';
import { Node } from '../../engine/Node';

export class CurvedGrid extends Node implements Renderable {
    spacing: number;
    color: string;

    private gravityWell: ImmutableVec2D | null = null;

    constructor(private readonly context: Context, spacing = 1, color: string) {
        super();
        this.spacing = spacing;
        this.color = color;
    }

    setGravityWell(position: ImmutableVec2D) {
        this.gravityWell = position;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const bounds = viewport.getWorldBounds();

        viewport.inWorldCoordinates(ctx, () => {
            const strength = 1.5;
            const radius = 8;

            const spacing = this.spacing;

            ctx.beginPath();

            // Verticals
            for (
                let x = Math.floor(bounds.minX);
                x <= bounds.maxX;
                x += spacing
            ) {
                let first = true;
                for (
                    let y = Math.floor(bounds.minY);
                    y <= bounds.maxY;
                    y += spacing
                ) {
                    this.#distortAndLineTo(ctx, x, y, first, radius, strength);
                    first = false;
                }
            }

            // Horizontals
            for (
                let y = Math.floor(bounds.minY);
                y <= bounds.maxY;
                y += spacing
            ) {
                let first = true;
                for (
                    let x = Math.floor(bounds.minX);
                    x <= bounds.maxX;
                    x += spacing
                ) {
                    this.#distortAndLineTo(ctx, x, y, first, radius, strength);
                    first = false;
                }
            }

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0.01;
            ctx.stroke();
        });
    }

    #distortAndLineTo(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        moveTo: boolean,
        radius: number,
        strength: number
    ) {
        this.context.vectorPool.borrow((acquire) => {
            const p = acquire();
            p.set(x, y);

            if (this.gravityWell) {
                const d = acquire();
                d.assign(p);
                d.sub(this.gravityWell);
                const dist = d.length;

                if (dist < radius) {
                    const t = (radius - dist) / radius;
                    d.normalize();
                    d.scale(t * strength);
                    p.sub(d);
                }
            }

            if (moveTo) {
                ctx.moveTo(p.x, p.y);
            } else {
                ctx.lineTo(p.x, p.y);
            }
        });
    }
}
