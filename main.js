const BALL_RADIUS = 10
const BALL_COLOR = "red"
const BALL_DEFAULT_X = 400
const BALL_DEFAULT_Y = 300
const PADDLE_COLOR = "#0095DD"
const BRICK_COLOR = "#0095DD"
const TEXT_COLOR = "darkyellow"
const KEY_CODE_LEFT1 = "ArrowLeft"
const KEY_CODE_RIGHT1 = "ArrowRight"
const KEY_CODE_LEFT2 = "KeyA"
const KEY_CODE_RIGHT2 = "KeyD"

const canvas = document.querySelector("#gameWindow")
const ctx = canvas.getContext("2d")

let score = 0
let lives = 3
let ballX = BALL_DEFAULT_X
let ballY = BALL_DEFAULT_Y
let ballDeltaX = 4
let ballDeltaY = 4
let paddleHeight = 10
let paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2
let paddleSpeed = 14
let leftPressed = false
let rightPressed = false
let brickRowCount = 3
let brickColumnCount = 7
let brickWidth = 75
let brickHeight = 20
let brickPadding = 10
let brickOffsetTop = 30
let brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding))) / 2
let scoreOffsetTop = 8
let scoreOffsetLeft = 20
let livesOffsetTop = canvas.width - 80
let livesOffsetLeft = 20

const bricks = []


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


function drawBall(x, y) {
    ctx.beginPath()
    ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI)
    ctx.fillStyle = BALL_COLOR
    ctx.fill()
    ctx.closePath()
}


function drawPaddle(x) {
    ctx.beginPath()
    ctx.rect(x, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = PADDLE_COLOR
    ctx.fill()
    ctx.closePath()
}


function drawBricks() {
    for (let i = 0; i < brickRowCount; i++) {
        for (let j = 0; j < brickColumnCount; j++) {
            const brick = bricks[i][j]

            if (brick.broken) {
                continue
            }

            brick.x = brickOffsetLeft + (j * (brickWidth + brickPadding))
            brick.y = brickOffsetTop + (i * (brickWidth + brickPadding))

            ctx.beginPath()
            ctx.rect(brick.x, brick.y, brickWidth, brickHeight)
            ctx.fillStyle = BRICK_COLOR
            ctx.fill()
            ctx.closePath()
        }
    }
}


function drawScore() {
    ctx.font = "16px Consolas"
    ctx.fillStyle = TEXT_COLOR
    ctx.fillText(`Score: ${score}`, scoreOffsetTop, scoreOffsetLeft)
}

function drawLives() {
    ctx.font = "16px Consolas"
    ctx.fillStyle = TEXT_COLOR
    ctx.fillText(`Lives: ${lives}`, livesOffsetTop, livesOffsetLeft)
}


function detectBrickCollision() {
    for (let i = 0; i < brickRowCount; i++) {
        for (let j = 0; j < brickColumnCount; j++) {
            const brick = bricks[i][j]

            if (
                !brick.broken
                && ballX > brick.x
                && ballX < brick.x + brickWidth
                && ballY > brick.y
                && ballY < brick.y + brickHeight
            ) {
                return brick
            }
        }
    }

    return null
}


function nextTick() {
    const brick = detectBrickCollision()

    if (brick !== null) {
        ballDeltaY = -ballDeltaY
        brick.broken = true
        score++

        if (score === brickRowCount * brickColumnCount) {
            alert(`GG WP! Score: ${score}. Reload the page.`)
        }
    }

    if (ballY + ballDeltaY < BALL_RADIUS) {
        ballDeltaY = -ballDeltaY
    } else if (ballY + ballDeltaY > canvas.height - BALL_RADIUS) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDeltaY = -ballDeltaY
        } else if (lives > 1) {
            lives--
            ballX = BALL_DEFAULT_X
            ballY = BALL_DEFAULT_Y
        } else {
            alert("Game Over! Reload the page.")
        }
    }

    if (ballX + ballDeltaX < BALL_RADIUS || ballX + ballDeltaX > canvas.width - BALL_RADIUS) {
        ballDeltaX = -ballDeltaX
    }

    if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed
    }

    ballX += ballDeltaX
    ballY += ballDeltaY
}


function draw() {
    clearCanvas()

    drawScore()
    drawLives()

    drawBricks()
    drawBall(ballX, ballY)
    drawPaddle(paddleX)

    nextTick()
    requestAnimationFrame(draw)
}


// *** Init ***


document.body.onkeydown = (event) => {
    if (event.code === KEY_CODE_LEFT1) {
        leftPressed = true
    }

    if (event.code === KEY_CODE_RIGHT1) {
        rightPressed = true
    }
}


document.body.onkeyup = (event) => {
    if (event.code === KEY_CODE_LEFT1) {
        leftPressed = false
    }

    if (event.code === KEY_CODE_RIGHT1) {
        rightPressed = false
    }
}


document.body.onkeydown = (event) => {
    if (event.code === KEY_CODE_LEFT2) {
        leftPressed = true
    }

    if (event.code === KEY_CODE_RIGHT2) {
        rightPressed = true
    }
}


document.body.onkeyup = (event) => {
    if (event.code === KEY_CODE_LEFT2) {
        leftPressed = false
    }

    if (event.code === KEY_CODE_RIGHT2) {
        rightPressed = false
    }
}


// document.body.onmousemove = (event) => {
//     const canvasRelativeX = event.clientX - canvas.offsetLeft
//     if (canvasRelativeX > 0 && canvasRelativeX < canvas.width) {
//         paddleX = canvasRelativeX - paddleWidth / 2
//     }
// }


for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = []
    for (let j = 0; j < brickColumnCount; j++) {
        bricks[i][j] = { x: 0, y: 0, broken: false }
    }
}


draw()
