const Stack = require("./Stack");
const rows = require("../util/loader.js").getStrings("data");
const config = require("../util/loader.js").getStrings("data_config");

const instructions = rows.slice(rows.indexOf("") + 1);

const stacks = [];
for (let cfg of config) {
  const s = new Stack();
  let crates = cfg.split("");
  for (let c of crates) {
    s.push(c);
  }
  stacks.push(s);
}

for (let ins of instructions) {
  const parts = ins
    .split(" ")
    .map((i) => parseInt(i))
    .filter((i) => !isNaN(i));
  console.log(parts);
  const count = parts[0];
  const from = parts[1];
  const to = parts[2];

  const sFrom = stacks[from - 1];
  const sTo = stacks[to - 1];

  // Part 1
  /*for (let i = 0; i < count; i++) {
    let c = sFrom.pop();
    sTo.push(c);
  } */

  // Part 2
  let cratesToMove = [];
  for (let i = 0; i < count; i++) {
    cratesToMove.push(sFrom.pop());
  }
  cratesToMove.reverse();
  for (let c of cratesToMove) {
    sTo.push(c);
  }
}

let topCrates = stacks.map((s) => s.peek()).join("");
console.log(topCrates);
