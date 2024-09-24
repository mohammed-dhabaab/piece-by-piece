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

export default Paddle;