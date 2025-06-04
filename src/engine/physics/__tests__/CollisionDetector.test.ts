import { CollisionBody, CollisionDetector } from '../CollisionDetector';
import { Vec2D } from '../../Vec2D';

describe('CollisionDetector', () => {
    it('ignores collisions between static bodies', () => {
        const detector = new CollisionDetector();
        detector.addBody(new CollisionBody(new Vec2D(0, 0), new Vec2D(1, 1), 0, 'static'));
        detector.addBody(new CollisionBody(new Vec2D(0.5, 0), new Vec2D(1, 1), 0, 'static'));
        const result = detector.detect();
        expect(result.length).toBe(0);
    });

    it('detects overlap accounting for rotation', () => {
        const detector = new CollisionDetector();
        const dynamic = new CollisionBody(new Vec2D(0, 0), new Vec2D(2, 1), Math.PI / 4, 'dynamic');
        const block = new CollisionBody(new Vec2D(1, 0), new Vec2D(1, 1), 0, 'static');
        detector.addBody(dynamic);
        detector.addBody(block);
        const collisions = detector.detect();
        expect(collisions).toEqual([{ a: dynamic, b: block }]);
    });

    it('detects dynamic to dynamic collisions only once', () => {
        const detector = new CollisionDetector();
        const d1 = new CollisionBody(new Vec2D(0, 0), new Vec2D(1, 1));
        const d2 = new CollisionBody(new Vec2D(0.5, 0), new Vec2D(1, 1));
        detector.addBody(d1);
        detector.addBody(d2);
        const collisions = detector.detect();
        expect(collisions).toEqual([{ a: d1, b: d2 }]);
    });

    it('can remove bodies', () => {
        const detector = new CollisionDetector();
        const d1 = new CollisionBody(new Vec2D(0, 0), new Vec2D(1, 1));
        const d2 = new CollisionBody(new Vec2D(0.5, 0), new Vec2D(1, 1));
        detector.addBody(d1);
        detector.addBody(d2);
        detector.removeBody(d1);
        const collisions = detector.detect();
        expect(collisions).toEqual([]);
    });
});
