const rows = require("../util/loader.js").getStrings("example").map(r => r.trim());
const Monkey = require("./monkey");

const DEBUG = false;
const debug = (str, ...params) => {
    if (DEBUG) {
        console.log(str, ...params);
    }
}

const parseOp = (op) => {
    const parts = op.split(" ");
    const operator = parts[3]; // * or +
    const op2 = parts[4]; // Number or "old"

    if (operator === "*" && op2 === "old")
        return (v) => v * v;
    if (operator === "*" && op2 !== "old")
        return (v) => v * parseInt(op2);
    if (operator === "+" && op2 === "old")
        return (v) => v + v;
    if (operator === "+" && op2 !== "old")
        return (v) => v + parseInt(op2);

    throw "Unexpected operation";
}

let divisorProduct = 1;
const setupMonkey = (idx, rowStart) => {
    const items = rows[rowStart].split("Starting items: ")[1].split(", ").map(i => parseInt(i));
    const op = parseOp(rows[rowStart + 1].split("Operation: ")[1]);

    const divisor = parseInt(rows[rowStart + 2].split(" ")[rows[rowStart + 2].split(" ").length - 1]);
    const onTrue = parseInt(rows[rowStart + 3][rows[rowStart + 3].length - 1]);
    const onFalse = parseInt(rows[rowStart + 4][rows[rowStart + 4].length - 1]);

    const test = (v) => v % divisor === 0 ? onTrue : onFalse;

    let m = new Monkey(idx, items, op, test);

    divisorProduct *= divisor;

    monkies.push(m);
}

const monkies = [];
for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (row.indexOf("Monkey") === 0) {
        const idx = parseInt(row[7]);
        debug("New monkey", idx);
        setupMonkey(idx, i + 1);
    }
}

monkies.forEach(m => {
    m.divisorProduct = divisorProduct;
});

console.log(monkies);

const NUM_ROUNDS = 10000;

const logAllItems = () => {
    monkies.forEach(m => m.logItems());
}

const logAllInspectionTimes = (round) => {
    console.log("== After round " + round + " ==")
    monkies.forEach(m => m.logInspections());
}

for (let i = 0; i < NUM_ROUNDS; i++) {
    debug("Round ", i);

    // Do logic
    monkies.forEach(m => {
        debug("MONKEY " + m.id);
        for (let a = 0; a < m.items.length; a++) {
            let throwTo = m.inspect(a);
            debug("Monkey throws item with level " + m.items[a] + " to " + throwTo);
            monkies[throwTo].acceptItem(m.items[a]);
            debug("");
        }
        // Clear up the current monkies items - they are theown away
        m.items = [];
    })

    //logAllItems();
}

const inspectionCounts = monkies.map(m => m.inspectionCount);
inspectionCounts.sort((a, b) => b - a);
const monkeyBusiness = inspectionCounts.slice(0, 2).reduce((a, b) => a * b, 1);
console.log(inspectionCounts);
console.log("Monkey business:", monkeyBusiness);