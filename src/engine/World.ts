import { Renderable } from "./Renderable";
import { Viewport } from "./Viewport";


export class World {
    objects: Renderable[] = [];

    add(obj: Renderable) {
        this.objects.push(obj);
    }

    addMany(objs: Renderable[]) {
        this.objects.push(...objs);
    }

    remove(obj: Renderable) {
        const index = this.objects.indexOf(obj);
        if (index >= 0) this.objects.splice(index, 1);
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        for (const obj of this.objects) {
            obj.render(ctx, viewport);
        }
    }
}
