import { Game } from './Game';

const canvas = document.querySelector('canvas#canvas')!;
const game = new Game(canvas as HTMLCanvasElement);
game.start();
