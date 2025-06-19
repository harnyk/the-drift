import { Node } from './Node';
import type { Binding } from './BindingManager';
import type { IVec2D } from './vec/IVec2D';
import type { Vec2D } from './vec/Vec2D';

class Vec2Binding<T extends Node, K extends keyof T, S, U extends keyof S> implements Binding {
    target: T;
    private transform: (src: IVec2D, out: Vec2D) => void = (src, out) => out.assign(src);

    constructor(
        target: T,
        private readonly targetKey: K,
        private readonly source: S,
        private readonly sourceKey: U
    ) {
        this.target = target;
    }

    withTransform(fn: (src: IVec2D, out: Vec2D) => void): this {
        this.transform = fn;
        return this;
    }

    update(): void {
        const out = (this.target as any)[this.targetKey] as Vec2D;
        const src = (this.source as any)[this.sourceKey] as IVec2D;
        this.transform(src, out);
    }
}

export function bindVec2<T extends Node, K extends keyof T>(target: T, key: K) {
    return {
        from<S, U extends keyof S>(source: S, sourceKey: U) {
            const binding = new Vec2Binding(target, key, source, sourceKey);
            target.registerBinding(binding);
            return binding;
        },
    };
}
