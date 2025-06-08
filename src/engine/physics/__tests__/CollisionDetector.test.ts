import { RegularPolygonCollisionBody } from '../RegularPolygonCollisionBody';
import { BoxCollisionBody } from '../BoxCollisionBody';
import { Vec2D } from '../../vec/Vec2D';
import { Context } from '../../Context';
import { CollisionDetector } from '../CollisionDetector';
import type { CollisionBody } from '../CollisionBody';

describe('CollisionDetector', () => {
    let fakeContext: Context;
    let calls: [CollisionBody, CollisionBody][];

    beforeEach(() => {
        fakeContext = new Context();
        calls = [];
    });

    function wrap(
        body: CollisionBody
    ): [
        CollisionBody,
        {
            onCollisionStart: (
                body: CollisionBody,
                other: CollisionBody
            ) => void;
        }
    ] {
        return [
            body,
            {
                onCollisionStart: (body, other) => {
                    calls.push([body, other]);
                },
            },
        ];
    }

    function callPairsContains(a: CollisionBody, b: CollisionBody) {
        return calls.some(
            ([x, y]) => (x === a && y === b) || (x === b && y === a)
        );
    }

    it('ignores collisions between static bodies', () => {
        const detector = new CollisionDetector(fakeContext);

        const box1 = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0, 0),
            Vec2D.set(new Vec2D(), 1, 1),
            0,
            'static'
        );
        const box2 = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0.5, 0),
            Vec2D.set(new Vec2D(), 1, 1),
            0,
            'static'
        );

        detector.addBody(box1);
        detector.addBody(box2);
        detector.detect();

        expect(calls).toEqual([]);
    });

    it('detects overlap accounting for rotation', () => {
        const detector = new CollisionDetector(fakeContext);

        const dynamic = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0, 0),
            Vec2D.set(new Vec2D(), 2, 1),
            Math.PI / 4,
            'dynamic'
        );
        const block = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0.25, 0.75),
            Vec2D.set(new Vec2D(), 1, 1),
            0,
            'static'
        );

        detector.addBody(...wrap(dynamic));
        detector.addBody(...wrap(block));
        detector.detect();

        expect(callPairsContains(dynamic, block)).toBe(true);
    });

    it('detects dynamic to dynamic collisions only once', () => {
        const detector = new CollisionDetector(fakeContext);

        const d1 = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0, 0),
            Vec2D.set(new Vec2D(), 1, 1)
        );
        const d2 = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0.5, 0),
            Vec2D.set(new Vec2D(), 1, 1)
        );

        detector.addBody(...wrap(d1));
        detector.addBody(...wrap(d2));
        detector.detect();

        expect(calls.length).toBe(2); // d1->d2 and d2->d1
        expect(callPairsContains(d1, d2)).toBe(true);
    });

    it('can remove bodies', () => {
        const detector = new CollisionDetector(fakeContext);

        const d1 = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0, 0),
            Vec2D.set(new Vec2D(), 1, 1)
        );
        const d2 = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0.5, 0),
            Vec2D.set(new Vec2D(), 1, 1)
        );

        detector.addBody(...wrap(d1));
        detector.addBody(...wrap(d2));
        detector.removeBody(d1);
        detector.detect();

        expect(calls).toEqual([]);
    });

    it('detects collisions for regular polygons', () => {
        const detector = new CollisionDetector(fakeContext);

        const poly = new RegularPolygonCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0, 0),
            1,
            10
        );
        const box = new BoxCollisionBody(
            fakeContext,
            Vec2D.set(new Vec2D(), 0.5, 0),
            Vec2D.set(new Vec2D(), 1, 1)
        );

        detector.addBody(...wrap(poly));
        detector.addBody(...wrap(box));
        detector.detect();

        expect(callPairsContains(poly, box)).toBe(true);
    });
});
