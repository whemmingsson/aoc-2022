class Stack {
  constructor(index, x, y) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.list = [];
  }

  push(e) {
    this.list.push(e);
  }

  pop() {
    return this.list.pop();
  }

  peek() {
    return this.list[this.list.length - 1];
  }

  draw() {
    // Clear the rendered stack
    fill(20);
    stroke(20);
    rect(this.x, 0, CRATE_SIZE, height);
    stroke(0);
    // Draw from the bottom up
    for (let i = 0; i < this.list.length; i++) {
      rect(this.x, this.y - i * CRATE_SIZE, CRATE_SIZE, CRATE_SIZE);
      this.drawCrate(this.x, this.y - i * CRATE_SIZE, this.list[i]);
    }
  }

  drawCrate(x, y, v) {
    let color = map(colorMap.indexOf(v), 0, distinct, 0, 360);
    fill(color, 100, 100);
    rect(x, y, CRATE_SIZE, CRATE_SIZE);
    fill(0);
    text(v, x + CRATE_SIZE / 2, y + CRATE_SIZE * 0.7);
  }
}
