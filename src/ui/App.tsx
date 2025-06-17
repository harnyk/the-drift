import React, { useEffect, useState } from 'react';
import LayeredLayout from './LayeredLayout';
import GameCanvas from './GameCanvas';
import PauseMenu from './PauseMenu';
import { DialogProvider, useDialogManager } from './DialogManager';

const InnerApp: React.FC = () => {
    const [paused, setPaused] = useState(false);
    const { hasDialog } = useDialogManager();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape' && !hasDialog) {
                setPaused((p) => !p);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [hasDialog]);

    const layers: React.ReactNode[] = [
        <GameCanvas key="game" paused={paused} />,
    ];
    if (paused) {
        layers.push(<PauseMenu key="pause" onExit={() => setPaused(false)} />);
    }

    return <LayeredLayout layers={layers} />;
};

const App: React.FC = () => (
    <DialogProvider>
        <InnerApp />
    </DialogProvider>
);

export default App;
