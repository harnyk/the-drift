import { bindVec2 } from '../engine/bindVec2';
import { Context } from '../engine/Context';
import { FixedTimestepIntegrator } from '../engine/FixedTimestepIntegrator';
import { Grid } from '../engine/Grid';
import { Node } from '../engine/Node';
import { RigidBody2D } from '../engine/physics/RigidBody2D';
import { Vec2D } from '../engine/vec/Vec2D';
import { Viewport } from '../engine/Viewport';
import { World } from '../engine/World';
import { WorldRenderer } from '../engine/WorldRenderer';

class PlanetRenderable extends Node {
    constructor(
        public readonly color: string = 'red',
        public readonly mass = 1,
        public readonly radius = 1
    ) {
        super();
    }

    public readonly position = new Vec2D();

    render(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }
}

class Planet extends Node {
    body: RigidBody2D;
    renderable: PlanetRenderable;
    constructor(
        public readonly options: {
            color: string;
            radius: number;
            mass: number;
        }
    ) {
        super();
        this.body = new RigidBody2D(new Vec2D(), 0, options.mass, 0);
        this.renderable = new PlanetRenderable(
            this.options.color,
            options.mass,
            options.radius
        );

        this.add(this.renderable);
        this.add(this.body);

        bindVec2(this.renderable, 'position').from(this.body, 'position');
    }
}

export class ThreeBodiesGame {
    private context = new Context();
    private renderer: WorldRenderer;
    private canvas: HTMLCanvasElement;
    private viewport: Viewport;
    private world = new World(this.context);
    private integrator = new FixedTimestepIntegrator(60);
    private grid = new Grid(this.context, 10);

    private planets: Planet[] = [];

    private setupCanvasSize() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setupCanvasSize();
        this.viewport = this.createViewport();
        this.renderer = this.createRenderer();

        this.world.add(this.grid);

        this.generateRandomPlanets();

        for (const planet of this.planets) {
            this.world.add(planet);
        }
    }

    public generateRandomPlanets() {
        for (let i = 0; i < 70; i++) {
            const mass = 2 ** (Math.random() * 4 + 0.3);
            const colorRed = Math.random() * 255;
            const colorGreen = Math.random() * 255;
            const colorBlue = Math.random() * 255;
            const color = `rgb(${colorRed}, ${colorGreen}, ${colorBlue})`;
            const radius = mass * 0.3;

            this.planets.push(
                new Planet({
                    color,
                    radius,
                    mass,
                })
            );
        }

        this.planets.push(
            new Planet({
                color: 'white',
                radius: 0.5,
                mass: 10000,
            })
        );
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

    private applyGravity(planets: Planet[]) {
        this.context.vectorPool.borrow((acquire) => {
            for (let i = 0; i < planets.length; i++) {
                const pi = planets[i];
                for (let j = i + 1; j < planets.length; j++) {
                    const pj = planets[j];
                    const dir = acquire();

                    dir.assign(pj.body.position);
                    dir.sub(pi.body.position);

                    const dist = Math.max(dir.length, 0.5);
                    dir.normalize();

                    const G = 10;
                    const f = (G * pi.body.mass * pj.body.mass) / (dist * dist);

                    const force = acquire();
                    force.assign(dir);
                    force.scale(f);

                    pi.body.applyForce(force);
                    force.scale(-1);
                    pj.body.applyForce(force);
                }
            }
        });
    }

    private updateViewportToFit(planets: Planet[]) {
        this.context.vectorPool.borrow((acquire) => {
            const gamma = 1.5; // чувствительность к массе
            const weightedCenter = acquire();
            weightedCenter.zero();

            let totalWeight = 0;
            for (const p of planets) {
                const weight = Math.pow(p.body.mass, gamma);
                weightedCenter.x += p.body.position.x * weight;
                weightedCenter.y += p.body.position.y * weight;
                totalWeight += weight;
            }
            weightedCenter.scale(1 / totalWeight);

            // Оценим "значимость" тел для попадания в фокус
            const weighted = planets.map((p) => {
                const dx = p.body.position.x - weightedCenter.x;
                const dy = p.body.position.y - weightedCenter.y;
                const distSq = dx * dx + dy * dy;
                const weight = Math.pow(p.body.mass, gamma) / (1 + distSq);
                return { planet: p, weight };
            });

            weighted.sort((a, b) => b.weight - a.weight);

            const coreCount = Math.floor(planets.length * 0.1);
            const core = weighted.slice(0, coreCount).map((e) => e.planet);

            const bounds = {
                minX: Infinity,
                maxX: -Infinity,
                minY: Infinity,
                maxY: -Infinity,
            };

            for (const p of core) {
                const r = p.options.radius;
                const pos = p.body.position;

                bounds.minX = Math.min(bounds.minX, pos.x - r);
                bounds.maxX = Math.max(bounds.maxX, pos.x + r);
                bounds.minY = Math.min(bounds.minY, pos.y - r);
                bounds.maxY = Math.max(bounds.maxY, pos.y + r);
            }

            const padding = 5;
            const width = bounds.maxX - bounds.minX + padding * 2;
            const height = bounds.maxY - bounds.minY + padding * 2;

            const cx = (bounds.minX + bounds.maxX) / 2;
            const cy = (bounds.minY + bounds.maxY) / 2;

            const canvasWidth = this.viewport.canvasSize.x;
            const canvasHeight = this.viewport.canvasSize.y;

            const zoomX = canvasWidth / width;
            const zoomY = canvasHeight / height;
            const targetZoom = Math.min(zoomX, zoomY);

            const alpha = 0.05;
            this.viewport.center.x += (cx - this.viewport.center.x) * alpha;
            this.viewport.center.y += (cy - this.viewport.center.y) * alpha;
            this.viewport.zoom += (targetZoom - this.viewport.zoom) * alpha;
        });
    }

    public start() {
        for (const planet of this.planets) {
            planet.body.position.set(
                Math.random() * 300 - 150,
                Math.random() * 300 - 150
            );
            planet.body.velocity.set(
                Math.random() * 1 - 0.5,
                Math.random() * 1 - 0.5
            );
        }

        const loop = () => {
            this.integrator.update((dt) => {
                this.applyGravity(this.planets);
                this.updateViewportToFit(this.planets);
                for (const planet of this.planets) {
                    planet.body.update(dt);
                }
                this.world.update(dt);
                this.renderer.render(this.world);
            });

            this.renderer.render(this.world);
            requestAnimationFrame(loop);
        };

        loop();
    }

    public resize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.viewport.canvasSize.set(width, height);
    }

    public pause() {}

    public resume() {}
}
