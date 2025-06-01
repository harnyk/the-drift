import { Compass } from './game/Compass';
import { Car } from './game/Car';
import { WorldRenderer } from './engine/WorldRenderer';
import { World } from './engine/World';
import { Viewport } from './engine/Viewport';
import { Point } from './engine/Point';
import { fromDeg } from './engine/fromDeg';
import { FixedTimestepIntegrator } from './engine/FixedTimestampIntegrator';
import { RigidBody2D } from './engine/physics/RigidBody2D';
import { RoadBlock } from './game/RoadBlock';
import { VehicleController } from './game/VehicleController';
import { Speedometer } from './game/Speedometer';

function createRoadBlocks() {
    const roadBlocks: RoadBlock[] = [];
    for (let i = 0; i < 10; i++) {
        roadBlocks.push(new RoadBlock(new Point(i, 0)));
    }
    return roadBlocks;
}

function main() {
    const canvas: HTMLCanvasElement = document.querySelector('canvas#canvas')!;
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    const ctx = canvas.getContext('2d')!;
    const viewport = new Viewport(
        new Point(0, 0),
        50,
        new Point(canvas.width, canvas.height)
    );
    const world = new World();
    const car = new Car(new Point(0, 0));
    const compass = new Compass();
    world.add(compass);
    world.add(car);
    world.addMany(createRoadBlocks());

    const carInitialRotation = fromDeg(90);
    const carInitialPosition = new Point(0, 0);
    const carBody = new RigidBody2D(carInitialPosition, carInitialRotation, 1);
    carBody.momentOfInertia = 0.1;
    const controller = new VehicleController(carBody);
    controller.setFriction(0.3);
    controller.setAngularFriction(1);

    const speedometer = new Speedometer(carBody);
    world.add(speedometer);

    const renderer = new WorldRenderer(ctx, viewport);
    const integrator = new FixedTimestepIntegrator(60);

    function loop() {
        car.position = carBody.position;
        car.angle = carBody.angle;

        viewport.rotation = carInitialRotation - car.angle;
        viewport.center = carBody.position;

        integrator.update((dt) => {
            controller.update(dt);
            carBody.update(dt);
        });
        renderer.render(world);
        requestAnimationFrame(loop);
    }

    setupKeyboardControl(controller);
    loop();

    function setupKeyboardControl(controller: VehicleController) {
        const throttleDelta = 0.5;
        const steeringDelta = 0.5;

        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowUp') controller.setThrottle(throttleDelta);
            if (e.code === 'ArrowDown') controller.setThrottle(-throttleDelta);

            if (e.code === 'ArrowLeft') controller.setSteering(steeringDelta);
            if (e.code === 'ArrowRight') controller.setSteering(-steeringDelta);
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowUp' || e.code === 'ArrowDown')
                controller.setThrottle(0);
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight')
                controller.setSteering(0);
        });
    }
}

main();
