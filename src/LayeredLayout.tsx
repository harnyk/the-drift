import React from 'react';
import GameCanvas from './GameCanvas';

/**
 * Full-screen layout with the game canvas at the bottom layer
 * and a transparent overlay for React UI.
 */
const LayeredLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative w-screen h-screen">
      <GameCanvas />
      <div className="absolute inset-0">
        {children}
        <div className="absolute bottom-0 right-0 p-1 text-xs text-gray-500">
          created by TheDrift team
        </div>
      </div>
    </div>
  );
};

export default LayeredLayout;
