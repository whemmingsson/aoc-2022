const instructions = require("../util/loader.js").getStrings("example").map(r => r.trim())[0].split("");
const DEBUG = true;
console.log(instructions);

const SHAFT_WIDTH = 7;
const TARGET_ROCK_COUNT = 2022;
let shaftHeight = 4;

const shaftMap = {};

const collidesWithRockInShaft = (p) => {
    const k = p.x + "_" + p.y;
    return shaftMap[k] !== undefined;
}

const settleRock = (rock) => {
    rock.parts.forEach(p => {
        const k = p.x + "_" + p.y;
        shaftMap[k] = p;
    });
}

const debug = (msg) => {
    if (DEBUG) {
        console.log(msg);
    }
}

class Rock {
    constructor(rockParts) {
        this.parts = rockParts;
        this.pos = { x: 0, y: 0 };
    }

    clone() {
        // Constructs a deep clone of the current rock
        let pts = [];
        this.parts.forEach(p => {
            pts.push({ x: p.x, y: p.y });
        });

        return new Rock(pts);
    }

    _move(vector) {
        this.parts.forEach(part => {
            part.x += vector.x;
            part.y += vector.y;
        });
    }

    _canMoveLeft() {
        return this.parts.every(p => p.x - 1 >= 0 && !collidesWithRockInShaft(p));
    }

    _canMoveRight() {
        return this.parts.every(p => p.x + 1 < SHAFT_WIDTH && !collidesWithRockInShaft(p));
    }

    _canMoveDown() {
        return this.parts.every(p => p.y + 1 < shaftHeight && !collidesWithRockInShaft(p));
    }

    _moveRight() {
        this._move({ x: 1, y: 0 });
        this.pos.x += 1;
    }

    _moveLeft() {
        this._move({ x: -1, y: 0 });
        this.pos.x -= 1;
    }

    _moveDown() {
        this._move({ x: 0, y: 1 });
        this.pos.y += 1;
    }

    move(direction) {
        if (direction === ">") {
            if (!this._canMoveRight()) {
                return false;
            }
            this._moveRight();
            return true;
        }
        else if (direction === "<") {
            if (!this._canMoveLeft()) {
                return false;
            }
            this._moveLeft();
            return true;
        }
    }

    drop() {
        if (!this._canMoveDown()) {
            return false;
        }

        this._moveDown();
        return true;
    }

    draw() {
        const hasRockPartAt = (x, y) => {
            return this.parts.filter((part) => part.x === x && part.y === y).length > 0;
        }

        for (let y = 0; y < 4; y++) {
            let lineToDraw = "";
            for (let x = 0; x < 4; x++) {
                lineToDraw += hasRockPartAt(x, y) ? "#" : ".";
            }
            console.log(lineToDraw);
        }
    }
}

// Rock templates
const ROCK_H_LINE = new Rock([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }]);
const ROCK_PLUS = new Rock([{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }]);
const ROCK_L = new Rock([{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 0, y: 2 }, { x: 1, y: 2 }]);
const ROCK_V_LINE = new Rock([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }]);
const ROCK_SQUARE = new Rock([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }]);

let rockTemplates = [ROCK_H_LINE, ROCK_PLUS, ROCK_L, ROCK_V_LINE, ROCK_SQUARE];

rockTemplates.forEach(t => {
    t.draw();
    console.log(" ");
})

// Algorithm
let droppedRocks = 0;
let currentInstruction = 0; // 0-> length of instructions-1
let currentRockType = 0; // 0 -> 4
do {
    let currentRock = rockTemplates[currentRockType].clone();
    do {
        currentRock.move(instructions[currentInstruction]);
        currentRock.drop();
    } while (currentRock._canMoveDown());

    settleRock(currentRock);
    debug("Rock settled");

    currentRockType++;
    currentInstruction++;
    droppedRocks++;

    if (currentRockType === 4) {
        currentRockType = 0;
    }
    if (currentInstruction === instructions.length - 1) {
        currentInstruction = 0;
    }
} while (droppedRocks <= TARGET_ROCK_COUNT);

console.log(shaftMap);