import React, { useEffect, useRef, useState } from 'react';
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
                showDialog((id) => (
                    <Dialog title="Hello" onClose={() => closeDialog(id)}>
                        hello world
                    </Dialog>
                ));
            },
        },
        { label: 'Exit', onSelect: () => { console.log('Exit selected'); onExit(); } },
    ];
    const [selected, setSelected] = useState(0);
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        refs.current[selected]?.focus();
    }, [selected]);

    useEffect(() => {
        if (!isTop) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                setSelected((i) => (i - 1 + options.length) % options.length);
            } else if (e.code === 'ArrowDown') {
                e.preventDefault();
                setSelected((i) => (i + 1) % options.length);
            } else if (e.code === 'Enter') {
                e.preventDefault();
                options[selected].onSelect();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [options, selected, isTop]);

    return (
        <Dialog title="Menu" onClose={() => closeDialog(dialogId)}>
            <h3 className="text-red-600 font-mono text-lg mb-4">The Drift</h3>
            {options.map((opt, idx) => (
                <MenuOption
                    key={opt.label}
                    label={opt.label}
                    onSelect={opt.onSelect}
                    selected={idx === selected}
                    buttonRef={(el: HTMLButtonElement | null) => {
                        refs.current[idx] = el;
                    }}
                />
            ))}
        </Dialog>
    );
};

export default PauseMenu;
