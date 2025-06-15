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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameRef.current) return;

    gameRef.current = new Game(canvas);
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      gameRef.current?.resize(width, height);
    };

    resize();
    window.addEventListener('resize', resize);
    gameRef.current.start();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default GameCanvas;
