import { Node } from './Node';

export class NodeSet<T extends Node> {
    private readonly _set: Set<T> = new Set();

    add(node: T) {
        this._set.add(node);
    }

    remove(node: T) {
        this._set.delete(node);
    }

    getSet(): ReadonlySet<T> {
        return this._set;
    }

    autoClean() {
        for (const node of this._set) {
            if (node.parent === null) {
                this._set.delete(node);
            }
        }
    }
}
