
const rows = require("../util/loader.js").getStrings("data").map(r => r.trim());

const SIGNAL_START_AT = 20;
const SIGNAL_INTERVAL = 40;

let register = 1;
let cycle = 1;
const memory = {};

const CRT_WIDTH = 40;
const CRT_HEIGHT = 6;
const CRT_flat = [];

const addToMemory = (resolveAt, value) => {
    memory[resolveAt] = value;
}

const resolveAt = (cycle) => {
    if (!memory[cycle]) return; // Nothing to resolve
    register += memory[cycle]; // Increase / decrease value of register
}

const getLastCycleFromMemory = () => {
    const keys = Object.keys(memory).map(m => parseInt(m));
    if (!keys.length) return 0;
    return Math.max(...keys);
}

for (let i = 0; i < rows.length; i++) {
    const parts = rows[i].split(" ");
    const lastCycleEnd = getLastCycleFromMemory();
    if (parts[0] === "noop") {
        addToMemory(lastCycleEnd + 1, 0);
    }
    else {
        addToMemory(lastCycleEnd + 2, parseInt(parts[1]));
    }
}

drawCRT = () => {
    for (let i = 0; i < CRT_HEIGHT; i++) {
        console.log(CRT_flat.slice(i * CRT_WIDTH, i * CRT_WIDTH + CRT_WIDTH).join(""));
    }
}

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
    if (cycle === SIGNAL_START_AT || (cycle - SIGNAL_START_AT) % SIGNAL_INTERVAL === 0) {
        signalSum += cycle * register;
    }

    drawPixel(cycle);
    resolveAt(cycle);
    cycle++;

} while (cycle <= getLastCycleFromMemory())

console.log("Part 1:", signalSum);
console.log("Part 2:");
drawCRT();
