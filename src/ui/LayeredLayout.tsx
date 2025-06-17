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
    </div>
  );
};

export default LayeredLayout;
