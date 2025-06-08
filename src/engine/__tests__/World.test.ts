import { World } from '../World';
import { Renderable } from '../Renderable';
import { Viewport } from '../Viewport';
import { Context } from '../Context';

class Dummy implements Renderable {
    render(_ctx: CanvasRenderingContext2D, _vp: Viewport) {}
}

describe('World', () => {
    let fakeContext: Context;

    beforeEach(() => {
        jest.clearAllMocks();
        fakeContext = new Context();
    });

    it('removes objects', () => {
        const world = new World(fakeContext);
        const a = new Dummy();
        const b = new Dummy();
        world.addMany([a, b]);
        world.remove(a);
        expect(world.objects).toEqual([b]);
        world.removeMany([b]);
        expect(world.objects).toEqual([]);
    });
});
