export class BoardSystem{

constructor(renderer){

this.renderer = renderer

this.tileSize = 80
this.boardSize = 10

}

getTilePosition(index){

const size = this.tileSize
const canvas = this.renderer.canvas

// bottom row
if(index <= 10){

return {
x: canvas.width - (index+1)*size,
y: canvas.height - size
}

}

// left column
if(index <= 19){

return {
x: 0,
y: canvas.height - (index-9)*size
}

}

// top row
if(index <= 29){

return {
x: (index-20)*size,
y: 0
}

}

// right column
return {
x: canvas.width - size,
y: (index-29)*size
}

}

draw(boardData){

for(let i=0;i<40;i++){

const tile = boardData[i]

const pos = this.getTilePosition(i)

this.renderer.drawRect(pos.x,pos.y,this.tileSize,this.tileSize)

this.renderer.drawText(tile.name,pos.x+5,pos.y+20)

}

}

}
