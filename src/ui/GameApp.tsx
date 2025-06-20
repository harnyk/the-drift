import React, { useEffect, useState } from 'react';
import LayeredLayout from './LayeredLayout';
import GameCanvas from './GameCanvas';
import PauseMenu from './PauseMenu';
import { DialogProvider, useDialogManager } from './DialogManager';
import { Game } from '../game/Game';

const InnerGame: React.FC = () => {
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
        <LayeredLayout
            layers={[
                <GameCanvas
                    gameFactory={(canvas) => new Game(canvas)}
                    key="game"
                    paused={paused}
                />,
            ]}
        />
    );
};

const GameApp: React.FC = () => (
    <DialogProvider>
        <InnerGame />
    </DialogProvider>
);

export default GameApp;
