import React from 'react';
import pkg from '../package.json';

/**
 * Transparent full-screen overlay used for React UI elements.
 * Currently only displays a small debug label.
 */
const UiOverlay: React.FC = () => (
    <div className="w-full h-full">
        <div className="absolute bottom-0 right-0 p-1 text-xs text-gray-500">
            <a target="_blank" href={pkg.homepage}>
                TheDrift v{pkg.version}
            </a>
        </div>
    </div>
);

export default UiOverlay;
