import { Point } from "./Point";
import { Viewport } from "./Viewport";
import { World } from "./World";


export class WorldRenderer {
    ctx: CanvasRenderingContext2D;
    viewport: Viewport;

    constructor(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        this.ctx = ctx;
        this.viewport = viewport;
    }

    clear() {
        const { x, y } = this.viewport.canvasSize;
        this.ctx.clearRect(0, 0, x, y);
    }

    applyTransform() {
        const m = this.viewport.worldToScreen.values;
        this.ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
    }

    resetTransform() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawGrid(spacing = 1, color = '#ddd') {
        const ctx = this.ctx;
        const bounds = this.getWorldBounds();

        ctx.save();
        this.applyTransform();

        ctx.beginPath();
        for (let x = Math.floor(bounds.minX); x <= bounds.maxX; x += spacing) {
            ctx.moveTo(x, bounds.minY);
            ctx.lineTo(x, bounds.maxY);
        }

        for (let y = Math.floor(bounds.minY); y <= bounds.maxY; y += spacing) {
            ctx.moveTo(bounds.minX, y);
            ctx.lineTo(bounds.maxX, y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 0.01;
        ctx.stroke();
        ctx.restore();
    }

    getWorldBounds() {
        const size = this.viewport.canvasSize;
        const corners = [
            new Point(0, 0),
            new Point(size.x, 0),
            new Point(size.x, size.y),
            new Point(0, size.y),
        ].map((p) => this.viewport.screenToWorldPoint(p));

        const xs = corners.map((p) => p.x);
        const ys = corners.map((p) => p.y);

        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys),
        };
    }

    render(world: World) {
        this.clear();
        this.drawGrid();
        this.applyTransform();
        world.render(this.ctx, this.viewport);
        this.resetTransform();
    }
}
