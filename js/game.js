import { rollDice } from "./dice.js"
import { Player } from "./player.js"
import { board } from "./board.js"

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

let players = [

new Player("Player 1","red"),
new Player("Player 2","blue"),
new Player("AI 1","green","ai"),
new Player("AI 2","yellow","ai")

]

let currentPlayer = 0

function drawBoard(){

ctx.clearRect(0,0,800,800)

let size = 80

for(let i=0;i<10;i++){

ctx.strokeRect(i*size,0,size,size)

}

}

function drawPlayers(){

players.forEach(p=>{

let x = (p.position%10)*80+20
let y = 20

ctx.fillStyle = p.color
ctx.beginPath()
ctx.arc(x,y,10,0,Math.PI*2)
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
