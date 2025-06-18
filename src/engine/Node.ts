import type { Binding } from './BindingManager';
import type { World } from './World';

export class Node {
    parent: Node | null = null;
    private readonly children: Node[] = [];
    private pendingBindings: Binding[] = [];

    add(child: Node): void {
        if (child.parent) {
            child.parent.remove(child);
        }
        child.parent = this;
        this.children.push(child);
        const world = this.getWorld();
        if (world) child.propagateAddedToWorld(world);
    }

    remove(child: Node): void {
        const idx = this.children.indexOf(child);
        if (idx >= 0) {
            const world = this.getWorld();
            if (world) child.propagateRemovedFromWorld(world);
            this.children.splice(idx, 1);
            child.parent = null;
        }
    }

    update(dt: number): void {
        for (const child of this.children) {
            child.update(dt);
        }
    }

    protected onAddedToWorld(world: World): void {
        for (const b of this.pendingBindings) {
            world.addBinding(b);
        }
        this.pendingBindings.length = 0;
    }

    protected onRemovedFromWorld(world: World): void {
        world.removeBindingsForTarget(this);
    }

    getWorld(): World | null {
        if (this.parent) {
            return this.parent.getWorld();
        }
        return null;
    }

    registerBinding(binding: Binding): void {
        const world = this.getWorld();
        if (world) {
            world.addBinding(binding);
        } else {
            this.pendingBindings.push(binding);
        }
    }

    getChildren(): readonly Node[] {
        return this.children;
    }

    private propagateAddedToWorld(world: World): void {
        this.onAddedToWorld(world);
        for (const child of this.children) {
            child.propagateAddedToWorld(world);
        }
    }

    private propagateRemovedFromWorld(world: World): void {
        for (const child of this.children) {
            child.propagateRemovedFromWorld(world);
        }
        this.onRemovedFromWorld(world);
    }
}
