import { BaseGame } from '../common/BaseGame';
import { fromDeg } from '../engine/fromDeg';
import { CollisionDetector } from '../engine/physics/CollisionDetector';
import { Vec2D } from '../engine/vec/Vec2D';
import { bindVec2 } from '../engine/bindVec2';
import { Car } from './Car';
import { KeyboardControl, KeyCodeWASD } from './controls/KeyboardControl';
import { GameStateManager } from './GameStateManager';
import { CompassRenderable } from './renderables/CompassRenderable';
import { CurvedGrid } from './renderables/CurvedGrid';
import { GameStateOverlayRenderable } from './renderables/GameStateOverlayRenderable';
import { SpeedometerRenderable } from './renderables/SpeedometerRenderable';
import { TerroristEyesRenderable } from './renderables/TerroristEyesRenderable';
import { TerroristIndicatorRenderable } from './renderables/TerroristIndicatorRenderable';
import { Terrorist } from './Terrorist';
import { GravitySystem } from '../engine/physics/GravitySystem';
import { BlocksGroup } from './BlocksGroupNode';
import { ConstantAttractor } from '../engine/ConstantAttractor';
import { GravitySystemNode } from '../engine/physics/GravitySystemNode';
import { NodeSet } from '../engine/NodeSet';
import { RigidBody2D } from '../engine/physics/RigidBody2D';

export class Game extends BaseGame {
    private controller: KeyboardControl;
    private static readonly GRAVITATIONAL_CONSTANT = 30;
    private static readonly TERRORIST_ATTRACTOR_PULL_RATE = 100;

    private gameState = new GameStateManager();
    private car!: Car;
    private terrorist!: Terrorist;
    private terroristEyes!: TerroristEyesRenderable;
    private collisionDetector!: CollisionDetector;
    private gravitySystem = new GravitySystem(
        this.context,
        Game.GRAVITATIONAL_CONSTANT
    );
    private blocksGroup: BlocksGroup = new BlocksGroup(this.context);
    private attractor!: ConstantAttractor;
    private gsnTerroristAndCar!: GravitySystemNode;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.controller = this.createController();
        this.initGameObjects();
    }

    private createController(): KeyboardControl {
        const controller = new KeyboardControl(KeyCodeWASD);
        controller.attach();
        return controller;
    }

    private initGameObjects() {
        this.initCollisionDetector();
        this.initCarAndTerrorist();
        this.initTerroristEyes();
        this.addRenderables();

        this.initPhysics();

        this.setupControls();
    }

    private initPhysics() {
        this.attractor = new ConstantAttractor({
            target: this.terrorist.body,
            getSourcePosition: () => this.blocksGroup.centerOfMassBody.position,
            pullRate: Game.TERRORIST_ATTRACTOR_PULL_RATE,
        });
        this.world.add(this.attractor);

        const nsTerroristAndCar = new NodeSet<RigidBody2D>();
        nsTerroristAndCar.add(this.terrorist.body);
        nsTerroristAndCar.add(this.car.body);

        this.gsnTerroristAndCar = new GravitySystemNode(
            this.gravitySystem,
            nsTerroristAndCar
        );
        this.world.add(this.gsnTerroristAndCar);
    }

    private initTerroristEyes() {
        this.terroristEyes = new TerroristEyesRenderable(
            this.context,
            this.terrorist.body
        );
        bindVec2(this.terroristEyes, 'targetPosition').from(
            this.car.body,
            'position'
        );
    }

    private initCollisionDetector() {
        this.collisionDetector = new CollisionDetector(this.context);

        for (const block of this.blocksGroup.blocks) {
            this.collisionDetector.addBody(block.collider, {
                onCollisionStart: (body, other) => {
                    if (other === this.car.collider) {
                        if (block.isGood) {
                            this.blocksGroup.removeBlock(block);
                            this.collisionDetector.removeBody(body);
                        } else {
                            this.car.body.angularVelocity = 10;
                            this.car.body.velocity.normalize();
                            this.car.body.velocity.scale(-10);
                        }
                    } else if (other === this.terrorist.collider) {
                        block.invert();
                    }
                },
            });
        }
    }

    private initCarAndTerrorist() {
        this.car = new Car(
            this.context,
            Vec2D.set(new Vec2D(), 0, 0),
            fromDeg(90)
        );

        this.terrorist = new Terrorist(
            this.context,
            Vec2D.set(new Vec2D(), 10, 10),
            fromDeg(90)
        );

        this.collisionDetector.addBody(this.car.collider, {
            onCollisionStart: (body, other) => {
                if (
                    other === this.terrorist.collider &&
                    this.gameState.isPlaying()
                ) {
                    this.gameState.lose();
                }
            },
        });
        this.collisionDetector.addBody(this.terrorist.collider);
    }

    private addRenderables() {
        const grid = new CurvedGrid(this.context, 1, '#222');
        grid.setGravityWell(this.terrorist.body.position);
        this.world.add(grid);

        this.world.add(this.blocksGroup);

        this.world.add(this.car);
        this.world.add(this.terrorist);
        this.world.add(this.terroristEyes);
        this.world.add(new CompassRenderable());
        this.world.add(new SpeedometerRenderable(this.car.body));
        this.world.add(
            new TerroristIndicatorRenderable(
                this.context,
                this.car.body,
                this.terrorist.body
            )
        );
        this.world.add(new GameStateOverlayRenderable(this.gameState));
    }

    private setupControls() {
        const throttleDelta = 0.5;
        const steeringDelta = 0.5;

        this.controller.subscribe(({ type, value }) => {
            switch (type) {
                case 'vertical':
                    this.car.controller.setThrottle(value * throttleDelta);
                    break;
                case 'horizontal':
                    this.car.controller.setSteering(-value * steeringDelta);
                    break;
            }
        });
    }

    protected override update(dt: number) {
        if (!this.gameState.isPlaying()) {
            return;
        }
        super.update(dt);
        this.checkVictoryOrDefeat();
    }

    protected override frame() {
        this.updateCamera();
        this.collisionDetector.detect();
        super.frame();
    }

    private checkVictoryOrDefeat() {
        if (this.blocksGroup.blocks.length === 0) {
            this.gameState.win();
            return;
        }
    }

    private updateCamera() {
        this.viewport.rotation = fromDeg(90) - this.car.body.angle;

        this.context.vectorPool.borrow((acquire) => {
            const tmp = acquire();
            tmp.assign(this.car.body.position);
            this.viewport.worldToScreenPoint(tmp);
            tmp.set(tmp.x, tmp.y - this.canvas.height * 0.25);
            this.viewport.screenToWorldPoint(tmp);
            this.viewport.center.assign(tmp);
        });
    }
}
