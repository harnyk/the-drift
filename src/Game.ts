import { Context } from './engine/Context';
import { FixedTimestepIntegrator } from './engine/FixedTimestepIntegrator';
import { fromDeg } from './engine/fromDeg';
import { Grid } from './engine/Grid';
import { CollisionDetector } from './engine/physics/CollisionDetector';
import { Vec2D } from './engine/vec/Vec2D';
import { Vec2DAverager } from './engine/Vec2DAverager';
import { Viewport } from './engine/Viewport';
import { World } from './engine/World';
import { WorldRenderer } from './engine/WorldRenderer';
import { Block } from './game/Block';
import { Car } from './game/Car';
import { KeyboardControl, KeyCodeWASD } from './game/controls/KeyboardControl';
import { CompassRenderable } from './game/renderables/CompassRenderable';
import { SpeedometerRenderable } from './game/renderables/SpeedometerRenderable';
import { TerroristIndicatorRenderable } from './game/renderables/TerroristIndicatorRenderable';
import { Terrorist } from './game/Terrorist';

export class Game {
    private context = new Context();
    private canvas: HTMLCanvasElement;
    private renderer: WorldRenderer;
    private viewport: Viewport;
    private world = new World(this.context);
    private integrator = new FixedTimestepIntegrator(60);
    private controller: KeyboardControl;
    private terroristGravityCenterAverager = new Vec2DAverager();

    private car!: Car;
    private terrorist!: Terrorist;
    private collisionDetector!: CollisionDetector;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setupCanvasSize();
        this.viewport = this.createViewport();
        this.renderer = this.createRenderer();
        this.controller = this.createController();
        this.initGameObjects();
    }

    private setupCanvasSize() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }

    private createViewport(): Viewport {
        return new Viewport(
            this.context,
            Vec2D.set(new Vec2D(), 0, 0),
            50,
            Vec2D.set(new Vec2D(), this.canvas.width, this.canvas.height)
        );
    }

    private createRenderer(): WorldRenderer {
        return new WorldRenderer(
            this.context,
            this.canvas.getContext('2d')!,
            this.viewport
        );
    }

    private createController(): KeyboardControl {
        const controller = new KeyboardControl(KeyCodeWASD);
        controller.attach();
        return controller;
    }

    private createRoadBlocks(): Block[] {
        const blocks: Block[] = [];
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                blocks.push(
                    new Block(
                        this.context,
                        Vec2D.set(new Vec2D(), x * 5, y * 5 + 5),
                        Vec2D.set(new Vec2D(), 0.5, 0.5),
                        0,
                        true,
                        '#0a0',
                        '#a00'
                    )
                );
            }
        }
        return blocks;
    }

    private initGameObjects() {
        this.world.add(new Grid(this.context, 1, '#ddd'));
        const roadBlocks = this.createRoadBlocks();

        this.initCollisionDetector(roadBlocks);
        this.initCarAndTerrorist();
        this.addRenderables(roadBlocks);
        this.setupControls();
    }

    private initCollisionDetector(roadBlocks: Block[]) {
        this.collisionDetector = new CollisionDetector(this.context);

        for (const block of roadBlocks) {
            this.world.add(block.renderable);
            this.terroristGravityCenterAverager.add(block.collider.position);

            this.collisionDetector.addBody(block.collider, {
                onCollisionStart: (body, other) => {
                    if (other === this.car.collider) {
                        if (block.isGood) {
                            this.world.remove(block.renderable);
                            this.collisionDetector.removeBody(body);
                            this.terroristGravityCenterAverager.remove(
                                body.position
                            );
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

    private applyMutualGravity() {
        this.context.vectorPool.borrow((acquire) => {
            const dir = acquire();
            dir.assign(this.terrorist.body.position);
            dir.sub(this.car.body.position);

            const r = Math.max(dir.length, 2);
            dir.normalize();

            const G = 30;
            const forceMagnitude =
                (G * this.car.body.mass * this.terrorist.body.mass) / (r * r);
            dir.scale(forceMagnitude);

            this.car.body.applyForce(dir);

            dir.scale(-1);
            this.terrorist.body.applyForce(dir);
        });
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
            fromDeg(90),
            this.terroristGravityCenterAverager
        );

        this.collisionDetector.addBody(this.car.collider);
        this.collisionDetector.addBody(this.terrorist.collider);
    }

    private addRenderables(blocks: Block[]) {
        this.world.add(this.car.renderable);
        this.world.add(this.terrorist.renderable);
        this.world.add(new CompassRenderable());
        this.world.add(new SpeedometerRenderable(this.car.body));
        this.world.add(
            new TerroristIndicatorRenderable(
                this.context,
                this.car.body,
                this.terrorist.body
            )
        );
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

    public start() {
        const loop = () => {
            this.integrator.update((dt) => {
                this.applyMutualGravity();
                this.car.update(dt);
                this.terrorist.update(dt);
            });

            this.updateCamera();
            this.collisionDetector.detect();
            this.renderer.render(this.world);

            requestAnimationFrame(loop);
        };

        loop();
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
