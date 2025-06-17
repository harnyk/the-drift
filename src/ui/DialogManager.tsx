import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

export interface DialogManagerContext {
    showDialog: (
        render: (id: number, isTop: boolean) => React.ReactNode,
        onClose?: () => void
    ) => number;
    closeDialog: (id?: number) => void;
    hasDialog: boolean;
    topId: number | null;
}

interface DialogEntry {
    id: number;
    render: (id: number, isTop: boolean) => React.ReactNode;
    onClose?: () => void;
}

const Context = createContext<DialogManagerContext | null>(null);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stack, setStack] = useState<DialogEntry[]>([]);
    const nextId = useRef(1);

    const showDialog = useCallback(
        (render: (id: number, isTop: boolean) => React.ReactNode, onClose?: () => void): number => {
            const id = nextId.current++;
            setStack((s) => [...s, { id, render, onClose }]);
            return id;
        },
        []
    );

    const closeDialog = useCallback(
        (id?: number) => {
            setStack((s) => {
                if (s.length === 0) return s;
                const top = s[s.length - 1];
                if (id === undefined || top.id === id) {
                    top.onClose?.();
                    return s.slice(0, -1);
                }
                return s;
            });
        },
        []
    );

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

    const topId = stack.length ? stack[stack.length - 1].id : null;

    return (
        <Context.Provider value={{ showDialog, closeDialog, hasDialog: stack.length > 0, topId }}>
            {children}
            {stack.map((entry, idx) => (
                <div
                    key={entry.id}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    style={{ zIndex: 100 + idx }}
                >
                    {entry.render(entry.id, idx === stack.length - 1)}
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

export const useIsTopDialog = (id: number): boolean => {
    const { topId } = useDialogManager();
    return topId === id;
};
