export class FixedTimestepIntegrator {
    private accumulator = 0;
    private lastTime = performance.now();
    private readonly timestep: number;

    constructor(fps = 60) {
        this.timestep = 1 / fps;
    }

    update(updateFn: (dt: number) => void) {
        const now = performance.now();
        this.accumulator += (now - this.lastTime) / 1000;
        this.lastTime = now;

        while (this.accumulator >= this.timestep) {
            updateFn(this.timestep);
            this.accumulator -= this.timestep;
        }
    }

    reset() {
        this.lastTime = performance.now();
        this.accumulator = 0;
    }
}
