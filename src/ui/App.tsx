import React, { useEffect, useState } from 'react';
import LayeredLayout from './LayeredLayout';
import GameCanvas from './GameCanvas';
import PauseMenu from './PauseMenu';
import { DialogProvider, useDialogManager } from './DialogManager';

const InnerApp: React.FC = () => {
    const [paused, setPaused] = useState(false);
    const { hasDialog, showDialog, closeDialog } = useDialogManager();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape' && !hasDialog) {
                setPaused(true);
                showDialog(
                    (id, isTop) => (
                        <PauseMenu
                            dialogId={id}
                            isTop={isTop}
                            onExit={() => closeDialog(id)}
                        />
                    ),
                    () => setPaused(false)
                );
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [hasDialog, showDialog, closeDialog]);

    return (
        <LayeredLayout layers={[<GameCanvas key="game" paused={paused} />]} />
    );
};

const App: React.FC = () => (
    <DialogProvider>
        <InnerApp />
    </DialogProvider>
);

export default App;
