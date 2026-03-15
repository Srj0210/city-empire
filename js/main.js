import { Engine } from "./core/engine.js"
import { Renderer } from "./core/renderer.js"
import { Player } from "./entities/player.js"
import { GameState } from "./core/state.js"

const canvas=document.getElementById("gameCanvas")

const renderer=new Renderer(canvas)

GameState.players=[

new Player("Player1","red"),
new Player("Player2","blue"),
new Player("AI","green","ai")

]

function update(){

}

function render(){

renderer.clear()

renderer.drawText("City Empire Engine Running",350,450)

}

const engine=new Engine(update,render)

engine.start()
