const rows = require("../util/loader.js").getStrings("data").map((r) => r.trim());

const isSubsetOf = (a, b) => {
    return (b.f >= a.f && b.t <= a.t)
}

const overlaps = (a, b) => {
    return b.f <= a.t && a.f <= b.t;
}

const createRange = (r) => {
    const parts = r.split("-");
    return { f: parseInt(parts[0]), t: parseInt(parts[1]) };
}

let countP1 = 0;
let countP2 = 0;
for (let pair of rows) {
    const ranges = pair.split(",");
    const r1 = createRange(ranges[0]);
    const r2 = createRange(ranges[1]);
    countP1 += isSubsetOf(r1, r2) || isSubsetOf(r2, r1) ? 1 : 0;
    countP2 += overlaps(r1, r2) ? 1 : 0;
}

console.log("Part 1", countP1);
console.log("Part 2", countP2);