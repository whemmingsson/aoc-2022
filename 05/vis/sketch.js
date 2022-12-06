const stacks = [];
let distinct = 0;
let colorMap = [];

const CRATE_SIZE = 40;

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function start() {
  loop();
}

function setup() {
  createCanvas(600, 1000);
  colorMode(HSB);

  background(20);
  frameRate(50);
  textAlign(CENTER);
  textSize(CRATE_SIZE / 2);

  const set = new Set();
  let idx = 0;
  for (let cfg of config) {
    const s = new Stack(idx, CRATE_SIZE / 2 + idx * CRATE_SIZE, height - (CRATE_SIZE + CRATE_SIZE / 2));
    for (let c of cfg.split("")) {
      s.push(c);
      set.add(c);
    }
    stacks.push(s);
    idx++;
  }

  distinct = set.size;
  colorMap = [...set];
  console.log(instructions.length);

  stacks.forEach((stack) => {
    stack.draw();
  });

  button = createButton("start");
  button.position(width - 40, height - 20);
  button.mousePressed(start);
  noLoop();
}

let moveStep = 0;
let sFrom = null;
let sTo = null;
let numMoves = 0;
let currentInstruction = 0;
function draw() {
  background(20);
  stacks.forEach((stack) => {
    stack.draw();
  });

  if (moveStep === 0) {
    console.log("At instruction: ", currentInstruction);
    const parts = instructions[currentInstruction]
      .split(" ")
      .map((i) => parseInt(i))
      .filter((i) => !isNaN(i));

    sFrom = stacks[parts[1] - 1];
    sTo = stacks[parts[2] - 1];

    numMoves = parts[0];
  }

  // Part 1
  let c = sFrom.pop();
  sTo.push(c);
  /*sFrom.draw();
  sTo.draw(); */

  moveStep++;

  if (moveStep === numMoves) {
    moveStep = 0;
    currentInstruction++;
  }

  if (currentInstruction >= instructions.length) {
    noLoop();
  }

  renderInfo();
}

function renderInfo() {
  textSize(16);
  textAlign(LEFT);
  fill(255);
  text(`Instruction ${currentInstruction + 1} of ${instructions.length}`, 400, height - 50);
  text(`Move ${moveStep} of ${numMoves}`, 400, height - 25);
  textSize(CRATE_SIZE / 2);
  textAlign(CENTER);
}
