import React from 'react';

/**
 * Empty pause menu container displayed when the game is paused.
 * Currently does not contain any controls.
 */
const PauseMenu: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="w-64 h-40 bg-gray-800 bg-opacity-90 rounded" />
    </div>
);

export default PauseMenu;
