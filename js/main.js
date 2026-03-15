import { createBoard } from "./board.js";
import { Player } from "./player.js";
import { GameEngine } from "./engine.js";

window.onload = () => {

createBoard();

const board = document.getElementById("board");

const player = new Player();

player.spawn(board);

const engine = new GameEngine(player, board);

const btn = document.getElementById("rollDice");

btn.onclick = () => {

engine.roll();

};

};
