import { Context } from './Context';
import { Viewport } from './Viewport';
import { World } from './World';

export class WorldRenderer {
    ctx: CanvasRenderingContext2D;
    viewport: Viewport;

    constructor(
        private readonly context: Context,
        ctx: CanvasRenderingContext2D,
        viewport: Viewport
    ) {
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

    render(world: World) {
        this.clear();
        this.applyTransform();
        world.render(this.ctx, this.viewport);
        this.resetTransform();
    }
}
