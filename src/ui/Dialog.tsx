import React from 'react';
import { FocusTrap } from 'focus-trap-react';
import MenuOption from './MenuOption';

export interface DialogProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    isTop: boolean;
}

const Dialog: React.FC<DialogProps> = ({ title, children, onClose, isTop }) => {
    return (
        <FocusTrap
            active={isTop}
            focusTrapOptions={{ allowOutsideClick: false, initialFocus: false }}
        >
            <div className="bg-gray-800 bg-opacity-90 rounded p-4 w-64 text-center">
                <h2 className="text-red-600 font-mono text-xl mb-2">{title}</h2>
                <div className="text-white mb-4">{children}</div>
                <MenuOption label="Close" onSelect={onClose} isTop={isTop} />
            </div>
        </FocusTrap>
    );
};

export default Dialog;
