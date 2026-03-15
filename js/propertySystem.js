export function handleTile(player, tile){

if(tile.type === "property"){

if(!tile.owner){

if(player.money >= tile.price){

player.money -= tile.price;

tile.owner = player;

console.log("Bought:", tile.name);

}

}else if(tile.owner !== player){

player.money -= tile.rent;

tile.owner.money += tile.rent;

console.log("Paid rent:", tile.rent);

}

}

if(tile.type === "tax"){

player.money -= tile.amount;

console.log("Tax paid:", tile.amount);

}

}
