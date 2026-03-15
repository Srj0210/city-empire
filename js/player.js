export class Player{

constructor(name,color,type="human"){

this.name = name
this.color = color
this.type = type

this.money = 1500
this.position = 0
this.properties = []

}

move(steps){

this.position += steps

if(this.position >= 40){
this.position -= 40
this.money += 200
}

}

}
