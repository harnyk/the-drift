import React, { useEffect, useRef } from 'react';
import { Game } from './Game';

/**
 * React wrapper that mounts the Game once and keeps it running
 * across re-renders. Handles window resizing so the canvas
 * always matches the browser size in pixels.
 */
export const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gameRef = useRef<Game | null>(null);

    const resize = () => {
        const canvas = canvasRef.current;
        const game = gameRef.current;
        if (!canvas || !game) {
            return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        gameRef.current!.resize(width, height);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        window.addEventListener('resize', resize);
        if (!canvas || gameRef.current) {
            return;
        }

        gameRef.current = new Game(canvas);

        resize();
        gameRef.current.start();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default GameCanvas;
