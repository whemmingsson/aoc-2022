const rows = require("../util/loader.js").getStrings("example");
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
const knots = [];

for (let i = 0; i < 2; i++) {
  knots.push(new Knot());
}

console.log(knots.length);

const followLogic = () => {
  for (let i = 0; i < knots.length - 1; i++) {
    const h = knots[i];
    const t = knots[i + 1];
    let v = getVector(h.current, t.current);
    console.log(v);
    follow(t, v);
  }

  console.log(" ");

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

const getVector = (h, t) => {
  console.log("HEAD, TAIL", h, t);
  if (h.x === t.x && h.y === t.y) {
    return { x: 0, y: 0 };
  }

  if (h.x === t.x) {
    return { x: 0, y: h.y - t.y };
  }

  if (h.y === t.y) {
    return { x: h.x - t.x, y: 0 };
  }

  console.log("Diagonal");
  return { x: h.x - t.x, y: h.y - t.y };
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
  //console.log(direction, steps, map[direction].name);
  map[direction](steps);
}

//console.log(visited);
console.log(visited);
console.log(knots[knots.length - 1]);
console.log("Part 1: ", Object.entries(visited).length);
