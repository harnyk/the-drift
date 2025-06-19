import { Context } from './Context';
import { BindingManager, Binding } from './BindingManager';
import { Node } from './Node';
import { Renderable } from './Renderable';
import { Viewport } from './Viewport';

export class World extends Node {
    readonly bindingManager = new BindingManager();

    constructor(private readonly context: Context) {
        super();
    }

    getWorld(): World {
        return this;
    }

    addBinding(binding: Binding): void {
        this.bindingManager.add(binding);
    }

    removeBindingsForTarget(target: unknown): void {
        this.bindingManager.removeBindingsForTarget(target);
    }

    update(dt: number): void {
        this.bindingManager.update();
        super.update(dt);
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        for (const child of this.getChildren()) {
            this.renderNode(child, ctx, viewport);
        }
    }

    private renderNode(node: Node, ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        if (typeof (node as unknown as Renderable).render === 'function') {
            (node as unknown as Renderable).render(ctx, viewport);
        }
        for (const child of node.getChildren()) {
            this.renderNode(child, ctx, viewport);
        }
    }
}
