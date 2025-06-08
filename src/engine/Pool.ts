export class Pool<T> {
    private readonly pool: T[] = [];
    private readonly factory: () => T;
    private readonly reset?: (obj: T) => void;
    private _inUse = 0;
    private _totalAllocated = 0;

    constructor(factory: () => T, reset?: (obj: T) => void) {
        this.factory = factory;
        this.reset = reset;
    }

    #acquire(): T {
        this._inUse++;
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }
        this._totalAllocated++;
        return this.factory();
    }

    #release(obj: T) {
        this._inUse--;
        this.reset?.(obj);
        this.pool.push(obj);
    }

    // TODO: do not allocate stack
    borrow<R>(fn: (acquire: () => T) => R): R {
        const stack: T[] = [];
        try {
            const result = fn(() => {
                const obj = this.#acquire();
                stack.push(obj);
                return obj;
            });
            return result;
        } finally {
            for (const obj of this.pool) this.#release(obj);
        }
    }

    get stats() {
        return {
            totalAllocated: this._totalAllocated,
            inUse: this._inUse,
            available: this.pool.length,
        };
    }
}
