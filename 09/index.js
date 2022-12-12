const rows = require("../util/loader.js").getStrings("data");

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
const knots = [];

for (let i = 0; i < 10; i++) {
  knots.push(new Knot());
}

const followLogic = () => {
  for (let i = 0; i < knots.length - 1; i++) {
    const h = knots[i];
    const t = knots[i + 1];
    let v = getVector(h.current, t.current);
    follow(t, v);
  }
  visit(knots[knots.length - 1].current.x, knots[knots.length - 1].current.y);
};

const visit = (x, y) => {
  const p = `${x},${y}`;
  if (!visited[p]) visited[p] = true;
};

const follow = (t, v) => {
  t.current.x += v.x;
  t.current.y += v.y;
};

const getManhattanDistance = (a, b) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

const getVector = (h, t) => {
  const distance = getManhattanDistance(h, t);

  if (h.x === t.x && h.y === t.y) {
    return { x: 0, y: 0 };
  }

  if (h.x === t.x && distance === 2) {
    const down = h.y - t.y > 0 ? 1 : -1
    return { x: 0, y: down };
  }

  if (h.y === t.y && distance === 2) {
    const right = h.x - t.x > 0 ? 1 : -1
    return { x: right, y: 0 };
  }

  if (distance >= 3) {
    const right = h.x - t.x > 0 ? 1 : -1
    const down = h.y - t.y > 0 ? 1 : -1
    return { x: right, y: down };
  }

  return { x: 0, y: 0 };
};

const moveRight = (steps) => {
  for (let i = 0; i < steps; i++) {
    knots[0].current.x += 1;
    followLogic();
  }
};

const moveLeft = (steps) => {
  for (let i = 0; i < steps; i++) {
    knots[0].current.x -= 1;
    followLogic();
  }
};

const moveUp = (steps) => {
  for (let i = 0; i < steps; i++) {
    knots[0].current.y -= 1;
    followLogic();
  }
};

const moveDown = (steps) => {
  for (let i = 0; i < steps; i++) {
    knots[0].current.y += 1;
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
  map[direction](steps);
}

console.log("Part 1/2: ", Object.entries(visited).length);