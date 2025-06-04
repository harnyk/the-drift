import { World } from '../World';
import { Renderable } from '../Renderable';
import { Viewport } from '../Viewport';

class Dummy implements Renderable {
    render(_ctx: CanvasRenderingContext2D, _vp: Viewport) {}
}

describe('World', () => {
    it('removes objects', () => {
        const world = new World();
        const a = new Dummy();
        const b = new Dummy();
        world.addMany([a, b]);
        world.remove(a);
        expect(world.objects).toEqual([b]);
        world.removeMany([b]);
        expect(world.objects).toEqual([]);
    });
});
