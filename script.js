const canvasEl = document.querySelector("canvas"),
 canvasCtx = canvasEl.getContext("2d"),
 gapx = 10
 


const mouse = { x: 0, y: 0}

// objeto do campo
const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function(){
    // desenhando o campo
        canvasCtx.fillStyle = "#286047"
        canvasCtx.fillRect(0, 0, this.w, this.h)
    },
}

//objeto da linha
const line = {
    w: 15,
    h: field.h,
    draw: function(){
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect( field.w / 2 - this.w / 2, 0, this.w, this.h)

    },
}

//desenhando a raquete esquerda
const leftPaddle = {
    x: gapx,
    y: 0,
    w: line.w,
    h: 200,
    _move: function() {
        this.y = mouse.y - this.h /2
    },
    draw: function(){
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    },
}

const rightPaddle = {
    x: field.w - line.w - gapx,
    y: 100,
    w: line.w,
    h: 200,
    speed: 5,
    _move: function(){
        if(this.y + this.h / 2 < ball.y + ball.r){
            this.y += this.speed
        } else {
            this.y -= this.speed
        }
        this.y = ball.y
    },
    speedUp: function(){
        this.speed += 2
    },
    draw: function(){
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    },
}

// desenhando o placar
const score = {
    human: 0,
    computer: 0,
    increaseHuman: function(){
        this.human++
    },
    increaseComputer: function(){
        this.computer++
    },
    draw: function(){
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = 'center'
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341d"
        canvasCtx.fillText(this.human, field.w / 4, 50 )
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50)
    },
}

// desenhando a bolinha
const ball = {
    x: 0,
    y: 0,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function(){
    // verifica se o jogador 1 fez um ponto (x > largura do campo)
    if(this.x > field.w - this.r - rightPaddle.w - gapx){
        //verifica se a raquete direita está na posiçãi y da bola
        if(this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h){
            // rebate na bola na raquete do computador
            this._reverseX()
        } else {
            score.increaseHuman()
            this._pointUp()
        }
    }
    // regra de pontuação da raquete do computador
    if(this.x < this.r + leftPaddle.w + gapx){
        // verifica se a raquete esquerda está na posição y da bola
        if(this.y + this.r> leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
            // rebate a bola
            this._reverseX()
        }else {
            score.increaseComputer()
            this._pointUp()
        }
    }
    // verifica as linhas superior e inferior
        if (
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)){
            // rebate a bola revertando o eixo y
            this._reverseY()
        }
    },
    // muda a direção da bolhinha
    _reverseX: function(){
        this.directionX *= -1
    },
    _reverseY: function(){
        this.directionY *= -1
    },
    _move: function(){
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    _speedUp: function(){
        this.speed += 3
    },
    _pointUp: function(){
        rightPaddle.speedUp()
        this._speedUp()
        this.x = field.w / 2
        this.y = field.h / 2


     },
    draw: function(){
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()

    },
}



function setup() {
    // demarcando até onde vai ser visto o campo
    canvasEl.width = canvasCtx.width = field.w
    canvasEl.height = canvasCtx.height = field.h
}

function draw() {
    field.draw()
    line.draw()

    leftPaddle.draw()
    rightPaddle.draw()

    ball.draw()

    score.draw()

    
    
}

window.animateFrame = (function(){
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
}) ()


function main () {
    animateFrame(main)
    draw()
}

canvasEl.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX
    mouse.y = e.pageY

})

setup()
main()

