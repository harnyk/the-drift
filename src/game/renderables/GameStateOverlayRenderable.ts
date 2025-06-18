import { Renderable } from '../../../src/engine/Renderable';
import { Viewport } from '../../../src/engine/Viewport';
import { GameStateManager } from '../GameStateManager';
import { Node } from '../../../src/engine/Node';

export class GameStateOverlayRenderable extends Node implements Renderable {
    constructor(private readonly stateManager: GameStateManager) {
        super();
    }

    render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        if (this.stateManager.isPlaying()) return;

        viewport.inScreenCoordinates(ctx, () => {
            ctx.font = 'bold 60px monospace';
            ctx.fillStyle =
                this.stateManager.state === 'victory' ? '#00ff00' : '#ff0000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                this.stateManager.state === 'victory' ? 'VICTORY' : 'GAME OVER',
                viewport.canvasSize.x / 2,
                viewport.canvasSize.y / 2
            );
        });
    }
}
