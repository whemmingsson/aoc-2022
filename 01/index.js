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

console.log("Part 1 ", Math.max(...elfs));

elfs.sort((a, b) => b - a);
console.log(
  "Part 2 ",
  elfs.slice(0, 3).reduce((p, c) => p + c, 0)
);
