const Stack = require("./Stack");
const rows = require("../util/loader.js").getStrings("data");
const config = require("../util/loader.js").getStrings("data_config");

const instructions = rows.slice(rows.indexOf("") + 1);

const stacks = [];
for (let cfg of config) {
  const s = new Stack();
  for (let c of cfg.split("")) {
    s.push(c);
  }
  stacks.push(s);
}

for (let ins of instructions) {
  const parts = ins
    .split(" ")
    .map((i) => parseInt(i))
    .filter((i) => !isNaN(i));

  const sFrom = stacks[parts[1] - 1];
  const sTo = stacks[parts[2] - 1];

  // Part 1
  /*for (let i = 0; i < parts[0]; i++) {
    let c = sFrom.pop();
    sTo.push(c);
  } */

  // Part 2
  let cratesToMove = [];
  for (let i = 0; i < parts[0]; i++) {
    cratesToMove.push(sFrom.pop());
  }
  cratesToMove.reverse();
  for (let c of cratesToMove) {
    sTo.push(c);
  }
}

let topCrates = stacks.map((s) => s.peek()).join("");
console.log(topCrates);
