class Paddle {
    constructor(x, y, width, height, radius, speedX, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.speedX = speedX;
        this.color = color;
    }

    draw(context) {
        context.fillStyle = this.color;
        this.fillRoundedRect(context, this.x, this.y, this.width, this.height, this.radius);
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

    collisionDetection(board) {
        // Horizontal Sides
        if (this.x < 8 || this.x + this.width > board.width - 4) {
            this.speedX = 0
        }
    }

    activateArrowsMovements(board) {
        document.addEventListener("keydown", event => {
            if (event.key === "ArrowLeft" && this.x > 8) {
                this.move(-1)
            } else if (event.key === "ArrowRight" && this.x + this.width < board.width - 4) {
                this.move(1)
            }
        })

        document.addEventListener("keyup", event => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                this.move(0)
            }
        })
    }

    move(direction) {
        this.x += this.speedX * direction;
    }
}

export default Paddle;