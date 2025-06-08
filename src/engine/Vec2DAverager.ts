import { Vec2D } from './vec/Vec2D';

export class Vec2DAverager {
    #vectors: Vec2D[] = [];

    add(vec: Vec2D) {
        this.#vectors.push(vec);
    }

    remove(vec: Vec2D) {
        const i = this.#vectors.indexOf(vec);
        if (i !== -1) this.#vectors.splice(i, 1);
    }

    clear() {
        this.#vectors.length = 0;
    }

    get count(): number {
        return this.#vectors.length;
    }

    computeAverage(out: Vec2D): boolean {
        if (this.#vectors.length === 0) return false;
        out.zero();
        for (const vec of this.#vectors) {
            out.add(vec);
        }
        out.scale(1 / this.#vectors.length);
        return true;
    }
}
