const rows = require("../util/loader.js").getStrings("data");
const Directory = require("./Directory");

const root = new Directory("/");
let currentDir = null;
for (let i = 0; i < rows.length; i++) {
  const cmdOrOutput = rows[i];

  if (i === 0) {
    currentDir = root;
    continue;
  }

  if (cmdOrOutput[0] === "$") {
    // Go back up one step
    if (cmdOrOutput.indexOf("..") >= 0) {
      currentDir = currentDir.parentDir;
    }
    // Should be change directory eg '$ cd e'
    else if (cmdOrOutput.indexOf("ls") === -1) {
      currentDir = currentDir.getOrAddSubDir(cmdOrOutput.split(" ")[2]);
    }
  } else {
    if (cmdOrOutput.indexOf("dir") !== 0) {
      const a = cmdOrOutput.split(" ");
      const fileSize = parseInt(a[0]);
      const name = a[1];
      currentDir.addFile(name, fileSize);
    }
  }
}

let flatList = [];

flatList.push(...root.getDirs());
const sum = flatList
  .map((d) => d.size)
  .filter((s) => s < 100000)
  .reduce((a, b) => a + b, 0);

console.log("Part 1:", sum);

// PART 2
const TOTAL_SIZE = 70000000;
const REQ_FREE_SPACE = 30000000;
let currentFreeSpace = TOTAL_SIZE - flatList[0].size;
let requiredSpaceToFree = REQ_FREE_SPACE - currentFreeSpace;
const candidates = flatList.filter((d) => d.size >= requiredSpaceToFree).map((d) => d.size);

console.log("Part 2:", Math.min(...candidates));
