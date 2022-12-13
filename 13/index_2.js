const rows = require("../util/loader.js").getStrings("data").map(r => r.trim());
const DEBUG = false;
const parseFn = JSON.parse;
const packets = [];
for (let i = 0; i < rows.length - 1; i++) {
    if (rows[i] === "" || rows[i + 1] === "") {
        continue;
    }
    packets.push({ left: parseFn(rows[i]), right: parseFn(rows[i + 1]) });
}

const log = (str, ...params) => {
    if (DEBUG) {
        console.log(str, ...params);
    }
}

const isList = (e) => {
    return Array.isArray(e);
}

const isValue = (e) => {
    return !isList(e) && e !== undefined;
}

const areBothValues = (l, r) => {
    return !isList(l) && !isList(r);
}

const areBothLists = (l, r) => {
    return isList(l) && isList(r);
}

const areInOrder = (l, r, tab) => {
    log(tab + "-- Comparing (l,r)", l, r);

    // One is list and other is value
    if (isList(l) && isValue(r)) {
        // Right is value, convert it to list
        log(tab + "   right: " + r + " is value, convert to list");
        let nR = [];
        nR.push(r);
        r = nR;
    }
    else if (isList(r) && isValue(l)) {
        // Left is value, convert it to list
        log(tab + "   left: " + l + " is value, convert to list");
        let nL = [];
        nL.push(l);
        l = nL;
    }

    if (l === undefined) {
        log(tab + "  left ran out of values (in order)");
        return true;
    }
    else if (r === undefined) {
        log(tab + "  right ran out of values (NOT in order)");
        return false;
    }

    if (areBothValues(l, r)) {
        log(tab + "   Both are values", l, r);
        if (l > r) {
            return false;
        }
        else if (l < r) {
            return true;
        }
        else {
            log(tab + "   l:" + l + "=" + "r:" + r);
            return "equal";
        }
    }

    if (areBothLists(l, r)) {
        log(tab + "   Both l and r are lists");
        let m = Math.max(l.length, r.length);
        for (let i = 0; i < m; i++) {
            let e = areInOrder(l[i], r[i], tab + "  ");
            if (e === "equal") {
                continue;
            }
            else {
                return e;
            }
        }
        return true;
    }
}

let indicies = [];
packets.forEach((pp, idx) => {
    const left = pp.left;
    const right = pp.right;
    const inOrder = areInOrder(left, right, "   ");
    console.log("Pair ", (idx + 1), inOrder ? " are in order" : " are NOT in order");
    if (inOrder) {
        indicies.push(idx + 1);
    }
});

console.log(indicies);
console.log("Part 1:", indicies.reduce((a, b) => a + b, 0))


