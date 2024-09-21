import Ball from "./Ball"
import Paddle from "./Paddle"
import Brick from "./Brick"
import Settings from "./settings"


const settings = new Settings()
const board = document.getElementById("board")
board.width = settings.boardWidth
board.height = settings.boardHeight
const context = board.getContext("2d")

const ball = new Ball(settings.ball.positionX, settings.ball.positionY, settings.ball.radius, settings.ball.speedX, settings.ball.speedY, settings.ball.color)
const paddle = new Paddle(settings.paddle.positionX, settings.paddle.positionY, settings.paddle.width, settings.paddle.height, settings.paddle.radius, settings.paddle.speedX, settings.paddle.color)
paddle.activateArrowsMovements(board)




// const bricks = []

function createBrickWall() {
    const brickRowCount = 4
    const brickColumnCount = 10
    const brickWidth = 50
    const brickHeight = 20
    const brickMargin = 5
    const brickBorderRadius = 4

    for (let col = 0; col < brickColumnCount; col++) {
        for (let row = 0; row < brickRowCount; row++) {
            const brickX = (col * (brickWidth + brickMargin)) + brickMargin
            const brickY = (row * (brickHeight + brickMargin)) + brickMargin
            settings.bricks.push(new Brick(brickX, brickY, brickWidth, brickHeight, brickBorderRadius, settings.brick.color))
        }
    }
}

function drawBricks() {
    settings.bricks.forEach(brick => {
        if (brick.status === 1) {
            brick.draw(context)

            // Destroy on hit by ball
            if (ball.x > brick.x && ball.x < brick.x + brick.width &&
                ball.y > brick.y && ball.y < brick.y + brick.height
            ) {
                ball.speedY = -ball.speedY
                brick.status = 0
            }
        }
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
        alert("Game over! You Lost!");
        settings.resetGame(ball, settings.bricks);
        gameStarted = false;
    }

    drawBricks();

    // Looping
    if (gameStarted) {
        requestAnimationFrame(gameLoop);

    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === ' ' || event.code === 'Space') {
        startGame();
        event.preventDefault(); // Prevent default action if needed  
    }
});

board.addEventListener('touchstart', function (event) {
    startGame();
});