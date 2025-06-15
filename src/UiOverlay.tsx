import React from 'react';

/**
 * Transparent full-screen overlay used for React UI elements.
 * Currently only displays a small debug label.
 */
const UiOverlay: React.FC = () => (
  <div className="w-full h-full pointer-events-none">
    <div className="absolute bottom-0 right-0 p-1 text-xs text-gray-500">
      created by TheDrift team
    </div>
  </div>
);

export default UiOverlay;
