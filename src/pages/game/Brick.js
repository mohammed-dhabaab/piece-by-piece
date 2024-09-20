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

export default Brick;