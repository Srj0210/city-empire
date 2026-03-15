const diceBtn = document.getElementById("rollDice");
const diceResult = document.getElementById("diceResult");

diceBtn.addEventListener("click", () => {

    let dice = Math.floor(Math.random() * 6) + 1;

    diceResult.innerText = "Dice: " + dice;

});
