import { Renderable } from '../../engine/Renderable';
import { IVec2D } from '../../engine/vec/IVec2D';
import { Vec2D } from '../../engine/vec/Vec2D';
import { Node } from '../../engine/Node';

export class CarRenderable extends Node implements Renderable {
    readonly position: Vec2D = new Vec2D();
    angle: number = 0;

    #wheelCoords = [
        Vec2D.set(new Vec2D(), 0.35, 0.3).toImmutable(),
        Vec2D.set(new Vec2D(), -0.35, 0.3).toImmutable(),
        Vec2D.set(new Vec2D(), 0.35, -0.3).toImmutable(),
        Vec2D.set(new Vec2D(), -0.35, -0.3).toImmutable(),
    ];

    #wheelSize = Vec2D.set(new Vec2D(), 0.2, 0.1).toImmutable();

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = 'blue';
        ctx.fillRect(-0.5, -0.25, 1, 0.5);

        this.#wheelCoords.forEach((vec) => {
            this.#renderWheel(ctx, vec);
        });

        ctx.restore();
    }

    #renderWheel(ctx: CanvasRenderingContext2D, center: IVec2D) {
        ctx.fillStyle = '#aaa';
        const size = this.#wheelSize;
        ctx.fillRect(
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x,
            size.y
        );
    }
}
