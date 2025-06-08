import { Context } from './Context';
import { Matrix3 } from './Matrix3';
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

    get worldToScreen(): Matrix3 {
        const { x: cx, y: cy } = this.center;
        const { x: w, y: h } = this.canvasSize;

        return Matrix3.translation(w / 2, h / 2) // перенос начала координат в центр экрана
            .multiply(Matrix3.rotation(-this.rotation)) // инвертируем поворот, потому что мы вращаем мир, а не камеру
            .multiply(Matrix3.scale(this.zoom, -this.zoom)) // масштаб и инвертирование оси Y (в канвасе Y вниз)
            .multiply(Matrix3.translation(-cx, -cy)); // сдвигаем так, чтобы камера смотрела в центр
    }

    get screenToWorld(): Matrix3 {
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
            const corners = [
                Vec2D.set(acquire(), 0, 0),
                Vec2D.set(acquire(), size.x, 0),
                Vec2D.set(acquire(), size.x, size.y),
                Vec2D.set(acquire(), 0, size.y),
            ].map((p) => this.screenToWorldPoint(p));

            const xs = corners.map((p) => p.x);
            const ys = corners.map((p) => p.y);

            this.#worldBounds.minX = Math.min(...xs);
            this.#worldBounds.maxX = Math.max(...xs);
            this.#worldBounds.minY = Math.min(...ys);
            this.#worldBounds.maxY = Math.max(...ys);
        });

        return this.#worldBounds;
    }
}
