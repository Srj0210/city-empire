import { rollDice } from "./dice.js"
import { Player } from "./player.js"
import { board } from "./board.js"

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const size = 80
const boardSize = 10

let players = [

new Player("Player 1","red"),
new Player("Player 2","blue"),
new Player("AI 1","green","ai"),
new Player("AI 2","yellow","ai")

]

let currentPlayer = 0


function getTilePosition(index){

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



function drawBoard(){

ctx.clearRect(0,0,canvas.width,canvas.height)

for(let i=0;i<40;i++){

let pos = getTilePosition(i)

ctx.strokeStyle="black"
ctx.strokeRect(pos.x,pos.y,size,size)

ctx.fillStyle="black"
ctx.font="10px Arial"

let name = board[i].name

ctx.fillText(name,pos.x+5,pos.y+20)

}

}



function drawPlayers(){

players.forEach(p=>{

let pos = getTilePosition(p.position)

ctx.fillStyle = p.color

ctx.beginPath()

ctx.arc(pos.x+40,pos.y+40,10,0,Math.PI*2)

ctx.fill()

})

}



function update(){

drawBoard()
drawPlayers()

}



document.getElementById("rollDice").onclick=()=>{

let result = rollDice()

let player = players[currentPlayer]

player.move(result.total)

update()

}



update()
