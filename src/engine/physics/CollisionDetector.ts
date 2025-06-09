import { Context } from '../Context';
import { ImmutableVec2D, Vec2D } from '../vec/Vec2D';
import { CollisionBody } from './CollisionBody';

interface CollisionEntry {
    body: CollisionBody;
    onStart?: (body: CollisionBody, otherBody: CollisionBody) => void;
    onEnd?: (body: CollisionBody, otherBody: CollisionBody) => void;

    lastFrameContacts: CollisionBody[];
    contactCount: number;

    _newContacts: CollisionBody[];
    _newContactCount: number;
}

export class CollisionDetector {
    private entries: CollisionEntry[] = [];
    private entriesCopy: CollisionEntry[] = [];

    constructor(
        private readonly context: Context,
        private readonly maxContactsPerBody = 16
    ) {}

    addBody(
        body: CollisionBody,
        handlers?: {
            onCollisionStart?: (
                body: CollisionBody,
                otherBody: CollisionBody
            ) => void;
            onCollisionEnd?: (
                body: CollisionBody,
                otherBody: CollisionBody
            ) => void;
        }
    ) {
        this.entries.push({
            body,
            onStart: handlers?.onCollisionStart,
            onEnd: handlers?.onCollisionEnd,
            lastFrameContacts: new Array(this.maxContactsPerBody).fill(null!),
            contactCount: 0,
            _newContacts: new Array(this.maxContactsPerBody).fill(null!),
            _newContactCount: 0,
        });
    }

    removeBody(body: CollisionBody) {
        this.entries = this.entries.filter((e) => e.body !== body);
    }

    #populateEntriesCopy() {
        this.entriesCopy.length = this.entries.length;
        for (let i = 0; i < this.entries.length; i++) {
            this.entriesCopy[i] = this.entries[i];
        }
    }

    detect(): void {
        this.context.vectorPool.borrow((acquire) => {
            const tmpAxis = acquire();
            const tmp = acquire();

            // Prepare
            for (const entry of this.entries) {
                entry._newContactCount = 0;
            }

            // loop over a copy in case a body is removed in callback during loop
            this.#populateEntriesCopy();

            const len = this.entriesCopy.length;
            for (let i = 0; i < len; i++) {
                const aEntry = this.entriesCopy[i];
                const a = aEntry.body;
                for (let j = i + 1; j < len; j++) {
                    const bEntry = this.entriesCopy[j];
                    const b = bEntry.body;

                    if (a.type === 'static' && b.type === 'static') continue;
                    if (!this.#overlap(a, b, tmpAxis, tmp)) continue;

                    this.#recordContact(aEntry, b);
                    this.#recordContact(bEntry, a);

                    if (!this.#wasContact(aEntry, b))
                        aEntry.onStart?.(aEntry.body, b);
                    if (!this.#wasContact(bEntry, a))
                        bEntry.onStart?.(bEntry.body, a);
                }
            }

            // loop over a copy in case a body is removed in callback during loop
            this.#populateEntriesCopy();

            for (const entry of this.entriesCopy) {
                for (let i = 0; i < entry.contactCount; i++) {
                    const other = entry.lastFrameContacts[i];
                    if (!this.#isNowContact(entry, other)) {
                        entry.onEnd?.(entry.body, other);
                    }
                }

                // Swap
                for (let i = 0; i < entry._newContactCount; i++) {
                    entry.lastFrameContacts[i] = entry._newContacts[i];
                }
                entry.contactCount = entry._newContactCount;
            }
        });
    }

    #recordContact(entry: CollisionEntry, other: CollisionBody): void {
        if (entry._newContactCount >= this.maxContactsPerBody) return; // overflow
        entry._newContacts[entry._newContactCount++] = other;
    }

    #wasContact(entry: CollisionEntry, other: CollisionBody): boolean {
        for (let i = 0; i < entry.contactCount; i++) {
            if (entry.lastFrameContacts[i] === other) return true;
        }
        return false;
    }

    #isNowContact(entry: CollisionEntry, other: CollisionBody): boolean {
        for (let i = 0; i < entry._newContactCount; i++) {
            if (entry._newContacts[i] === other) return true;
        }
        return false;
    }

    #overlap(
        a: CollisionBody,
        b: CollisionBody,
        axisBuf: Vec2D,
        tmp: Vec2D
    ): boolean {
        const axesA = a.getAxes();
        const axesB = b.getAxes();
        const vertsA = a.getVertices();
        const vertsB = b.getVertices();

        for (let i = 0; i < axesA.length; i++) {
            if (!this.#testAxis(vertsA, vertsB, axesA[i], axisBuf, tmp))
                return false;
        }
        for (let i = 0; i < axesB.length; i++) {
            if (!this.#testAxis(vertsA, vertsB, axesB[i], axisBuf, tmp))
                return false;
        }
        return true;
    }

    #testAxis(
        vertsA: ReadonlyArray<ImmutableVec2D>,
        vertsB: ReadonlyArray<ImmutableVec2D>,
        axis: ImmutableVec2D,
        axisBuf: Vec2D,
        tmp: Vec2D
    ): boolean {
        axisBuf.assign(axis);
        axisBuf.normalize();

        let minA = Infinity,
            maxA = -Infinity;
        for (let i = 0; i < vertsA.length; i++) {
            tmp.assign(vertsA[i]);
            const dot = tmp.dot(axisBuf);
            if (dot < minA) minA = dot;
            if (dot > maxA) maxA = dot;
        }

        let minB = Infinity,
            maxB = -Infinity;
        for (let i = 0; i < vertsB.length; i++) {
            tmp.assign(vertsB[i]);
            const dot = tmp.dot(axisBuf);
            if (dot < minB) minB = dot;
            if (dot > maxB) maxB = dot;
        }

        return !(maxA < minB || maxB < minA);
    }
}
