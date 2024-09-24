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

export default Ball;