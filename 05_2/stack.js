class Stack {
    constructor(x, y) {
        this.values = [];
        this.x = x;
        this.y = y;
    }

    push(v) {
        this.values.push(new Crate(v, this.x, this.y - CRATE_SIZE - this.values.length * CRATE_SIZE));
    }

    pop() {
        return this.values.pop();
    }

    size() {
        return this.values.length;
    }

    startMove() {
        this.values[this.values.length - 1].startMove();
    }

    render() {
        for (let i = 0; i < this.values.length; i++) {
            this.values[i].render();
        }
    }
}