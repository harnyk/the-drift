import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface DialogManagerContext {
    showDialog: (dialog: React.ReactNode) => void;
    closeDialog: () => void;
    hasDialog: boolean;
}

const Context = createContext<DialogManagerContext | null>(null);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stack, setStack] = useState<React.ReactNode[]>([]);

    const showDialog = useCallback((dialog: React.ReactNode) => {
        setStack((s) => [...s, dialog]);
    }, []);

    const closeDialog = useCallback(() => {
        setStack((s) => s.slice(0, -1));
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape' && stack.length > 0) {
                e.preventDefault();
                closeDialog();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [stack.length, closeDialog]);

    return (
        <Context.Provider value={{ showDialog, closeDialog, hasDialog: stack.length > 0 }}>
            {children}
            {stack.map((dialog, idx) => (
                <div key={idx} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 100 + idx }}>
                    {dialog}
                </div>
            ))}
        </Context.Provider>
    );
};

export const useDialogManager = (): DialogManagerContext => {
    const ctx = useContext(Context);
    if (!ctx) {
        throw new Error('useDialogManager must be used within DialogProvider');
    }
    return ctx;
};
