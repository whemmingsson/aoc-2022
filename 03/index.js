const rows = require("../util/loader.js").getStrings("data").map((r) => r.trim());

// Part 1
const prioOf = (item) => {
    return item.charCodeAt(0) - (item.toUpperCase() === item ? 38 : 96);
}

const findCommon = (c1, c2) => {
    return c1.split("").filter(x => c2.split("").includes(x))[0];
}

console.log("Part 1:",
    rows.reduce((p, c) => (p + prioOf(findCommon(c.substr(0, c.length / 2), c.substr(c.length / 2)))), 0));


// Part 2
const findCommonThree = (c1, c2, c3) => {
    return c1.split("").filter(x => c2.split("").includes(x) && c3.split("").includes(x))[0];
}

sum = 0;
for (let i = 0; i < rows.length; i += 3) {
    sum += prioOf(findCommonThree(rows[i], rows[i + 1], rows[i + 2]));
}

console.log("Part 2", sum);