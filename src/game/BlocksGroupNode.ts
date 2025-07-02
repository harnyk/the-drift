import { Context } from '../engine/Context';
import { Node } from '../engine/Node';
import { RigidBody2D } from '../engine/physics/RigidBody2D';
import { Vec2D } from '../engine/vec/Vec2D';
import { Block } from './Block';

export class BlocksGroup extends Node {
    private static readonly CENTER_MASS = 1;
    readonly centerOfMassBody = new RigidBody2D(
        new Vec2D(),
        0,
        BlocksGroup.CENTER_MASS
    );
    readonly blocks: Block[];

    constructor(private readonly context: Context) {
        super();
        this.add(this.centerOfMassBody);

        this.blocks = this.createBlocks();
        for (const block of this.blocks) {
            this.add(block);
        }
    }

    update(dt: number) {
        super.update(dt);

        this.centerOfMassBody.position.zero();
        let count = 0;

        for (const block of this.blocks) {
            this.centerOfMassBody.position.add(block.position);
            count += 1;
        }

        if (count > 0) {
            this.centerOfMassBody.position.scale(1 / count);
        } else {
            this.centerOfMassBody.mass = 0;
        }
    }

    removeBlock(block: Block) {
        this.remove(block);
        this.blocks.splice(this.blocks.indexOf(block), 1);
    }

    private createBlocks(): Block[] {
        const distanceBetweenBlocks = 6;
        const vertNumberOfBlocks = 5;
        const horNumberOfBlocks = 5;

        const blocks: Block[] = [];
        for (let x = 0; x < horNumberOfBlocks; x++) {
            for (let y = 0; y < vertNumberOfBlocks; y++) {
                blocks.push(
                    new Block(
                        this.context,
                        Vec2D.set(
                            new Vec2D(),
                            x * distanceBetweenBlocks,
                            y * distanceBetweenBlocks + 5
                        ),
                        Vec2D.set(new Vec2D(), 0.5, 0.5),
                        0,
                        false,
                        '#0a0',
                        '#a00'
                    )
                );
            }
        }
        return blocks;
    }
}
