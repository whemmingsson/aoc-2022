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
    this.isStart = height === "S";
    this.isEnd = height === "E";
    this.neighbors = [];
    this.parent = null;
  }

  id() {
    return this.x + "_" + this.y;
  }

  setupNeighbors(vectors) {
    vectors.forEach((v) => {
      if (map[this.y + v.y] && map[this.y + v.y][this.x + v.x] && map[this.y + v.y][this.x + v.x].height <= this.height + 1) {
        this.neighbors.push(map[this.y + v.y][this.x + v.x]);
      }
    });
  }

  _heightAsChar() {
    return String.fromCharCode(this.height);
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

const clearParents = () => {
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      map[i][j].parent = null;
    }
  }
};

const getPathLength = () => {
  let parent = target.parent;
  let c = 0;
  while (parent !== null) {
    parent = parent.parent;
    c++;
  }
  return c;
};

// BFS algorithm
const BFS = (root) => {
  const visited = {};
  const q = new Q();
  visited[root.id()] = true;
  q.enq(root);
  while (q.size() > 0) {
    let v = q.deq();
    if (v.id() === target.id()) return v;
    v.neighbors.forEach((w) => {
      if (!visited[w.id()]) {
        visited[w.id()] = true;
        w.parent = v;
        q.enq(w);
      }
    });
  }
};

// Setup map
const map = [];
for (let i = 0; i < rows.length; i++) {
  const mapRow = [];
  for (let j = 0; j < rows[i].length; j++) {
    mapRow.push(new Node(j, i, rows[i][j]));
  }
  map.push(mapRow);
}

// Setup options
const vectors = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];
for (let i = 0; i < rows.length; i++) {
  for (let j = 0; j < rows[i].length; j++) {
    map[i][j].setupNeighbors(vectors);
  }
}

const target = getEndNode();
BFS(getStartNode());
let c = getPathLength();
clearParents();
console.log("Part 1:", c);

// Part 2
const hikeLengths = [];
for (let i = 0; i < rows.length; i++) {
  for (let j = 0; j < rows[i].length; j++) {
    let node = map[i][j];

    if (node._heightAsChar() !== "a") {
      continue;
    }

    BFS(node);
    const c = getPathLength();
    clearParents();
    if (c > 0) hikeLengths.push(c);
  }
}

console.log("Part 2:", Math.min(...hikeLengths));
