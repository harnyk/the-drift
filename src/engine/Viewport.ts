import { Matrix3 } from "./Matrix3";
import { Vec2DLegacy } from "./vec/Vec2DLegacy";


export class Viewport {
    center: Vec2DLegacy; // координаты центра камеры в мире (обычно позиция машинки)
    zoom: number; // масштаб: сколько пикселей на одну единицу мира
    canvasSize: Vec2DLegacy; // размер канваса в пикселях
    rotation: number; // угол поворота камеры в радианах

    constructor(center: Vec2DLegacy, zoom: number, canvasSize: Vec2DLegacy, rotation = 0) {
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

    worldToScreenPoint(p: Vec2DLegacy): Vec2DLegacy {
        return this.worldToScreen.transformPoint(p);
    }

    screenToWorldPoint(p: Vec2DLegacy): Vec2DLegacy {
        return this.screenToWorld.transformPoint(p);
    }
}
