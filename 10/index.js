
const rows = require("../util/loader.js").getStrings("data").map(r => r.trim());
const DEBUG = false;
let register = 1;

const memory = {};

const addToMemory = (resolveAt, value) => {
    memory[resolveAt] = value;
}

const resolveAt = (cycle) => {
    if (memory[cycle] === undefined) return; // Nothing to resolve
    debug("Increasing register by:", memory[cycle]);
    register += memory[cycle]; // Increase / decrease value of register
}

isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const debug = (str, ...params) => {
    if (DEBUG) {
        console.log(str, ...params);
    }
}

let cycle = 1;

const SIGNAL_START_AT = 20;
const SIGNAL_INTERVAL = 40;

const getLastCycleFromMemory = () => {
    const keys = Object.keys(memory).map(m => parseInt(m));
    if (!keys.length) return 0;

    return Math.max(...keys);
}

for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    const parts = row.split(" ");
    if (parts[0] === "noop") {
        const lastCycleEnd = getLastCycleFromMemory();
        addToMemory(lastCycleEnd + 1, 0);
    }
    else {
        const value = parseInt(parts[1]);
        const lastCycleEnd = getLastCycleFromMemory();
        addToMemory(lastCycleEnd + 2, value);
    }
}

console.log(memory);

drawCRT = () => {
    for (let i = 0; i < CRT_HEIGHT; i++) {
        console.log(CRT_flat.slice(i * CRT_WIDTH, i * CRT_WIDTH + CRT_WIDTH).join(""));
    }
}

const CRT_WIDTH = 40;
const CRT_HEIGHT = 6;
const CRT_flat = [];

drawCRT();

const drawPixel = (cycle) => {
    let crtCycle = (cycle - 1) % CRT_WIDTH;
    if (register - 1 === crtCycle || register === crtCycle || register + 1 === crtCycle) {
        CRT_flat.push("#");
    }
    else {
        CRT_flat.push(".");
    }
}

let signalSum = 0;
do {

    console.log("Cycle: " + cycle);

    if (cycle === SIGNAL_START_AT) {
        signalSum += cycle * register;
    }
    else if ((cycle - SIGNAL_START_AT) % SIGNAL_INTERVAL === 0) {
        signalSum += cycle * register;
    }

    drawPixel(cycle);
    resolveAt(cycle);
    debug("cycle ends");
    debug("\n");
    cycle++;

} while (cycle <= getLastCycleFromMemory())

console.log("Part 1:", signalSum);
console.log("Part 2");
drawCRT();
