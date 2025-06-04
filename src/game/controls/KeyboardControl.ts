export interface KeyCodes {
    Up: string;
    Down: string;
    Left: string;
    Right: string;
}

export const KeyCodeArrows = {
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
} as const;

export const KeyCodeWASD = {
    Up: 'KeyW',
    Down: 'KeyS',
    Left: 'KeyA',
    Right: 'KeyD',
} as const;


type ControlEvent = {
    type: 'vertical' | 'horizontal';
    value: number;
};

type Listener = (event: ControlEvent) => void;

export class KeyboardControl {
    private listeners: Listener[] = [];

    constructor(private keycodes: KeyCodes) {}

    subscribe(fn: Listener) {
        this.listeners.push(fn);
    }

    unsubscribe(fn: Listener) {
        this.listeners = this.listeners.filter((l) => l !== fn);
    }

    private emit(event: ControlEvent) {
        for (const fn of this.listeners) fn(event);
    }

    private keyDownListener = (e: KeyboardEvent) => {
        switch (e.code) {
            case this.keycodes.Up:
                this.emit({ type: 'vertical', value: 1 });
                break;
            case this.keycodes.Down:
                this.emit({ type: 'vertical', value: -1 });
                break;
            case this.keycodes.Left:
                this.emit({ type: 'horizontal', value: -1 });
                break;
            case this.keycodes.Right:
                this.emit({ type: 'horizontal', value: 1 });
                break;
        }
    };

    private keyUpListener = (e: KeyboardEvent) => {
        switch (e.code) {
            case this.keycodes.Up:
            case this.keycodes.Down:
                this.emit({ type: 'vertical', value: 0 });
                break;
            case this.keycodes.Left:
            case this.keycodes.Right:
                this.emit({ type: 'horizontal', value: 0 });
                break;
        }
    };

    attach() {
        document.addEventListener('keydown', this.keyDownListener);
        document.addEventListener('keyup', this.keyUpListener);
    }

    detach() {
        document.removeEventListener('keydown', this.keyDownListener);
        document.removeEventListener('keyup', this.keyUpListener);
    }
}
