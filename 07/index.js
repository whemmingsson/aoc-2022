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

  // Command
  if (cmdOrOutput[0] === "$") {
    // List input
    if (cmdOrOutput.indexOf("ls") >= 0) {
      console.log("ls");
    }
    // Go back up one step
    else if (cmdOrOutput.indexOf("..") >= 0) {
      console.log("move up");
      currentDir = currentDir.parentDir;
    }
    // Should be change directory eg '$ cd e'
    else {
      console.log("move down");
      const p = cmdOrOutput.split(" ");
      console.log(p);

      currentDir = currentDir.getOrAddSubDir(p[2]);
    }
  }
  // Output
  else {
    console.log("output of operation: ", cmdOrOutput);
    if (cmdOrOutput.indexOf("dir") === 0) {
      // NOOP?
    } else {
      const a = cmdOrOutput.split(" ");
      const fileSize = parseInt(a[0]);
      const name = a[1];
      currentDir.addFile(name, fileSize);
    }
  }
}

let flatList = [];

flatList.push(...root.getDirs());

/*flatList.forEach((d) => {
  console.log(d.name, d.size);
}); */

const sum = flatList
  .map((d) => d.size)
  .filter((s) => s < 100000)
  .reduce((a, b) => a + b, 0);

//console.log(sum);

// PART 2
const TOTAL_SIZE = 70000000;
const REQ_FREE_SPACE = 30000000;

let currentFreeSpace = TOTAL_SIZE - flatList[0].size;
let requiredSpaceToFree = REQ_FREE_SPACE - currentFreeSpace;

console.log(requiredSpaceToFree);

const candidates = flatList.filter((d) => d.size >= requiredSpaceToFree).map((d) => d.size);
console.log(Math.min(...candidates));
