const rows = require("../util/loader.js").getStrings("data");

// PART 1
let scoreDict = {
  "A X": 3,
  "B Y": 3,
  "C Z": 3,

  "A Y": 6,
  "B Z": 6,
  "C X": 6,

  "A Z": 0,
  "B X": 0,
  "C Y": 0,
};

let selectionDict = {
  X: 1,
  Y: 2,
  Z: 3,
};

let score = 0;
for (const row of rows) {
  score += scoreDict[row] + selectionDict[row[2]];
}

console.log("Part 1", score);

// PART 2
let optionsDict = {
  "A X": "Z",
  "B Y": "Y",
  "C Z": "X",

  "A Y": "X",
  "B Z": "Z",
  "C X": "Y",

  "A Z": "Y",
  "B X": "X",
  "C Y": "Z",
};

const pickOption = (row) => {
  return row[0] + " " + optionsDict[row];
};

score = 0;
for (const row of rows) {
  let pick = pickOption(row);
  score += scoreDict[pick] + selectionDict[pick[2]];
}

console.log("Part 2", score);
