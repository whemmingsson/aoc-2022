const rows = require("../util/loader.js").getStrings("example");

class Packet {
  constructor(rawData) {
    this.value = null;
    this.values = []; // Other lists
    this.rawData = rawData;
    this._parseData(rawData);
  }

  _parseData(rawData) {
    if (!rawData) {
      return;
    }
    const stack = [];
    stack.push(this);
    for (let i = 0; i < rawData.length; i++) {
      let c = rawData[i];
      if (c === "[") {
        stack.push(new Packet());
      } else if (c === "]") {
        let x = stack.pop();
        stack[stack.length - 1].values.push(x);
      } else if (c === ",") {
      } else {
        let p = new Packet();
        p.value = parseInt(c);
        stack[stack.length - 1].values.push(p);
      }
    }
  }

  isValue() {
    return this.value !== null;
  }

  isList() {
    return this.values && this.values.length > 0;
  }

  getValueToPrint() {
    if (this.isValue()) return this.value;
    return this._getLine();
  }

  convert() {
    if (this.values && this.values.length > 1) {
      console.log("ERR: Could not convert from list -> value");
      return;
    }

    const p = new Packet();
    p.value = this.value;
    this.values.push(p);
    this.value = null;
    //console.log("Converting value to list", p.value);
  }

  compareWith(right, tab) {
    if (!tab) {
      tab = "";
    }

    const left = this;

    console.log(tab + "Comparing " + left.getValueToPrint() + " vs " + right.getValueToPrint());

    if (left.isList() && right.isValue()) {
      console.log(tab + "Different types. Converting right to [" + right.value + "]");
      right.convert();
      console.log(tab + "Comparing " + left.getValueToPrint() + " vs " + right.getValueToPrint());

      // Retry here?
      //left.compareWith(right, tab + "...");
    } else if (left.isValue() && right.isList()) {
      console.log(tab + "Different types. Converting left");
      left.convert();
      console.log(tab + "Comparing " + left.getValueToPrint() + " vs " + right.getValueToPrint());
      // Retry here?

      //left.compareWith(right, tab + "...");
    }

    if (left.isValue() && right.isValue()) {
      //console.log(tab + "Both are pure values (left, right)", left.value, right.value);
      /* If the left integer is higher than the right integer, the inputs are not in the right order */
      if (left.value > right.value) {
        console.log(tab + "left value is greater than right right, return false");
        return false; // Break recursion
      }
    } else if (left.isList() && right.isList()) {
      const max = Math.max(right.values.length, left.values.length);
      for (let i = 0; i < max; i++) {
        if (!left.values[i]) {
          console.log(tab + "LEFT side ran out");
          return true;
        }
        if (!right.values[i]) {
          console.log(tab + "RIGHT side ran out");
          return false;
        }
        const r = left.values[i].compareWith(right.values[i], tab + " ");
        if (!r) {
          return false;
        }
      }
      return true;
    } else {
      console.log("ERR: invalid comparison");
    }

    return true;
  }

  print(tab) {
    if (!tab) {
      tab = "";
    }
    if (!(this.values && this.values.length > 0)) {
      console.log(tab + this.value);
    } else {
      console.log(tab + "[");
      this.values.forEach((v) => {
        v.print(tab + " ");
      });
      console.log(tab + "]");
    }
  }

  _getLine() {
    if (!(this.values && this.values.length > 0)) {
      return this.value;
    } else {
      let subPackets = "[";
      this.values.forEach((v) => {
        subPackets += v._getLine();
      });
      subPackets += "]";
      return subPackets;
    }
  }

  printLine() {
    console.log(this._getLine());
  }
}

class PacketPair {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  _compare() {
    return this.p1.compareWith(this.p2);
  }

  areInOrder() {
    return this._compare();
  }

  print() {
    console.log("Left: ", this.p1._getLine());
    console.log("Right: ", this.p2._getLine());
  }
}

const packets = [];
for (let i = 0; i < rows.length - 1; i++) {
  if (rows[i] === "" || rows[i + 1] === "") {
    continue;
  }
  const p1 = new Packet(rows[i]);
  const p2 = new Packet(rows[i + 1]);
  const pp = new PacketPair(p1, p2);
  packets.push(pp);
}

//console.log(packets);

//console.log(packets[packets.length - 1].p1.rawData);
//packets[packets.length - 1].p1.printLine();
//packets[0].p2.print();

let indiciesSum = 0;
packets.forEach((pp, i) => {
  console.log("");
  const inOrder = pp.areInOrder();
  console.log("PACKET PAIR " + (i + 1), inOrder);
  indiciesSum += inOrder ? i + 1 : 0;
  console.log("");
});

console.log("Part 1:", indiciesSum);
