const rows = require("../util/loader.js").getStrings("data");
const stream = rows[0].split("");

const MARKER_SIZE = 4;

let marker = [];
let i = 0;
let valid = false;

do {
  marker.push(stream[i]);
  if (marker.length === MARKER_SIZE + 1) {
    marker.splice(0, 1);
    valid = new Set(marker).size === MARKER_SIZE;
  }
  i++;
} while (!valid);

console.log(i);
