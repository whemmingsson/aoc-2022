const rows = require("../util/loader.js").getStrings("data");
console.log(rows.length);

class Knot {
  constructor() {
    this.current = { x: 0, y: 0 };
    this.prev = { x: 0, y: 0 };
  }

  advance() {
    this.prev.x = this.current.x;
    this.prev.y = this.current.y;
  }
}

// Store values as x,y -> true
const visited = {};
const SQRT_OF_TWO = Math.sqrt(2);

const head = new Knot();
const tail = new Knot();
const middle = new Knot();

const knots = [head, tail];

updatePrev = () => {
  for (let i = 0; i < knots.length - 1; i++) {
    knots[i].advance();
  }
};

const followLogic = () => {
  for (let i = 0; i < knots.length - 1; i++) {
    const h = knots[i];
    const t = knots[i + 1];
    if (shouldFollow(h, t)) {
      follow(h, t);
    }
  }

  visit(knots[knots.length - 1].current.x, knots[knots.length - 1].current.y);
};

const visit = (x, y) => {
  const p = `${x},${y}`;
  if (!visited[p]) visited[p] = true;
};

const follow = (head, tail) => {
  tail.current.x = head.prev.x;
  tail.current.y = head.prev.y;
};

const distance = (a, b) => {
  const xDiff = Math.abs(a.current.x - b.current.x);
  const yDiff = Math.abs(a.current.y - b.current.y);
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

const shouldFollow = (head, tail) => {
  return distance(head, tail) > SQRT_OF_TWO;
};

const moveRight = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    head.current.x += 1;
    followLogic();
  }
};

const moveLeft = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    head.current.x -= 1;
    followLogic();
  }
};

const moveUp = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    head.current.y -= 1;
    followLogic();
  }
};

const moveDown = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    head.current.y += 1;
    followLogic();
  }
};

const map = {
  R: moveRight,
  L: moveLeft,
  U: moveUp,
  D: moveDown,
};

for (let instruction of rows) {
  const parts = instruction.split(" ");
  const direction = parts[0];
  const steps = parseInt(parts[1]);
  //console.log(direction, steps, map[direction].name);
  map[direction](steps);
}

//console.log(visited);
console.log("Part 1: ", Object.entries(visited).length);
