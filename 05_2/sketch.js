const CRATE_SIZE = 40;
const MARGIN = 20;
const X_SPEED = 5;
const Y_SPEED = 5;

const stacks = [];

const createStacks = () => {
    for (let i = stacksConfig.length - 1; i >= 0; i--) {
        const c = stacksConfig[i].split("");
        for (let j = 0; j < c.length; j++) {
            if (!stacks[j]) {
                stacks[j] = new Stack(CRATE_SIZE * j + MARGIN, height - MARGIN);
            }

            if (c[j] !== "0") {
                stacks[j].push(c[j]);
            }
        }
    }
    console.log(stacks);
}

let maxHeight = 0;
function setup() {
    createCanvas(500, 700);
    createStacks();
    //frameRate(40);

    maxHeight = Math.max(...stacks.map(s => s.size()));
}

let crateIsMoving = false;

function draw() {
    background(20);
    stacks.forEach(s => s.render());

    if (!crateIsMoving) {
        // Determine which crate should move from where to where
        // For test, just do a random stack, say 1, to stack 8
        stacks[1].startMove();
        crateIsMoving = true;
    }
}
