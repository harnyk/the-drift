import { Context } from './Context';
import { Matrix3Legacy } from './Matrix3Legacy';
import { ImmutableVec2D, Vec2D } from './vec/Vec2D';
import { Vec2DLegacy } from './vec/Vec2DLegacy';

interface Bounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

export class Viewport {
    center: Vec2DLegacy; // координаты центра камеры в мире (обычно позиция машинки)
    zoom: number; // масштаб: сколько пикселей на одну единицу мира
    canvasSize: Vec2DLegacy; // размер канваса в пикселях
    rotation: number; // угол поворота камеры в радианах

    constructor(
        private readonly context: Context,
        center: Vec2DLegacy,
        zoom: number,
        canvasSize: Vec2DLegacy,
        rotation = 0
    ) {
        this.center = center;
        this.zoom = zoom;
        this.canvasSize = canvasSize;
        this.rotation = rotation;
    }

    get worldToScreen(): Matrix3Legacy {
        const { x: cx, y: cy } = this.center;
        const { x: w, y: h } = this.canvasSize;

        return Matrix3Legacy.translation(w / 2, h / 2) // перенос начала координат в центр экрана
            .multiply(Matrix3Legacy.rotation(-this.rotation)) // инвертируем поворот, потому что мы вращаем мир, а не камеру
            .multiply(Matrix3Legacy.scale(this.zoom, -this.zoom)) // масштаб и инвертирование оси Y (в канвасе Y вниз)
            .multiply(Matrix3Legacy.translation(-cx, -cy)); // сдвигаем так, чтобы камера смотрела в центр
    }

    get screenToWorld(): Matrix3Legacy {
        return this.worldToScreen.invert();
    }

    worldToScreenPoint(p: ImmutableVec2D | Vec2DLegacy): Vec2DLegacy {
        return this.worldToScreen.transformPoint(
            'isLegacy' in p ? p : p.toLegacy()
        );
    }

    screenToWorldPoint(p: ImmutableVec2D | Vec2DLegacy): Vec2DLegacy {
        return this.screenToWorld.transformPoint(
            'isLegacy' in p ? p : p.toLegacy()
        );
    }

    readonly #worldBounds: Bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    //TODO: make alloc free
    getWorldBounds(): Readonly<Bounds> {
        const size = this.canvasSize;

        this.context.vectorPool.borrow((acquire) => {
            const corner0 = this.screenToWorldPoint(Vec2D.set(acquire(), 0, 0));
            const corner1 = this.screenToWorldPoint(
                Vec2D.set(acquire(), size.x, 0)
            );
            const corner2 = this.screenToWorldPoint(
                Vec2D.set(acquire(), size.x, size.y)
            );
            const corner3 = this.screenToWorldPoint(
                Vec2D.set(acquire(), 0, size.y)
            );

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
