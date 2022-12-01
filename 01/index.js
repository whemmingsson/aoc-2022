const rows = require("../util/loader.js").getStrings("data");

const elfs = [];
let currentElf = 0;
for (let e of rows) {
  if (e === "") {
    elfs.push(currentElf);
    currentElf = 0;
    continue;
  }
  currentElf += parseInt(e);
}

// Part 1
console.log(Math.max(...elfs));

// Part 2
elfs.sort((a, b) => b - a);
console.log(elfs.slice(0, 3).reduce((p, c) => p + c, 0));
