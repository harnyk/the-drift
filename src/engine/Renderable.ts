import { Viewport } from "./Viewport";


export interface Renderable {
    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void;
}
