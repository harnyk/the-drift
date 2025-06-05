import { Vec2DLegacy } from '../../engine/vec/Vec2DLegacy';
import { Renderable } from '../../engine/Renderable';
import { Viewport } from '../../engine/Viewport';

export class RegularPolygonRenderable implements Renderable {
    position: Vec2DLegacy;
    radius: number;
    sides: number;
    angle: number;
    color: string;

    constructor({
        position = Vec2DLegacy.zero(),
        radius = 0.5,
        sides = 3,
        angle = 0,
        color = 'blue',
    }: {
        position?: Vec2DLegacy;
        radius?: number;
        sides?: number;
        angle?: number;
        color?: string;
    } = {}) {
        this.position = position;
        this.radius = radius;
        this.sides = sides;
        this.angle = angle;
        this.color = color;
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const local = Vec2DLegacy.fromPolar(this.radius, (2 * Math.PI * i) / this.sides);
            if (i === 0) ctx.moveTo(local.x, local.y);
            else ctx.lineTo(local.x, local.y);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }
}
