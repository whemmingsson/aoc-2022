module.exports = class Monkey {
    constructor(id, items, op, test) {
        this.id = id;
        this.items = items;
        this.operation = op;
        this.test = test;
        this.inspectionCount = 0;
        this.divisorProduct = 1;
    }

    logItems() {
        console.log("Monkey " + this.id + ": ", this.items);
    }

    logInspections() {
        console.log("Monkey " + this.id + ": ", this.inspectionCount);
    }

    inspect(idx) {
        //console.log("Monkey inspects item with level: ", this.items[idx])
        // Increase worry level
        this.items[idx] = this.operation(this.items[idx]);

        //console.log("Level increased to", this.items[idx]);

        // Drops worry level
        //this._part1WorryManagement();
        this._part2WorryManagement(idx);

        //console.log("Level is divided by 3 to", this.items[idx]);

        // Update inspection count
        this.inspectionCount++;

        // Test and return to which monkey this item should be thrown to
        return this.test(this.items[idx]);
    }

    _part1WorryManagement(idx) {
        this.items[idx] /= 3;
        this.items[idx] = Math.floor(this.items[idx]);
    }

    _part2WorryManagement(idx) {
        this.items[idx] = this.items[idx] % this.divisorProduct;
    }

    removeItem(idx) {
        return this.items.splice(idx, 1);
    }

    acceptItem(item) {
        this.items.push(item);
    }
}