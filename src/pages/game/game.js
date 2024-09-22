import Ball from "./Ball"
import Paddle from "./Paddle"
import Brick from "./Brick"
import BrickWall from "./BrickWall"
import Settings from "./settings"


const settings = new Settings()
const board = document.getElementById("board")
board.width = settings.boardWidth
board.height = settings.boardHeight
const context = board.getContext("2d")

const ball = new Ball(settings.ball.positionX, settings.ball.positionY, settings.ball.radius, settings.ball.speedX, settings.ball.speedY, settings.ball.color)
const paddle = new Paddle(settings.paddle.positionX, settings.paddle.positionY, settings.paddle.width, settings.paddle.height, settings.paddle.radius, settings.paddle.speedX, settings.paddle.color)
const brick = new Brick()
const brickWall = new BrickWall(settings.brickWall.rowNum, settings.brickWall.colNum, settings.brickWall.topOffSet, settings.brickWall.rowGap, settings.brickWall.colGap, settings.brickWall.bricksColors)
paddle.activateArrowsMovements(board)



function createBrickWall() {
    for (let col = 0; col < brickWall.colNum; col++) {
        for (let row = 0; row < brickWall.rowNum; row++) {
            let brickX = 0
            let brickY = 0
            if (row == 0) {
                brickX = (col * (settings.brick.width + settings.brickWall.rowGap)) + brickWall.rowGap
                brickY = (row * (settings.brick.height + settings.brickWall.topOffSet)) + brickWall.topOffSet
            } else {
                brickX = (col * (settings.brick.width + settings.brickWall.rowGap)) + brickWall.rowGap
                brickY = (row * (settings.brick.height + settings.brickWall.colGap)) + brickWall.topOffSet
            }
            brickWall.bricks.push(new Brick(brickX, brickY, settings.brick.width, settings.brick.height, settings.brick.radius, brickWall.bricksColors[row % brickWall.bricksColors.length]))
        }
    }
}

function drawBricks() {
    brickWall.bricks.forEach(brick => {
        if (brick.status === 1) {
            brick.draw(context)

            // Destroy on hit by ball
            if (ball.x > brick.x && ball.x < brick.x + brick.width &&
                ball.y > brick.y && ball.y < brick.y + brick.height
            ) {
                ball.speedY = -ball.speedY
                brick.status = 0
                settings.scoresCounter += 20
                updateScoresCounter()
            }
        }
    })
}

const scoresCounter = document.querySelectorAll(".scores-counter")

function updateScoresCounter() {
    scoresCounter.forEach(counter => {
        counter.innerText = settings.scoresCounter
    })
}

createBrickWall()


context.clearRect(0, 0, board.clientWidth, board.clientHeight)

ball.update()
ball.draw(context)
paddle.draw(context)
drawBricks()

let gameStarted = false;
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameLoop();
    }
}

function gameLoop() {


    context.clearRect(0, 0, board.clientWidth, board.clientHeight);

    ball.update();
    ball.draw(context);
    paddle.draw(context);

    ball.collisionDetection(paddle, board);



    if (ball.y + ball.radius > board.height) {
        displayLoseMessage()
        settings.resetGame(ball, paddle, brickWall.bricks);
        gameStarted = false;
    }

    drawBricks();

    // displayWonMessage()

    // Looping
    if (gameStarted) {
        requestAnimationFrame(gameLoop);

    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === ' ' || event.code === 'Space') {
        startGame();
        event.preventDefault();
    }
});

board.addEventListener('touchstart', function (event) {
    startGame();
});


const gameOverPopupContainer = document.getElementById("game-over-popup-container")
const restartGameButtons = document.querySelectorAll(".restart-game-button")

restartGameButtons.forEach(button => button.addEventListener("click", e => {
    gameOverPopupContainer.classList.add("none")
    settings.scoresCounter = 0
    updateScoresCounter()
    startGame();
    event.preventDefault()
}))

function displayLoseMessage() {
    gameOverPopupContainer.classList.remove("none")
}

function displayWonMessage() {
    if (brickWall.bricks.every(brick => brick.status === 0)) {
        alert("You Won!")
    }
}