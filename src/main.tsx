import { Game } from './Game';
import 'tailwindcss/tailwind.css';

const canvas = document.querySelector('canvas#canvas')!;
const game = new Game(canvas as HTMLCanvasElement);
game.start();
