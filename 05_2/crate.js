class Crate {
    constructor(value, x, y) {
        this.value = value;

        this.x = x;
        this.y = y;


        // All for the animation
        this.isMoving = false;
        this.moveToX = null;
        this.moveToY = null;
        this.reachedMaxHeigh = false;
    }

    render(y) {
        if (this.isMoving) this.move();

        rect(this.x, this.y, CRATE_SIZE, CRATE_SIZE);
    }

    startMove(toX, toY) {
        this.isMoving = true;
        this.toX = toX;
        this.toY = toY;
    }

    move() {
        // Update
        // Move the stack up to max height * CRATE_SIZE
        if (this.y > height - (maxHeight + 1) * CRATE_SIZE && !this.reachedMaxHeigh) {
            this.y -= Y_SPEED;
        }
        else {
            this.reachedMaxHeight = true;
        }


    }
}