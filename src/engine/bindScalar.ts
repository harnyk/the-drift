import { Node } from './Node';
import type { Binding } from './BindingManager';

class ScalarBinding<T extends Node, K extends keyof T, S, U extends keyof S> implements Binding {
    target: T;
    constructor(
        target: T,
        private readonly targetKey: K,
        private readonly source: S,
        private readonly sourceKey: U,
        private transform: (v: number) => number = (v) => v
    ) {
        this.target = target;
    }

    withTransform(fn: (v: number) => number): this {
        this.transform = fn;
        return this;
    }

    update(): void {
        const value = (this.source as any)[this.sourceKey] as number;
        (this.target as any)[this.targetKey] = this.transform(value);
    }
}

export function bindScalar<T extends Node, K extends keyof T>(target: T, key: K) {
    return {
        from<S, U extends keyof S>(source: S, sourceKey: U) {
            const binding = new ScalarBinding(target, key, source, sourceKey);
            target.registerBinding(binding);
            return binding;
        },
    };
}
