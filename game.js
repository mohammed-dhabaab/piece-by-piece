// import Ball from "./Ball"
// import Paddle from "./Paddle"
// import Brick from "./Brick"
// import BrickWall from "./BrickWall"
// import Settings from "./settings"

class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX
        this.speedY = speedY;
        this.color = color;
    }

    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = this.color;
        context.fill()
        context.closePath()
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }


    collisionDetection(paddle, board) {
        // Horizontal Sides
        if (this.x - this.radius < 0 || this.x + this.radius > board.width) {
            this.speedX = -this.speedX
        }

        // Top Side
        if (this.y - this.radius < 0) {
            this.speedY = -this.speedY
        }

        // Paddle
        if (this.x + this.radius > paddle.x &&
            this.x - this.radius < paddle.x + paddle.width &&
            this.y + this.radius > paddle.y) {
            this.speedY = -this.speedY
        }
    }
}


class Paddle {
    constructor(x, y, width, height, radius, speedX, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.speedX = speedX;
        this.isMoving = false; // Track if the paddle is currently moving
        this.color = color;

        // Bind methods to ensure `this` refers to the instance
        this.moveWithMouse = this.moveWithMouse.bind(this);
        this.moveWithTouch = this.moveWithTouch.bind(this);
    }

    draw(context) {
        context.fillStyle = this.color;
        this.fillRoundedRect(context, this.x, this.y, this.width, this.height, this.radius);
    }

    fillRoundedRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.moveTo(x + radius, y);

        context.lineTo(x + width - radius, y);
        context.arcTo(x + width, y, x + width, y + radius, radius);

        context.lineTo(x + width, y + height - radius);
        context.arcTo(x + width, y + height, x + width - radius, y + height, radius);

        context.lineTo(x + radius, y + height);
        context.arcTo(x, y + height, x, y + height - radius, radius);

        context.lineTo(x, y + radius);
        context.arcTo(x, y, x + radius, y, radius);

        context.closePath();
        context.fill();
    }

    collisionDetection(board) {
        if (this.x < 8 || this.x + this.width > board.width - 4) {
            this.speedX = 0;
        }
    }

    activateArrowsMovements(board) {
        document.addEventListener("keydown", event => {
            if (event.key === "ArrowLeft" && this.x > 8) {
                this.move(-1);
            } else if (event.key === "ArrowRight" && this.x + this.width < board.width - 4) {
                this.move(1);
            }
        });

        document.addEventListener("keyup", event => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                this.move(0);
            }
        });
    }

    move(direction) {
        this.x += this.speedX * direction;
    }

    // Move paddle with mouse
    moveWithMouse(event) {
        const rect = event.target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // Calculate mouse X relative to the canvas

        // Constrain the paddle's position within the canvas
        this.x = Math.max(8, Math.min(mouseX - this.width / 2, rect.width - this.width - 4));
    }

    // Move paddle with touch
    moveWithTouch(event) {
        const touch = event.touches[0];
        const rect = event.target.getBoundingClientRect();
        const touchX = touch.clientX - rect.left; // Calculate touch X relative to the canvas

        // Constrain the paddle's position within the canvas
        this.x = Math.max(8, Math.min(touchX - this.width / 2, rect.width - this.width - 4));
    }

    activateMouseMovement(canvas) {
        canvas.addEventListener("mousemove", this.moveWithMouse);
        canvas.addEventListener("mousedown", () => this.isMoving = true);
        canvas.addEventListener("mouseup", () => this.isMoving = false);
    }

    activateTouchMovement(canvas) {
        canvas.addEventListener("touchmove", this.moveWithTouch);
        canvas.addEventListener("touchstart", () => this.isMoving = true);
        canvas.addEventListener("touchend", () => this.isMoving = false);
    }
}

class BrickWall {
    constructor(rowNum, colNum, topOffSet, rowGap, colGap, bricksColors) {
        this.bricks = []
        this.rowNum = rowNum
        this.colNum = colNum
        this.topOffSet = topOffSet
        this.rowGap = rowGap
        this.colGap = colGap
        this.bricksColors = bricksColors
    }
}

class Brick {
    constructor(x, y, width, height, radius, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.radius = radius
        this.color = color
        this.status = 1 // 1: Draw it, 0: Remove it
    }

    setColor(color) {
        this.color = color;
    }

    draw(context) {
        if (this.status === 1) {
            context.fillStyle = this.color;
            this.fillRoundedRect(context, this.x, this.y, this.width, this.height, this.radius);
        }
    }

    fillRoundedRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.moveTo(x + radius, y); // Move to the starting point

        // Top side
        context.lineTo(x + width - radius, y);
        // Top right corner
        context.arcTo(x + width, y, x + width, y + radius, radius);

        // Right side
        context.lineTo(x + width, y + height - radius);
        // Bottom right corner
        context.arcTo(x + width, y + height, x + width - radius, y + height, radius);

