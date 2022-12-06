const rows = require("../util/loader.js").getStrings("data");
const stream = rows[0].split("");

console.log(stream);

const isProperMarker = (marker) => {
  const set = new Set(marker);
  return set.size === 14;
};

let currentMarker = [];
let markerPos = -1;
for (let i = 0; i < stream.length; i++) {
  let c = stream[i];

  if (currentMarker.length < 14) {
    currentMarker.push(c);
  } else if (currentMarker.length === 14) {
    currentMarker = currentMarker.slice(1);
    currentMarker.push(c);
    const valid = isProperMarker(currentMarker);
    if (valid) {
      markerPos = i + 1;
      break;
    }
  }
}

console.log("Part 2", currentMarker, markerPos);
