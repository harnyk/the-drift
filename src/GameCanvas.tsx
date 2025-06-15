import React, { useEffect, useRef } from 'react';
import { Game } from './Game';

/**
 * React wrapper that mounts the Game once.
 */
export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!canvasRef.current || gameRef.current) return;

    gameRef.current = new Game(canvasRef.current);
    gameRef.current.start();
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default GameCanvas;
