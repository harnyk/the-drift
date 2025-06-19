export interface Binding {
    target: unknown;
    update(): void;
}

export class BindingManager {
    private bindings: Binding[] = [];

    add(binding: Binding): void {
        this.bindings.push(binding);
    }

    removeBindingsForTarget(target: unknown): void {
        this.bindings = this.bindings.filter((b) => b.target !== target);
    }

    update(): void {
        for (const b of this.bindings) {
            b.update();
        }
    }
}
