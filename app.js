var canvas
var canvasContext
var ballX = 50
var ballY = 50
var ballSpeedX = 10
var ballSpeedY = 4

var paddle1Y = 250
var paddle2Y = 250
const paddle_height = 100
const paddle_thickness = 10

var player1Score = 0
var player2Score = 0
var winning_score = 5

var showWinningScreen = false

function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect()
    var root = document.documentElement
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x : mouseX,
        y : mouseY
    }
}

function handleMouseClick(evt){
    if(showWinningScreen){
        player1Score = 0
        player2Score = 0
        showWinningScreen = false
    }
}

window.onload = function(){
    //console.log("Hello World")
    canvas = document.getElementById('gameCanvas')
    canvasContext = canvas.getContext('2d')

    var framesPerSecond = 30
    setInterval(function(){
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond)

    canvas.addEventListener('mousedown', handleMouseClick)

    canvas.addEventListener('mousemove', function(evt){
        var mousePos = calculateMousePos(evt)
        paddle1Y = mousePos.y - (paddle_height / 2)
    })
}

function ballReset(){

    if(player1Score >= winning_score || player2Score >= winning_score){
        showWinningScreen = true
    }

    ballSpeedX = -ballSpeedX
    ballX = canvas.width / 2
    ballY = canvas.height / 2
}

function computerMovement(){
    var paddle2YCenter = paddle2Y + (paddle_height / 2)

    if(paddle2YCenter < ballY - 35){
        paddle2Y = paddle2Y + 6
    }

    else if(paddle2YCenter > ballY + 35)
    {
        paddle2Y = paddle2Y - 6
    }
}

function moveEverything(){

    if(showWinningScreen){
        return
    }

    computerMovement()
    ballX += ballSpeedX
    ballY += ballSpeedY

    
    if(ballX < 0){
        //ballSpeedX = - ballSpeedX
        if(ballY > paddle1Y && ballY < paddle1Y + paddle_height){
            ballSpeedX = -ballSpeedX

            var deltaY = ballY - (paddle1Y + paddle_height / 2)

            ballSpeedY = deltaY * 0.35
        }
        else{
            player2Score += 1 //must be before reset
            ballReset()
        }
    }
    if(ballX > canvas.width){
        if(ballY > paddle2Y && ballY < paddle2Y + paddle_height){
            ballSpeedX = -ballSpeedX

            var deltaY = ballY - (paddle2Y + paddle_height / 2)

            ballSpeedY = deltaY * 0.35
        }
        else{
            player1Score += 1
            ballReset()
        }
    }

    
    if(ballY < 0){
        ballSpeedY = - ballSpeedY
    }
    if(ballY > canvas.height){
        ballSpeedY = -ballSpeedY
    }
}

function drawNet(){
    for(var i = 0; i < canvas.height; i += 40){
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white')
    }
}

function drawEverything(){
    // next line blanks out the screen with black
    colorRect(0,0,canvas.width,canvas.height,'black');
    
    if(showWinningScreen){
        canvasContext.fillStyle = 'white'

        if(player1Score >= winning_score){
            canvasContext.fillText("Left Player Won!!", 350, 200)
        }

        else{
            canvasContext.fillText("Right Player Won!!", 350, 200)
        }
        canvasContext.fillText("Click to continue", 350, 500)
        return
    }

    // creates the black canvas
    colorRect(0, 0, canvas.width, canvas.height, 'black')

    drawNet()

    //left player paddle
    colorRect(0, paddle1Y, paddle_thickness, paddle_height, 'white')

    //right computer paddle
    colorRect(canvas.width - paddle_thickness, paddle2Y, paddle_thickness, paddle_height, 'white')

    //draws the ball
    colorCircle(ballX, ballY, 10, 'white')

    canvasContext.fillText(player1Score, 100, 100)
    canvasContext.fillText(player2Score, canvas.width - 100, 100)
}

function colorCircle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor
    canvasContext.beginPath()
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true)
    canvasContext.fill()
}

function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor
    canvasContext.fillRect(leftX, topY, width, height)
}