export interface IGame {
    start: () => void;
    pause: () => void;
    resume: () => void;
    resize: (width: number, height: number) => void;
}
