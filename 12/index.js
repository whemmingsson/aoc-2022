const rows = require("../util/loader.js").getStrings("data");

class Node {
  constructor(x, y, height) {
    const getHeight = (h) => {
      if (h === "S") return "a";
      if (h === "E") return "z";
      return h;
    };
    this.x = x;
    this.y = y;
    this.height = getHeight(height).charCodeAt(0);
    this.options = []; // "U", "D", "L", "R"
    this.isStart = height === "S";
    this.isEnd = height === "E";
    this.neighbors = [];
    this.visited = false;
    this.parent = null;
  }

  id() {
    return this.x + "_" + this.y;
  }

  setupOptions() {
    if (map[this.y] && map[this.y][this.x + 1] && map[this.y][this.x + 1].height <= this.height + 1) {
      this.neighbors.push(map[this.y][this.x + 1]);
    }
    if (map[this.y] && map[this.y][this.x - 1] && map[this.y][this.x - 1].height <= this.height + 1) {
      this.neighbors.push(map[this.y][this.x - 1]);
    }
    if (map[this.y - 1] && map[this.y - 1][this.x] && map[this.y - 1][this.x].height <= this.height + 1) {
      this.neighbors.push(map[this.y - 1][this.x]);
    }
    if (map[this.y + 1] && map[this.y + 1][this.x] && map[this.y + 1][this.x].height <= this.height + 1) {
      this.neighbors.push(map[this.y + 1][this.x]);
    }
  }

  _heightAsChar() {
    return String.fromCharCode(this.height);
  }

  print() {
    console.log(`x=${this.x}, y=${this.y}, h=${this._heightAsChar()}`);
    console.log("neighbors: ", this.neighbors.map((n) => n._heightAsChar()).join(","));
  }
}

class Q {
  constructor() {
    this.items = {};
    this.front = 0;
    this.rear = 0;
  }

  enq(item) {
    this.items[this.rear] = item;
    this.rear++;
  }

  deq() {
    const item = this.items[this.front];
    delete this.items[this.front];
    this.front++;
    return item;
  }

  peek() {
    return this.items[this.front];
  }

  size() {
    return this.rear - this.front;
  }
}

const getStartNode = () => {
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (map[i][j].isStart) return map[i][j];
    }
  }
  return null;
};

const getEndNode = () => {
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (map[i][j].isEnd) return map[i][j];
    }
  }
  return null;
};

// Setup map
let map = [];
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];

  const mapRow = [];
  for (let j = 0; j < r.length; j++) {
    const height = r[j];
    const n = new Node(j, i, height);
    mapRow.push(n);
  }
  map.push(mapRow);
}

// Setup options
for (let i = 0; i < rows.length; i++) {
  for (let j = 0; j < rows[i].length; j++) {
    map[i][j].setupOptions();
  }
}

const root = getStartNode();
const target = getEndNode();

const BFS = () => {
  const q = new Q();
  root.visited = true;
  q.enq(root);
  while (q.size() > 0) {
    let v = q.deq();
    if (v.id() === target.id()) return v;
    v.neighbors.forEach((w) => {
      if (!w.visited) {
        w.visited = true;
        w.parent = v;
        q.enq(w);
      }
    });
  }
};

BFS();

let parent = getEndNode().parent;
let c = 0;
while (parent !== null) {
  parent = parent.parent;
  c++;
}

console.log("Part 1:", c);
