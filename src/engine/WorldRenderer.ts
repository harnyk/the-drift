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

    render(world: World) {
        this.clear();

        this.viewport.inWorldCoordinates(this.ctx, () => {
            world.render(this.ctx, this.viewport);
        });
    }
}
