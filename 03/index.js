const rows = require("../util/loader.js").getStrings("data").map((r) => r.trim());

// Part 1
const isUpperCase = (item) => {
    return item.toUpperCase() === item;
}

const prioOf = (item) => {
    const ascii = item.charCodeAt(0);
    if (isUpperCase(item)) {
        return ascii - 38;
    }
    return ascii - 96;
}

const findCommon = (c1, c2) => {
    const intersection = c1.split("").filter(x => c2.split("").includes(x));
    return intersection[0];
}

let sum = 0;
for (let i = 0; i < rows.length; i++) {
    const index = rows[i].length / 2;
    var comp1 = rows[i].substr(0, index);
    var comp2 = rows[i].substr(index);

    sum += prioOf(findCommon(comp1, comp2));
}

console.log("Part 1", sum);

// Part 2
const findCommonThree = (c1, c2, c3) => {
    const intersection = c1.split("").filter(x => c2.split("").includes(x) && c3.split("").includes(x));
    return intersection[0];
}

sum = 0;
for (let i = 0; i < rows.length; i += 3) {
    sum += prioOf(findCommonThree(rows[i], rows[i + 1], rows[i + 2]));
}

console.log("Part 2", sum);