import { FixedTimestepIntegrator } from './engine/FixedTimestepIntegrator';
import { Grid } from './engine/Grid';
import { Vec2D } from './engine/Vec2D';
import { Viewport } from './engine/Viewport';
import { World } from './engine/World';
import { WorldRenderer } from './engine/WorldRenderer';
import { fromDeg } from './engine/fromDeg';
import { RigidBody2D } from './engine/physics/RigidBody2D';
import {
    CollisionBody,
    CollisionDetector,
} from './engine/physics/CollisionDetector';
import { Car } from './game/Car';
import { Compass } from './game/Compass';
import { RoadBlock } from './game/RoadBlock';
import { Speedometer } from './game/Speedometer';
import { VehicleController } from './game/VehicleController';
import { KeyboardControl, KeyCodeWASD } from './game/controls/KeyboardControl';

function createRoadBlocks() {
    const roadBlocks: RoadBlock[] = [];
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            roadBlocks.push(
                new RoadBlock({
                    position: new Vec2D(x * 7, y * 7 + 5),
                    color: '#a00',
                })
            );
        }
    }
    return roadBlocks;
}

function main() {
    const canvas: HTMLCanvasElement = document.querySelector('canvas#canvas')!;
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    const ctx = canvas.getContext('2d')!;
    const viewport = new Viewport(
        new Vec2D(0, 0),
        50,
        new Vec2D(canvas.width, canvas.height)
    );

    const gameController = new KeyboardControl(KeyCodeWASD);
    gameController.attach();

    const world = new World();
    const car = new Car(new Vec2D(0, 0));
    const compass = new Compass();
    world.add(compass);
    const grid = new Grid(1, '#ddd');
    world.add(grid);
    const roadBlocks = createRoadBlocks();
    world.addMany(roadBlocks);
    world.add(car);

    const collisionDetector = new CollisionDetector();
    for (const block of roadBlocks) {
        collisionDetector.addBody(
            new CollisionBody(block.position, block.size, block.angle, 'static')
        );
    }

    const carInitialRotation = fromDeg(90);
    const carInitialPosition = new Vec2D(0, 0);
    const carBody = new RigidBody2D(carInitialPosition, carInitialRotation, 1);
    carBody.momentOfInertia = 0.1;
    const carCollider = new CollisionBody(
        carBody.position,
        new Vec2D(1, 0.5),
        carBody.angle,
        'dynamic'
    );
    collisionDetector.addBody(carCollider);
    const vehicleController = new VehicleController(carBody);
    vehicleController.setFriction(0.3);
    vehicleController.setAngularFriction(1);

    const speedometer = new Speedometer(carBody);
    world.add(speedometer);

    const renderer = new WorldRenderer(ctx, viewport);
    const integrator = new FixedTimestepIntegrator(60);

    function loop() {
        car.position = carBody.position;
        car.angle = carBody.angle;
        carCollider.position = carBody.position;
        carCollider.angle = carBody.angle;

        viewport.rotation = carInitialRotation - car.angle;
        viewport.center = viewport.screenToWorldPoint(
            viewport
                .worldToScreenPoint(carBody.position)
                .sub(new Vec2D(0, canvas.height * 0.25))
        );

        integrator.update((dt) => {
            vehicleController.update(dt);
            carBody.update(dt);
        });
        renderer.render(world);
        const collisions = collisionDetector.detect().filter(
            ({ a, b }) => a === carCollider || b === carCollider
        );
        if (collisions.length > 0) {
            console.log('Collisions:', collisions);
        }
        requestAnimationFrame(loop);
    }

    setupKeyboardControl(vehicleController, gameController);
    loop();

    function setupKeyboardControl(
        controller: VehicleController,
        control: KeyboardControl
    ) {
        const throttleDelta = 0.5;
        const steeringDelta = 0.5;

        control.subscribe(({ type, value }) => {
            switch (type) {
                case 'vertical':
                    controller.setThrottle(value * throttleDelta);
                    break;
                case 'horizontal':
                    controller.setSteering(-value * steeringDelta);
                    break;
            }
        });
    }
}

main();
