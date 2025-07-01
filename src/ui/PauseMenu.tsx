import React, { useEffect, useRef } from 'react';
import MenuOption from './MenuOption';
import Dialog from './Dialog';
import { useDialogManager } from './DialogManager';

export interface PauseMenuProps {
    onExit: () => void;
    dialogId: number;
    isTop: boolean;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onExit, dialogId, isTop }) => {
    const { showDialog, closeDialog } = useDialogManager();
    const options = [
        {
            label: 'About',
            onSelect: () => {
                showDialog((id, top) => (
                    <Dialog
                        title="About"
                        onClose={() => closeDialog(id)}
                        isTop={top}
                    >
                        <b>TheDrift</b>, (c) 2025{' '}
                        <a
                            target="_blank"
                            href="https://github.com/harnyk/the-drift"
                        >
                            https://github.com/harnyk/the-drift
                        </a>
                    </Dialog>
                ));
            },
        },
    ];

    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        if (isTop) {
            refs.current[0]?.focus();
        }
    }, [isTop]);

    return (
        <Dialog
            title="The Drift"
            onClose={() => closeDialog(dialogId)}
            isTop={isTop}
        >
            <h3 className="text-red-600 font-mono text-lg mb-4">Paused</h3>
            {options.map((opt, idx) => (
                <MenuOption
                    key={opt.label}
                    label={opt.label}
                    onSelect={opt.onSelect}
                    buttonRef={(el: HTMLButtonElement | null) => {
                        refs.current[idx] = el;
                    }}
                    isTop={isTop}
                />
            ))}
        </Dialog>
    );
};

export default PauseMenu;
