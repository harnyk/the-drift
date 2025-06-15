import React from 'react';

export interface LayeredLayoutProps {
  layers: React.ReactNode[];
}

/**
 * Generic full-screen container that stacks layers on top of each other.
 * The first layer is rendered at the bottom.
 */
const LayeredLayout: React.FC<LayeredLayoutProps> = ({ layers }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {layers.map((layer, idx) => (
        <div key={idx} className="absolute inset-0" style={{ zIndex: idx }}>
          {layer}
        </div>
      ))}
      <div className="absolute bottom-0 right-0 p-1 text-xs text-gray-500 pointer-events-none" style={{ zIndex: layers.length }}>
        created by TheDrift team
      </div>
    </div>
  );
};

export default LayeredLayout;
