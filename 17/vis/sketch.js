const instructions = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>".split("");

const DEBUG = false;
console.log(instructions);

const SHAFT_WIDTH = 7;

let shaftHeight = 0;

const shaftMap = {};

const collidesWithRockInShaft = (p) => {
  const k = p.x + "_" + p.y;
  //debug("Shaft map at:", k, shaftMap[k]);
  return shaftMap[k] !== undefined;
}

const settleRock = (rock) => {
  const maxY = Math.max(...rock.parts.map(p => p.y));
  rock.parts.forEach(p => {
    if (collidesWithRockInShaft(p)) {
      throw "Uh-oh... p collides with something in the shaft";
    }
    const k = p.x + "_" + p.y;
    shaftMap[k] = { p: p, rock: rock };
  });
  if (maxY >= shaftHeight) {
    shaftHeight = maxY + 1;
  }
}

const debug = (str, ...params) => {
  if (DEBUG) {
    console.log(str, ...params);
  }
}

class Rock {
  constructor(rockParts, height, name) {
    this.parts = rockParts;
    this.height = height;
    this.name = name;
  }

  clone() {
    // Constructs a deep clone of the current rock
    let pts = [];
    this.parts.forEach(p => {
      pts.push({ x: p.x, y: p.y });
    });

    return new Rock(pts, this.height, this.name);
  }

  _move(vector) {
    this.parts.forEach(part => {
      part.x += vector.x;
      part.y += vector.y;
    });
  }

  _canMoveLeft() {
    return this.parts.every(p => p.x - 1 >= 0 && !collidesWithRockInShaft({ y: p.y, x: p.x - 1 }));
  }

  _canMoveRight() {
    return this.parts.every(p => p.x + 1 < SHAFT_WIDTH && !collidesWithRockInShaft({ y: p.y, x: p.x + 1 }));
  }

  _canMoveDown() {
    return this.parts.every(p => p.y - 1 >= 0 && !collidesWithRockInShaft({ y: p.y - 1, x: p.x }));
  }

  _moveRight() {
    this._move({ x: 1, y: 0 });
  }

  _moveLeft() {
    this._move({ x: -1, y: 0 });;
  }

  _moveDown() {
    this._move({ x: 0, y: -1 });
  }

  positionY() {
    this.parts.forEach(p => {
      p.y += (shaftHeight + 3);
    })
  }

  move(direction) {
    if (direction === ">") {
      debug("Trying to move RIGHT");
      if (!this._canMoveRight()) {
        return false;
      }
      this._moveRight();
      return true;
    }
    else if (direction === "<") {
      debug("Trying to move LEFT");
      if (!this._canMoveLeft()) {
        return false;
      }
      this._moveLeft();
      return true;
    }
  }

  drop() {
    debug("Moving DOWN 1 step");
    if (!this._canMoveDown()) {
      debug("CANNOT move DOWN - should settle at current position");
      debug("Current positions:", this.getPartsStr());
      return false;
    }

    this._moveDown();
    return true;
  }

  draw() {
    const hasRockPartAt = (x, y) => {
      return this.parts.filter((part) => part.x === x && part.y === y).length > 0;
    }

    for (let y = 0; y < 7; y++) {
      let lineToDraw = "";
      for (let x = 0; x < 7; x++) {
        lineToDraw += hasRockPartAt(x, y) ? "#" : ".";
      }
      console.log(lineToDraw);
    }
  }

  getPartsStr() {
    return this.parts.map(p => "[" + p.x + "," + p.y + "]").join(",");
  }
}

// Rock templates
const ROCK_H_LINE = new Rock([{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }], 1, "H LINE");
const ROCK_PLUS = new Rock([{ x: 3, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 2 }], 3, "PLUS");
const ROCK_L = new Rock([{ x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 0 }, { x: 3, y: 0 }], 3, "L");
const ROCK_V_LINE = new Rock([{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }], 4, "V LINE");
const ROCK_SQUARE = new Rock([{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 1 }], 2, "SQUARE");

ROCK_L.draw();

let rockTemplates = [ROCK_H_LINE, ROCK_PLUS, ROCK_L, ROCK_V_LINE, ROCK_SQUARE];

// Algorithm
const TARGET_ROCK_COUNT = 2022;

let droppedRocks = 0;
let currentInstruction = 0; // 0-> length of instructions-1
let currentRockType = 0; // 0 -> 4
let renderYOffset = 0;

const dropRock = () => {
  console.log("Dropping rock: ", droppedRocks);
  let currentRock = rockTemplates[currentRockType].clone();
  debug("Selected Rock is: ", currentRock.name);
  debug("  Positions of Rock is: ", currentRock.getPartsStr());
  currentRock.positionY();
  debug("  Positions of Rock is (after re-position): ", currentRock.getPartsStr());
  do {
    debug("");
    currentRock.move(instructions[currentInstruction]);
    debug("After move,positions are now:", currentRock.getPartsStr());

    currentInstruction++;
    if (currentInstruction === instructions.length - 1) {
      currentInstruction = 0;
    }
  } while (currentRock.drop());

  settleRock(currentRock);
  debug("*** Height of shaft is now:", shaftHeight);

  currentRockType++;
  droppedRocks++;

  if (currentRockType === 5) {
    currentRockType = 0;
  }

  if (shaftHeight * size >= height / 2) {

    translate(0, renderYOffset * size * 1.25);
    renderYOffset++;
  }
}


const size = 10;
const colors = { "H LINE": 10, "PLUS": 60, "L": 150, "V LINE": 210, "SQUARE": 250 };
let xOffset = 0;
let yOffset = 0;
function renderShaft() {
  Object.keys(shaftMap).forEach(k => {
    let cell = shaftMap[k].p;
    fill(colors[shaftMap[k].rock.name], 100, 100);
    rect(cell.x * size, height - ((cell.y + 1) * size), size, size);
  });
}


function setup() {
  createCanvas(400, 1000);
  ellipseMode(CENTER);

  colorMode(HSB);
  background(0);

  for (let i = 0; i < 10; i++) {
    dropRock();
  }
}

function draw() {
  background(0);

  dropRock();
  renderShaft();

  if (droppedRocks >= TARGET_ROCK_COUNT) {
    console.log("Done");
    console.log("Height", shaftHeight);
    noLoop();
  }
}

function keyPressed() {
  if (keyCode === 32) {
    dropRock();
  }
}
