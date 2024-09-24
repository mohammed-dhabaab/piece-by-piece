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

export default Settings