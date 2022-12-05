module.exports = class Stack {
  constructor() {
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
};
