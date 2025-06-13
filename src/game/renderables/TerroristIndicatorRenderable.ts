import { Context } from '../../engine/Context';
import { Renderable } from '../../engine/Renderable';
import { Viewport } from '../../engine/Viewport';
import { RigidBody2D } from '../../engine/physics/RigidBody2D';
import { Vec2D } from '../../engine/vec/Vec2D';

export class TerroristIndicatorRenderable implements Renderable {
    constructor(
        private readonly context: Context,
        private readonly carBody: RigidBody2D,
        private readonly terroristBody: RigidBody2D
    ) {}

    private readonly baseLength = 20;
    private readonly baseThickness = 4;
    private readonly maxScale = 10;
    private readonly minDist = 3;
    private readonly maxDist = 30;
    private readonly color = 'rgba(255, 0, 0, 0.7)';

    #indicatorPosition = new Vec2D();
    #indicatorAngle = 0;

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        if (!this.#computeIndicatorPosition(viewport)) return;

        const carPos = this.carBody.position;
        const terroristPos = this.terroristBody.position;
        const dist = Math.hypot(
            terroristPos.x - carPos.x,
            terroristPos.y - carPos.y
        );

        const normalized = Math.min(
            1,
            Math.max(0, (this.maxDist - dist) / (this.maxDist - this.minDist))
        );
        const thicknessScale = 1 + normalized * (this.maxScale - 1);

        viewport.inScreenCoordinates(ctx, () => {
            ctx.translate(this.#indicatorPosition.x, this.#indicatorPosition.y);
            ctx.rotate(this.#indicatorAngle);
            ctx.fillStyle = this.color;
            ctx.fillRect(
                -this.baseLength / 2,
                (-this.baseThickness * thicknessScale) / 2,
                this.baseLength,
                this.baseThickness * thicknessScale
            );
        });
    }

    #computeIndicatorPosition(viewport: Viewport): boolean {
        return this.context.vectorPool.borrow((acquire) => {
            const carScreen = acquire();
            carScreen.assign(this.carBody.position);
            viewport.worldToScreenPoint(carScreen);

            const terroristScreen = acquire();
            terroristScreen.assign(this.terroristBody.position);
            viewport.worldToScreenPoint(terroristScreen);

            if (
                terroristScreen.x >= 0 &&
                terroristScreen.x <= viewport.canvasSize.x &&
                terroristScreen.y >= 0 &&
                terroristScreen.y <= viewport.canvasSize.y
            ) {
                return false;
            }

            const dir = acquire();
            dir.assign(terroristScreen);
            dir.sub(carScreen);

            const dx = dir.x;
            const dy = dir.y;

            const minX = 0;
            const minY = 0;
            const maxX = viewport.canvasSize.x;
            const maxY = viewport.canvasSize.y;

            let tmin = -Infinity;
            let tmax = Infinity;

            if (Math.abs(dx) > 1e-5) {
                const tx1 = (minX - carScreen.x) / dx;
                const tx2 = (maxX - carScreen.x) / dx;
                tmin = Math.max(tmin, Math.min(tx1, tx2));
                tmax = Math.min(tmax, Math.max(tx1, tx2));
            } else if (carScreen.x < minX || carScreen.x > maxX) {
                return false;
            }

            if (Math.abs(dy) > 1e-5) {
                const ty1 = (minY - carScreen.y) / dy;
                const ty2 = (maxY - carScreen.y) / dy;
                tmin = Math.max(tmin, Math.min(ty1, ty2));
                tmax = Math.min(tmax, Math.max(ty1, ty2));
            } else if (carScreen.y < minY || carScreen.y > maxY) {
                return false;
            }

            if (tmax < tmin || tmax < 0) return false;

            const t = tmin > 0 ? tmin : tmax;

            const x = carScreen.x + dx * t;
            const y = carScreen.y + dy * t;

            let angle = 0;
            if (Math.abs(x - minX) < 1) angle = Math.PI;
            else if (Math.abs(x - maxX) < 1) angle = 0;
            else if (Math.abs(y - minY) < 1) angle = -Math.PI / 2;
            else if (Math.abs(y - maxY) < 1) angle = Math.PI / 2;

            this.#indicatorAngle = angle;
            this.#indicatorPosition.set(x, y);
            return true;
        });
    }
}
