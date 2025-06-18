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
            label: 'Show Dialog',
            onSelect: () => {
                showDialog((id, top) => (
                    <Dialog title="Hello" onClose={() => closeDialog(id)} isTop={top}>
                        hello world
                    </Dialog>
                ));
            },
        },
        {
            label: 'Exit',
            onSelect: () => {
                console.log('Exit selected');
                onExit();
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
        <Dialog title="Menu" onClose={() => closeDialog(dialogId)} isTop={isTop}>
            <h3 className="text-red-600 font-mono text-lg mb-4">The Drift</h3>
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
