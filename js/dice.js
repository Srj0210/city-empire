export function rollDice(){

let d1 = Math.floor(Math.random()*6)+1
let d2 = Math.floor(Math.random()*6)+1

return {
dice1:d1,
dice2:d2,
total:d1+d2
}

}
