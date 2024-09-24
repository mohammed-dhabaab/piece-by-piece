import Ball from "./Ball"
import Paddle from "./Paddle"
import Brick from "./Brick"
import BrickWall from "./BrickWall"
import Settings from "./settings"
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
    if (localStorage.getItem("allowance") === "true") {
        updateUserBestScore()
    }
    gameOverPopupContainer.classList.remove("none")
}

function displayWonMessage() {
    if (brickWall.bricks.every(brick => brick.status === 0)) {
        if (localStorage.getItem("allowance") === "true") {
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
    if (localStorage.getItem("allowance") === "false") {
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
        secondPlaceBestScore.innerText = topThreeUsers[0].bestScore
        thirdPlaceTitle.innerText = topThreeUsers[2].username
        thirdPlaceBestScore.innerText = topThreeUsers[0].bestScore


    } catch (error) {
        console.error("Error updating user on server:", error);
    }
}

setTopThreePlaces()