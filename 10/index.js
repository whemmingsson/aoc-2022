
const rows = require("../util/loader.js").getStrings("example_2").map(r => r.trim());
const DEBUG = false;
let register = 1;

const memory = {};
/* memory contains mappings between cycleId and operation value of register
   example: 3 -> [-1] interpret as: at cycle 3 , decrease register by -1
*/

const addToMemory = (resolveAt, value) => {
    /*if (memory[resolveAt]) {
        // We already have an operation resolving at this cycle
        // ASSUME (probably will change in p 2) that we can just manipulate this instruction value
        debug(`     updating memory instruction for cycle ${resolveAt} with value ${value}`);
        memory[resolveAt] += value;
    }
    else { */
    // First time we see an instruction to resolve at this cycle
    //debug(`     setting memory instruction for cycle ${resolveAt} to value ${value}`);
    memory[resolveAt] = value;
    //}
}

const resolveAt = (cycle) => {
    if (!memory[cycle]) return; // Nothing to resolve
    console.log("Increasing register by:", memory[cycle]);
    register += memory[cycle]; // Increase / decrease value of register
    delete memory[cycle]; // Clear up this cycles instructions
}

isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const debug = (str, ...params) => {
    if (DEBUG) {
        console.log(str, ...params);
    }

}

let rowNr = 0;
let cycle = 1;

const SIGNAL_START_AT = 20;
const SIGNAL_INTERVAL = 40;

do {

    debug("Cycle start: ", cycle);
    console.log("Cycle: " + cycle + "  Register:", register);
    console.log(memory);

    if (rowNr < rows.length) {
        //console.log(rows[rowNr]);
        const parts = rows[rowNr].split(" ");
        if (parts[0] === "noop") {
        }
        else {
            const value = parseInt(parts[1]);
            //debug("   Found ADDX value: ", value);
            addToMemory(cycle + 2, value);
        }
    }


    if (cycle === SIGNAL_START_AT) {
        console.log("Signal: (cycle*register)", cycle, register, cycle * register);
    }

    debug("cycle ends");

    debug("\n");

    resolveAt(cycle);

    rowNr++;
    cycle++;

} while (rowNr < rows.length || !isEmpty(memory))

console.log(register);