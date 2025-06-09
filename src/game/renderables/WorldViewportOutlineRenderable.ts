import { Renderable } from '../../engine/Renderable';
import { Viewport } from '../../engine/Viewport';
import { Context } from '../../engine/Context';

export class WorldViewportOutlineRenderable implements Renderable {
    constructor(private readonly context: Context) {}

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        this.context.vectorPool.borrow((acquire) => {
            const p0 = acquire();
            const p1 = acquire();
            const p2 = acquire();
            const p3 = acquire();

            // четыре угла в мировых координатах
            p0.set(0, 0);
            p1.set(viewport.canvasSize.x, 0);
            p2.set(viewport.canvasSize.x, viewport.canvasSize.y);
            p3.set(0, viewport.canvasSize.y);

            viewport.screenToWorldPoint(p0);
            viewport.screenToWorldPoint(p1);
            viewport.screenToWorldPoint(p2);
            viewport.screenToWorldPoint(p3);

            ctx.save();
            const m = viewport.worldToScreen.values;
            ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);

            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.lineWidth = 0.05;

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        });
    }
}
