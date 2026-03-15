import { rollDice } from "./dice.js";

export class GameEngine {

constructor(player, board){

this.player = player;

this.board = board;

}

roll(){

const dice = rollDice();

console.log("Dice:", dice);

this.player.move(dice, this.board);

}

}
