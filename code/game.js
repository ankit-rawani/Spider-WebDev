const can = document.querySelector('canvas')
const nav = document.querySelector('nav')
const back = document.querySelector('#back')
const pause = document.querySelector('#pause')
const play = document.querySelector('#play')
const replay = document.querySelector('#replay')
var ctx = can.getContext("2d")

can.height = window.innerHeight
can.width = window.innerWidth

window.addEventListener('resize', e => {
    can.height = window.innerHeight
    can.width = window.innerWidth

})

window.addEventListener('click', function (e) { 
    var mouse = new Vector(e.x, e.y)
    let i=0
    bubbleArray.forEach(bub=>{

        if(distance(mouse, bub.position) <= bub.radius){
            bubbleArray.splice(i,1)
        }
        i++
    })
    console.log(e)
})

function distance(pos1,pos2){
    return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y))
}

function detectCollision(p1, p2, rad){
    let dist = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))

    return (dist <= 2*rad)
}

function randomIn(min, max){
    return Math.random()*(max - min) + min
}

function Vector(x,y){
    this.x = x
    this.y = y

    this.mod = Math.sqrt(this.x*this.x+this.y*this.y)
}

function dotProduct(v1,v2){
    return v1.x * v2.x + v2.y * v2.y
}

function rotate(v, angle){
    let v_rotated = new Vector(v.x * Math.cos(angle) - v.y * Math.sin(angle), v.x * Math.sin(angle) + v.y * Math.cos(angle))

    return v_rotated
}

function Bubble(position, velocity, radius, dr){
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.dr = dr

    this.draw = function(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = "#ffffff"
        ctx.fill()
        ctx.closePath()
    }

    this.expand = function() {
        this.radius += this.dr
        this.draw() 
    }

    this.move = function(){
        if(this.position.x + this.radius >= can.width || this.position.x <= this.radius){
            this.velocity.x = -this.velocity.x
        }

        if (this.position.y + this.radius >= can.height || this.position.y <= this.radius) {
            this.velocity.y = -this.velocity.y
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.draw()
    }

    this.rebound = function () {
        bubbleArray.forEach(bub => {
            if(this!=bub){ 
                let del_v = new Vector(
                    this.velocity.x - bub.velocity.x,
                    this.velocity.y - bub.velocity.y
                )

                let del_p = new Vector(
                    bub.position.x - this.position.x,
                    bub.position.y - this.position.y
                )
                if(detectCollision(this.position, bub.position, this.radius)){
                    if (dotProduct(del_p,del_v)>=0) {
                        //console.log(true)
                        let phi = -Math.atan((bub.position.y - this.position.y) / (bub.position.x - this.position.x))

                        this.velocity = rotate(this.velocity, phi)
                        bub.velocity = rotate(bub.velocity, phi)

                        let temp = this.velocity.x
                        this.velocity.x = bub.velocity.x
                        bub.velocity.x = temp

                        this.velocity = rotate(this.velocity, -phi)
                        bub.velocity = rotate(bub.velocity, -phi)

                    }
                }

            }
        })

        this.move()
        
    }
}

var bubbleArray = []


var pos, vel, r=30, dr=0.1

// for(let i=0; i<5; i++){
    
// }

var time = 1000
window.ab = setInterval(function(){
    x = randomIn(r + 1, can.width - r)
    y = randomIn(r + 1, can.height - r)
    vx = randomIn(-5, 5)
    vy = randomIn(-5, 5)

    pos = new Vector(x, y)
    vel = new Vector(vx, vy)

    
        for (let j = 0; j < bubbleArray.length; j++) {
            //console.log(true)
            if (detectCollision(bubbleArray[j].position, pos, r)) {
                pos.x = randomIn(r + 1, can.width - r)
                pos.y = randomIn(r + 1, can.height - r)
                // console.log(true)

                j = -1;
            }
        }

    bubbleArray.push(new Bubble(pos, vel, r, dr))
    
}, time)



//to prevent the page from crashing setting limit to be half the maximum number to bubbles that can be accomodated
var max_bubbles = Math.floor(0.5*((innerHeight * innerWidth)/(Math.PI*r*r)))
console.log(max_bubbles)

var AnimationFrame

function animate(){
    if (bubbleArray.length >= max_bubbles) {
        window.cancelAnimationFrame(AnimationFrame)
        clearInterval(window.ab)
        console.log("done")
        return
    }

    ctx.clearRect(0, 0, can.width, can.height)

    bubbleArray.forEach(b => {
        b.rebound()
    })

    AnimationFrame = window.requestAnimationFrame(animate)

}

animate()


var gamePlayState = true
pause.addEventListener('click', pauseGame)
play.addEventListener('click', playGame)
replay.addEventListener('click', replayGame)

function pauseGame(e) {
    gamePlayState = false
    window.cancelAnimationFrame(AnimationFrame)
    clearInterval(window.ab)
}

function playGame(e) {
    if(!gamePlayState){
        gamePlayState = true
        animate()
        window.ab = setInterval(function () {
        x = randomIn(r + 1, can.width - r)
        y = randomIn(r + 1, can.height - r)
        vx = randomIn(-5, 5)
        vy = randomIn(-5, 5)

        pos = new Vector(x, y)
        vel = new Vector(vx, vy)


        for (let j = 0; j < bubbleArray.length; j++) {
            //console.log(true)
            if (detectCollision(bubbleArray[j].position, pos, r)) {
                pos.x = randomIn(r + 1, can.width - r)
                pos.y = randomIn(r + 1, can.height - r)
                // console.log(true)

                j = -1;
            }
        }

        bubbleArray.push(new Bubble(pos, vel, r, dr))

        }, time)
    }
        
}

function replayGame(e) {
    bubbleArray = []
    ctx.clearRect(0, 0, can.width, can.height)
    window.cancelAnimationFrame(AnimationFrame)
    clearInterval(window.ab)
    animate()
    window.ab = setInterval(function () {
        x = randomIn(r + 1, can.width - r)
        y = randomIn(r + 1, can.height - r)
        vx = randomIn(-2, 2)
        vy = randomIn(-2, 2)

        pos = new Vector(x, y)
        vel = new Vector(vx, vy)


        for (let j = 0; j < bubbleArray.length; j++) {
            //console.log(true)
            if (detectCollision(bubbleArray[j].position, pos, r)) {
                pos.x = randomIn(r + 1, can.width - r)
                pos.y = randomIn(r + 1, can.height - r)
                // console.log(true)

                j = -1;
            }
        }

        bubbleArray.push(new Bubble(pos, vel, r, dr))

    }, time)
}