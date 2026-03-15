import { tiles } from "../data/cities.js";

export function createBoard(){

const board = document.getElementById("board");

tiles.forEach(tile => {

const div = document.createElement("div");

div.classList.add("tile");
div.innerText = tile;

board.appendChild(div);

});

}
