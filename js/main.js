import { Engine } from "./core/engine.js"
import { Renderer } from "./core/renderer.js"
import { Player } from "./entities/player.js"
import { GameState } from "./core/state.js"
import { BoardSystem } from "./systems/boardSystem.js"
import { boardData } from "./data/boardData.js"

const canvas = document.getElementById("gameCanvas")

const renderer = new Renderer(canvas)

const boardSystem = new BoardSystem(renderer)

GameState.players = [

new Player("Player1","red"),
new Player("Player2","blue"),
new Player("AI","green","ai")

]

GameState.board = boardData

function update(){

}

function render(){

renderer.clear()

boardSystem.draw(GameState.board)

}

const engine = new Engine(update,render)

engine.start()
