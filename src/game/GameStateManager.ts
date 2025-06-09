export type GameState = 'playing' | 'victory' | 'defeat';

export class GameStateManager {
    private _state: GameState = 'playing';

    get state(): GameState {
        return this._state;
    }

    isPlaying() {
        return this._state === 'playing';
    }

    win() {
        this._state = 'victory';
    }

    lose() {
        this._state = 'defeat';
    }
}