        // Bottom side
        context.lineTo(x + radius, y + height);
        // Bottom left corner
        context.arcTo(x, y + height, x, y + height - radius, radius);

        // Left side
        context.lineTo(x, y + radius);
        // Top left corner
        context.arcTo(x, y, x + radius, y, radius);

        context.closePath(); // Close the path
        context.fill(); // Fill the shape
    }
}

class Settings {
    constructor() {
        this.initSettings();
        this.updateCanvasSize();
        window.addEventListener('resize', () => this.updateCanvasSize());
    }

    initSettings() {
        // Board settings
        this.boardWidth = 480;
        this.boardHeight = 380;

        this.mainRadius = 4

        // Ball settings
        this.ball = {
            positionX: this.boardWidth / 2,
            positionY: this.boardHeight / 2,
            radius: 5,
            speedX: -2,
            speedY: -2,
            color: "white",
        };

        // Paddle settings
        this.paddle = {
            positionX: (this.boardWidth - 70) / 2 + 35,
            positionY: this.boardHeight - 20,
            width: 70,
            height: 10,
            radius: this.mainRadius,
            speedX: 5,
            color: "#058f53",
        };

        // Brick settings
        this.brick = {
            width: this.boardWidth / 12,
            height: 15,
            radius: this.mainRadius,
            color: "blue",
            status: 1, //1: Alive, 0: Destroyed
        };

        this.brickWall = {
            rowNum: 5,
            colNum: 10,
            topOffSet: 60,
            rowGap: 5,
            colGap: 5,
            bricksColors: ["#005430", "#058f53", "white", "#058f53", "#005430"]
            // bricksColors: ["purple", "blue", "green", "black", "pink"]
        }

        this.bricks = []

        // Additional settings
        this.lives = 3; // Number of lives
        this.level = 1; // Current level
        this.scoresCounter = 0; // Player score
    }

    updateCanvasSize() {
        const canvas = document.getElementById("board");
        const wrapper = document.querySelector(".board-container");
        const viewportHeight = window.innerHeight;
        // const vh = (viewportHeight / window.screen.height) * 100;

        // Update board dimensions
        this.boardWidth = wrapper.clientWidth;
        this.boardHeight = viewportHeight - 100; // Maintain aspect ratio (4:3)
        // this.boardHeight = Math.floor(this.boardWidth * (4 / 3)); // Maintain aspect ratio (4:3)

        // Set canvas size
        canvas.width = this.boardWidth;
        canvas.height = this.boardHeight;

        // Update ball and paddle sizes based on new dimensions
        this.ball.radius = Math.max(4, this.boardWidth * 0.01); // Responsive ball size
        this.paddle.width = this.boardWidth * 0.15; // Responsive paddle width
        this.paddle.height = this.boardHeight * 0.014; // Responsive paddle height
        this.paddle.radius = this.boardHeight * 0.007

        // Update ball and paddle positions based on new dimensions
        this.paddle.positionX = (this.boardWidth - this.paddle.width) / 2;
        this.paddle.positionY = this.boardHeight - this.paddle.height - 10; // Adjust for padding
        this.ball.positionX = (this.boardWidth - this.paddle.width) / 2 + (this.paddle.width / 2);
        this.ball.positionY = this.boardHeight - this.paddle.height - 20;

        // Updating paddle and ball speed
        this.paddle.speedX = this.boardWidth * 0.026
        // this.ball.speedX = -(this.boardWidth * 0.02)
        // this.ball.speedY = -(this.boardHeight * 0.02)

        // Updating bricks
        this.brick.width = this.boardWidth * 0.095
        this.brick.height = this.boardHeight * 0.03

        // Updating brick wall
        this.brickWall.topOffSet = this.boardHeight * 0.06
        this.brickWall.rowGap = this.boardWidth * 0.004
        this.brickWall.colGap = this.boardHeight * 0.004
    }


    resetGame(ball, paddle, bricks) {
        ball.x = (this.boardWidth - this.paddle.width) / 2 + (this.paddle.width / 2)
        ball.y = this.boardHeight - this.paddle.height - 20
        ball.speedX = -2
        ball.speedY = -2

        paddle.positionX = (this.boardWidth - this.paddle.width) / 2;
        paddle.positionY = this.boardHeight - this.paddle.height - 10;


        bricks.forEach(brick => {
            brick.status = 1
        })
    }
}



const apiURL = "https://66e87262b17821a9d9dcbf14.mockapi.io/users/signup/"


const settings = new Settings()
const board = document.getElementById("board")
board.width = settings.boardWidth
board.height = settings.boardHeight
const context = board.getContext("2d")

