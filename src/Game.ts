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
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;

        this.viewport = new Viewport(
            this.context,
            Vec2D.set(new Vec2D(), 0, 0),
            50,
            Vec2D.set(new Vec2D(), canvas.width, canvas.height)
        );

        this.renderer = new WorldRenderer(
            this.context,
            canvas.getContext('2d')!,
            this.viewport
        );
        this.controller = new KeyboardControl(KeyCodeWASD);
        this.controller.attach();

        this.initGameObjects();
    }

    private initGameObjects() {
        const grid = new Grid(this.context, 1, '#ddd');
        this.world.add(grid);

        const roadBlocks = this.createRoadBlocks();
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

        this.setupControls();
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
                this.car.update(dt);
                this.terrorist.update(dt);
            });

            this.viewport.rotation = fromDeg(90) - this.car.body.angle;

            this.context.vectorPool.borrow((acquire) => {
                const tmp = acquire();
                tmp.assign(this.car.body.position);
                this.viewport.worldToScreenPoint(tmp);
                tmp.set(tmp.x, tmp.y - this.canvas.height * 0.25);
                this.viewport.screenToWorldPoint(tmp);
                this.viewport.center.assign(tmp);
            });

            this.collisionDetector.detect();
            this.renderer.render(this.world);
            requestAnimationFrame(loop);
        };

        loop();
    }
}
