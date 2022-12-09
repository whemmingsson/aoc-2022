const rows = require("../util/loader.js").getStrings("data");
console.log(rows.length);

// Store values as x,y -> true
const visited = {};
const SQRT_OF_TWO = Math.sqrt(2);

const visit = (x, y) => {
  const p = `${x},${y}`;
  if (!visited[p]) visited[p] = true;
};

const follow = () => {
  tail.x = headPrev.x;
  tail.y = headPrev.y;
  visit(tail.x, tail.y);
};

const head = { x: 5, y: 5 };
const headPrev = { x: 5, y: 5 };
const tail = { x: 5, y: 5 };

updatePrev = () => {
  headPrev.x = head.x;
  headPrev.y = head.y;
};

const moveRight = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    head.x += 1;

    if (shouldFollow()) {
      follow();
    }
  }
};

const moveLeft = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    head.x -= 1;

    if (shouldFollow()) {
      follow();
    }
  }
};

const moveUp = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    head.y -= 1;

    if (shouldFollow()) {
      follow();
    }
  }
};

const moveDown = (steps) => {
  for (let i = 0; i < steps; i++) {
    updatePrev();
    head.y += 1;

    if (shouldFollow()) {
      follow();
    }
  }
};

const distance = () => {
  const xDiff = Math.abs(head.x - tail.x);
  const yDiff = Math.abs(head.y - tail.y);
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

const shouldFollow = () => {
  return distance() > SQRT_OF_TWO;
};

const map = {
  R: moveRight,
  L: moveLeft,
  U: moveUp,
  D: moveDown,
};

visit(5, 5);
for (let instruction of rows) {
  const parts = instruction.split(" ");
  const direction = parts[0];
  const steps = parseInt(parts[1]);
  //console.log(direction, steps, map[direction].name);
  map[direction](steps);
}

//console.log(visited);
console.log("Part 1: ", Object.entries(visited).length);
