import { Node } from '../Node';
import { RigidBody2D } from './RigidBody2D';
import { GravitySystem } from './GravitySystem';
import { NodeSet } from '../NodeSet';

export class GravitySystemNode extends Node {
  #tmp: RigidBody2D[] = [];

  constructor(
    private readonly gravitySystem: GravitySystem,
    private readonly bodies: NodeSet<RigidBody2D>
  ) {
    super();
  }

  override update(dt: number): void {
    this.bodies.autoClean();

    const set = this.bodies.getSet();
    const tmp = this.#tmp;
    tmp.length = 0;

    for (const body of set) {
      tmp.push(body);
    }

    for (let i = 0; i < tmp.length; i++) {
      for (let j = i + 1; j < tmp.length; j++) {
        this.gravitySystem.applyMutualGravity(tmp[i], tmp[j]);
      }
    }
  }
}
