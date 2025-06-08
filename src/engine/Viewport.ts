import { Context } from './Context';
import { Matrix3 } from './Matrix3';
import { ImmutableVec2D, Vec2D } from './vec/Vec2D';

interface Bounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

export class Viewport {
    readonly center = new Vec2D(); // coordinate of center of camera in world
    zoom: number; // scale: how many pixels per world unit
    readonly canvasSize = new Vec2D(); // size of canvas in pixels
    rotation: number; // angle of camera rotation in radians

    #worldToScreen = new Matrix3();
    readonly #screenToWorld = new Matrix3();

    constructor(
        private readonly context: Context,
        center: ImmutableVec2D,
        zoom: number,
        canvasSize: ImmutableVec2D,
        rotation = 0
    ) {
        this.center.assign(center);
        this.zoom = zoom;
        this.canvasSize.assign(canvasSize);
        this.rotation = rotation;
    }

    get worldToScreen(): Matrix3 {
        const { x: cx, y: cy } = this.center;
        const { x: w, y: h } = this.canvasSize;

        this.context.matrixPool.borrow((acquire) => {
            // translate zero point to center of screen
            this.#screenToWorld.setTranslation(w / 2, h / 2);

            // invert rotation, because we rotate world, not camera
            const step = acquire();
            step.setRotation(-this.rotation);
            this.#screenToWorld.multiply(step);

            // scale and invert Y axis (in canvas Y goes down)
            step.setScale(this.zoom, -this.zoom);
            this.#screenToWorld.multiply(step);

            // translate camera to center of screen
            step.setTranslation(-cx, -cy);
            this.#screenToWorld.multiply(step);
        });

        return this.#screenToWorld;
    }

    get screenToWorld(): Matrix3 {
        this.#worldToScreen.assign(this.worldToScreen);
        this.#worldToScreen.invertInPlace();

        return this.#worldToScreen;
    }

    worldToScreenPoint(p: Vec2D): void {
        this.worldToScreen.transformPointInPlace(p);
    }

    screenToWorldPoint(p: Vec2D): void {
        this.screenToWorld.transformPointInPlace(p);
    }

    readonly #worldBounds: Bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    //TODO: make alloc free
    getWorldBounds(): Readonly<Bounds> {
        const size = this.canvasSize;

        this.context.vectorPool.borrow((acquire) => {
            const corner0 = acquire();
            corner0.set(0, 0);
            this.screenToWorldPoint(corner0);

            const corner1 = acquire();
            corner1.set(size.x, 0);
            this.screenToWorldPoint(corner1);

            const corner2 = acquire();
            corner2.set(size.x, size.y);
            this.screenToWorldPoint(corner2);

            const corner3 = acquire();
            corner3.set(0, size.y);
            this.screenToWorldPoint(corner3);

            this.#worldBounds.minX = Math.min(
                corner0.x,
                corner1.x,
                corner2.x,
                corner3.x
            );
            this.#worldBounds.maxX = Math.max(
                corner0.x,
                corner1.x,
                corner2.x,
                corner3.x
            );
            this.#worldBounds.minY = Math.min(
                corner0.y,
                corner1.y,
                corner2.y,
                corner3.y
            );
            this.#worldBounds.maxY = Math.max(
                corner0.y,
                corner1.y,
                corner2.y,
                corner3.y
            );
        });

        return this.#worldBounds;
    }
}
