import React from 'react';

export interface DialogProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ title, children, onClose }) => {
    return (
        <div className="bg-gray-800 bg-opacity-90 rounded p-4 w-64 text-center">
            <h2 className="text-red-600 font-mono text-xl mb-2">{title}</h2>
            <div className="text-white mb-4">{children}</div>
            <button
                className="px-4 py-2 font-mono border border-red-600 rounded hover:bg-red-600 hover:text-black"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
};

export default Dialog;