const ball = new Ball(settings.ball.positionX, settings.ball.positionY, settings.ball.radius, settings.ball.speedX, settings.ball.speedY, settings.ball.color)
const paddle = new Paddle(settings.paddle.positionX, settings.paddle.positionY, settings.paddle.width, settings.paddle.height, settings.paddle.radius, settings.paddle.speedX, settings.paddle.color)
const brickWall = new BrickWall(settings.brickWall.rowNum, settings.brickWall.colNum, settings.brickWall.topOffSet, settings.brickWall.rowGap, settings.brickWall.colGap, settings.brickWall.bricksColors)
paddle.activateArrowsMovements(board)
paddle.activateMouseMovement(board)
paddle.activateTouchMovement(board)


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
        counter.innerText = `${settings.scoresCounter}`
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
    updateFlagPosition()

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

    displayWonMessage()

    // Looping
    if (gameStarted) {
        requestAnimationFrame(gameLoop);
    }
}

// document.addEventListener('keydown', function (event) {
//     if (event.key === ' ' || event.code === 'Space') {
//         startGame();
//         event.preventDefault();
//     }
// });

const startTheGamePopup = document.getElementById("start-the-game-popup")
const startTheGameButton = document.getElementById("start-the-game-button")
startTheGameButton.addEventListener('click', function (event) {
    startTheGamePopup.style.display = "none"
    startGame();
    event.preventDefault();

});

// board.addEventListener('touchstart', function (event) {
//     startGame();
// });


const gameOverPopupContainer = document.getElementById("game-over-popup-container")
const wonPopupContainer = document.getElementById("won-popup-container")
const restartGameButtons = document.querySelectorAll(".restart-game-button")

restartGameButtons.forEach(button => button.addEventListener("click", e => {
    gameOverPopupContainer.classList.add("none")
    wonPopupContainer.classList.add("none")
    settings.scoresCounter = 0
    updateScoresCounter()
    startGame();
    e.preventDefault()
}))

function displayLoseMessage() {
    if (localStorage.getItem("allowance1") === "true") {
        updateUserBestScore()
    }
    gameOverPopupContainer.classList.remove("none")
}

function displayWonMessage() {
    if (brickWall.bricks.every(brick => brick.status === 0)) {
        if (localStorage.getItem("allowance1") === "true") {
            updateUserBestScore()
        }
        wonPopupContainer.classList.remove("none")
        // gameStarted = false
    }
}

const bestScoresCounters = document.querySelectorAll(".best-scores-counter")
async function updateUserBestScore() {
    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const users = await response.json();
        const userId = localStorage.getItem("userId");
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            users[userIndex].bestScore = Math.max(users[userIndex].bestScore || 0, settings.scoresCounter);
            displayBestScore(users[userIndex])
            await updateUserOnServer(users[userIndex]);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

async function updateUserOnServer(user) {
    try {
        const response = await fetch(`${apiURL}/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.status}`);
        }

    } catch (error) {
        console.error("Error updating user on server:", error);
    }
}

function displayBestScore(user) {
    bestScoresCounters.forEach(counter => {
        counter.innerText = `${user.bestScore}`
        counter.style.display = "inline- block"
    }
    )
}




const flag = document.querySelector(".flag")
function updateFlagPosition() {
    const totalBricks = brickWall.bricks.length;
    const destroyedBricks = brickWall.bricks.filter(brick => brick.status === 0).length;

    const percentage = Math.max(5, 5 + (destroyedBricks / totalBricks) * (88 - 5));

    flag.style.bottom = `${percentage}%`;
}


const bestScoresCounterContainers = document.querySelectorAll(".best-scores-counter-container")
bestScoresCounterContainers.forEach(counter => {
    if (localStorage.getItem("allowance1") === "false") {
        counter.style.display = "none"
    }
})



// Places

const firstPlaceTitle = document.querySelector(".first-place-title")
const secondPlaceTitle = document.querySelector(".second-place-title")
const thirdPlaceTitle = document.querySelector(".third-place-title")
const firstPlaceBestScore = document.getElementById("first-place-best-score")
const secondPlaceBestScore = document.getElementById("second-place-best-score")
const thirdPlaceBestScore = document.getElementById("third-place-best-score")

async function setTopThreePlaces() {
    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const users = await response.json();

        const topThreeUsers = users
            .filter(user => user.bestScore !== undefined)
            .sort((a, b) => b.bestScore - a.bestScore)
            .slice(0, 3);
        firstPlaceTitle.innerText = topThreeUsers[0].username
        firstPlaceBestScore.innerText = topThreeUsers[0].bestScore

        secondPlaceTitle.innerText = topThreeUsers[1].username
        secondPlaceBestScore.innerText = topThreeUsers[1].bestScore

        thirdPlaceTitle.innerText = topThreeUsers[2].username
        thirdPlaceBestScore.innerText = topThreeUsers[2].bestScore

    } catch (error) {
        console.error("Error updating user on server:", error);
    }
}

setTopThreePlaces()














