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

        this.mainRadius = 10

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
            radius: this.mainRadius,
            speedX: 5,
            color: "blue",
        };

        // Brick settings
        this.brick = {
            width: 100,
            height: 20,
            radius: this.mainRadius,
            color: "blue",
            status: 1, //1: Alive, 0: Destroyed
        };

        this.brickWall = {
            bricksRowCount: 5,
            bricksColCount: 10,
            brickWidth: 50,
            brickHeight: 20,
            brickRadius: this.mainRadius,
            brickMargin: 4,
            brickColor: "blue",
        }

        this.bricks = []

        // Additional settings
        this.lives = 3; // Number of lives
        this.level = 1; // Current level
        this.score = 0; // Player score
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
        this.ball.radius = Math.max(5, this.boardWidth * 0.02); // Responsive ball size
        this.paddle.width = Math.max(70, this.boardWidth * 0.15); // Responsive paddle width
        this.paddle.height = Math.max(10, this.boardHeight * 0.025); // Responsive paddle height


        // Update ball and paddle positions based on new dimensions
        this.ball.positionX = this.boardWidth / 2;
        this.ball.positionY = this.boardHeight / 2;
        this.paddle.positionX = (this.boardWidth - this.paddle.width) / 2;
        this.paddle.positionY = this.boardHeight - this.paddle.height - 10; // Adjust for padding
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