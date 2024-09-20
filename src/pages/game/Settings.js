class Settings {
    constructor() {
        // Board settings
        this.boardWidth = 480;
        this.boardHeight = 380;

        // Ball settings
        this.ball = {
            positionX: this.boardWidth / 2,
            positionY: this.boardHeight / 2,
            radius: 5,
            speedX: -2,
            speedY: -2,
            color: "blue",
        };

        // Paddle settings
        this.paddle = {
            positionX: (this.boardWidth - 70) / 2,
            positionY: this.boardHeight - 20,
            width: 70,
            height: 10,
            radius: 5,
            speedX: 5,
            color: "blue",
        };

        // Brick settings
        this.brick = {
            width: 100,
            height: 20,
            radius: 5,
            color: "blue",
            status: 1, //1: Alive, 0: Destroyed
        };

        this.bricks = []

        // Additional settings
        this.lives = 3; // Number of lives
        this.level = 1; // Current level
        this.score = 0; // Player score
    }


    resetGame(ball, bricks) {
        ball.x = 200
        ball.y = 200
        ball.speedX = -2
        ball.speedY = -2

        bricks.forEach(brick => {
            brick.status = 1
        })
    }
}

export default Settings