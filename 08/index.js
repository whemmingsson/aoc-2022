const rows = require("../util/loader.js").getStrings("data");

const matrix = [];

rows.forEach((r) => {
  matrix.push(r.split("").map((t) => parseInt(t)));
});

// Matrix: ***** first value is row, second value is column *****
const ROWS = matrix.length;
const COLS = matrix[0].length;

const getRow = (r, c, dir) => {
  let row = matrix[r];
  return row.slice(dir === "l" ? 0 : c + 1, dir === "l" ? c : undefined);
};

const getColumn = (c, r, dir) => {
  const col = matrix.map((r) => r[c]);
  return col.slice(dir === "t" ? 0 : r + 1, dir === "t" ? r : undefined);
};

const isVisible = (rIdx, cIdx) => {
  const tree = matrix[rIdx][cIdx];

  const rowRight = getRow(rIdx, cIdx, "r");
  const columnTop = getColumn(cIdx, rIdx, "t");
  const rowLeft = getRow(rIdx, cIdx, "l");
  const columnBottom = getColumn(cIdx, rIdx, "b");

  if (rowRight.filter((r) => r < tree).length === rowRight.length) return true;
  if (columnTop.filter((r) => r < tree).length === columnTop.length) return true;
  if (rowLeft.filter((r) => r < tree).length === rowLeft.length) return true;
  if (columnBottom.filter((r) => r < tree).length === columnBottom.length) return true;

  return false;
};

const calcScore = (trees, tree) => {
  let score = 0;
  for (let i = 0; i < trees.length; i++) {
    if (trees[i] < tree) score++;
    else {
      score++;
      break;
    }
  }
  return score;
};

const getScenicScore = (rIdx, cIdx) => {
  const tree = matrix[rIdx][cIdx];

  const rowRight = getRow(rIdx, cIdx, "r");
  const columnTop = getColumn(cIdx, rIdx, "t");
  const rowLeft = getRow(rIdx, cIdx, "l");
  const columnBottom = getColumn(cIdx, rIdx, "b");

  rowLeft.reverse();
  columnTop.reverse();

  return calcScore(rowRight, tree) * calcScore(rowLeft, tree) * calcScore(columnTop, tree) * calcScore(columnBottom, tree);
};

let numVisible = 0;

for (let r = 1; r < ROWS - 1; r++) {
  for (let c = 1; c < COLS - 1; c++) {
    numVisible += isVisible(r, c) ? 1 : 0;
  }
}

const borderCount = ROWS * 2 + COLS * 2 - 4;
console.log("Part 1", numVisible + borderCount);

const scores = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    scores.push(getScenicScore(r, c));
  }
}
console.log("Part 2", Math.max(...scores));
