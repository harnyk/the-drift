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
    private pressed = {
        Up: false,
        Down: false,
        Left: false,
        Right: false,
    };

    private vertical = 0;
    private horizontal = 0;

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
        let changed = false;
        switch (e.code) {
            case this.keycodes.Up:
                changed = !this.pressed.Up;
                this.pressed.Up = true;
                break;
            case this.keycodes.Down:
                changed = !this.pressed.Down;
                this.pressed.Down = true;
                break;
            case this.keycodes.Left:
                changed = !this.pressed.Left;
                this.pressed.Left = true;
                break;
            case this.keycodes.Right:
                changed = !this.pressed.Right;
                this.pressed.Right = true;
                break;
        }
        if (changed) this.updateAxes();
    };

    private keyUpListener = (e: KeyboardEvent) => {
        let changed = false;
        switch (e.code) {
            case this.keycodes.Up:
                changed = this.pressed.Up;
                this.pressed.Up = false;
                break;
            case this.keycodes.Down:
                changed = this.pressed.Down;
                this.pressed.Down = false;
                break;
            case this.keycodes.Left:
                changed = this.pressed.Left;
                this.pressed.Left = false;
                break;
            case this.keycodes.Right:
                changed = this.pressed.Right;
                this.pressed.Right = false;
                break;
        }
        if (changed) this.updateAxes();
    };

    private updateAxes() {
        const newVertical = (this.pressed.Up ? 1 : 0) + (this.pressed.Down ? -1 : 0);
        const newHorizontal = (this.pressed.Right ? 1 : 0) + (this.pressed.Left ? -1 : 0);
        if (newVertical !== this.vertical) {
            this.vertical = newVertical;
            this.emit({ type: 'vertical', value: this.vertical });
        }
        if (newHorizontal !== this.horizontal) {
            this.horizontal = newHorizontal;
            this.emit({ type: 'horizontal', value: this.horizontal });
        }
    }

    attach() {
        document.addEventListener('keydown', this.keyDownListener);
        document.addEventListener('keyup', this.keyUpListener);
    }

    detach() {
        document.removeEventListener('keydown', this.keyDownListener);
        document.removeEventListener('keyup', this.keyUpListener);
    }
}
