export class Renderer{

constructor(canvas){

this.canvas=canvas
this.ctx=canvas.getContext("2d")

}

clear(){

this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

}

drawRect(x,y,w,h){

this.ctx.strokeStyle="black"

this.ctx.strokeRect(x,y,w,h)

}

drawText(text,x,y){

this.ctx.fillStyle="black"

this.ctx.font="12px Arial"

this.ctx.fillText(text,x,y)

}

drawCircle(x,y,r,color){

this.ctx.fillStyle=color

this.ctx.beginPath()

this.ctx.arc(x,y,r,0,Math.PI*2)

this.ctx.fill()

}

}
