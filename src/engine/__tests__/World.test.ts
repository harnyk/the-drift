import { World } from '../World';
import { Renderable } from '../Renderable';
import { Viewport } from '../Viewport';
import { Context } from '../Context';
import { Node } from '../Node';

class Dummy extends Node implements Renderable {
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
        world.add(a);
        world.add(b);
        world.remove(a);
        expect(world.getChildren()).toEqual([b]);
        world.remove(b);
        expect(world.getChildren()).toEqual([]);
    });
});
