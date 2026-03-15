export class Player {

constructor(){

this.position = 0;

this.money = 1500;

this.token = document.createElement("div");

this.token.classList.add("player");

}

spawn(board){

board.children[this.position].appendChild(this.token);

}

move(steps, board){

this.position += steps;

if(this.position >= board.children.length){

this.position = this.position % board.children.length;

}

board.children[this.position].appendChild(this.token);

}

}
