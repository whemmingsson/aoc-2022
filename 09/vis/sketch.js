const rows = ["R 5", "U 8", "L 8", "D 3", "R 17", "D 10", "L 25", "U 20"];

class Knot {
  constructor(id) {
    this.id = id;
    this.current = { x: width / 2, y: height / 2 };
    this.prev = { x: width / 2, y: height / 2 };
  }

  advance() {
    this.prev.x = this.current.x;
    this.prev.y = this.current.y;
  }
}

const SIZE = 20;
const drawKnots = () => {
  /*background(20);
  for (let i = knots.length - 1; i >= 0; i--) {
    const knot = knots[i];

    console.log("Drawing knot at", knot.current);
    fill(255);
    rect(knot.current.x, knot.current.y, SIZE, SIZE);
  } */
  fill(255);
  rect(knots[knots.length - 1].current.x, knots[knots.length - 1].current.y, SIZE, SIZE);
};

// Store values as x,y -> true
const visited = {};
const SQRT_OF_TWO = Math.sqrt(2);
const knots = [];

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
    drawKnots();
  }

  visit(knots[knots.length - 1].current.x, knots[knots.length - 1].current.y);
};

const visit = (x, y) => {
  const p = `${x},${y}`;
  if (!visited[p]) visited[p] = true;
};

const follow = (h, t) => {
  t.current.x = h.prev.x;
  t.current.y = h.prev.y;
};

const distance = (a, b) => {
  const xDiff = Math.abs(a.current.x - b.current.x);
  const yDiff = Math.abs(a.current.y - b.current.y);
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

const shouldFollow = (h, t) => {
  return distance(h, t) > SQRT_OF_TWO * SIZE;
};

const moveRight = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    knots[0].current.x += SIZE;
    followLogic();
  }
};

const moveLeft = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    knots[0].current.x -= SIZE;
    followLogic();
  }
};

const moveUp = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    knots[0].current.y -= SIZE;
    followLogic();
  }
};

const moveDown = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    knots[0].current.y += SIZE;
    followLogic();
  }
};

const map = {
  R: moveRight,
  L: moveLeft,
  U: moveUp,
  D: moveDown,
};

function setup() {
  createCanvas(1000, 1000);
  colorMode(HSB);
  frameRate(1);

  background(20);

  for (let i = 0; i < 10; i++) {
    knots.push(new Knot(i == 0 ? "H" : i + ""));
  }

  console.log(knots);
}

let currentInstruction = 0;
function draw() {
  let instruction = rows[currentInstruction];
  const parts = instruction.split(" ");
  const direction = parts[0];
  const steps = parseInt(parts[1]);
  map[direction](steps);

  currentInstruction++;

  if (currentInstruction === rows.length) {
    console.log(visited);
    console.log(knots[knots.length - 1]);
    console.log("Part 1: ", Object.entries(visited).length);
    noLoop();
  }
}
