const rows = ["Valve MO has flow rate=0; tunnels lead to valves QM, ED", "Valve JB has flow rate=0; tunnels lead to valves MH, ZU", "Valve BA has flow rate=0; tunnels lead to valves XY, FF", "Valve UW has flow rate=0; tunnels lead to valves EU, SX", "Valve VS has flow rate=0; tunnels lead to valves MH, QW", "Valve IK has flow rate=0; tunnels lead to valves KF, SK", "Valve EU has flow rate=10; tunnels lead to valves DX, UW, RY, NC", "Valve OA has flow rate=0; tunnels lead to valves SX, FF", "Valve NC has flow rate=0; tunnels lead to valves ZZ, EU", "Valve YB has flow rate=0; tunnels lead to valves EO, KF", "Valve VI has flow rate=0; tunnels lead to valves FF, KF", "Valve KQ has flow rate=0; tunnels lead to valves TZ, QL", "Valve WU has flow rate=0; tunnels lead to valves NT, NW", "Valve IE has flow rate=0; tunnels lead to valves UQ, ZU", "Valve UQ has flow rate=0; tunnels lead to valves IE, VC", "Valve KF has flow rate=7; tunnels lead to valves YB, RZ, IK, PG, VI", "Valve XY has flow rate=18; tunnels lead to valves WZ, DG, BA, ZZ, PN", "Valve MJ has flow rate=0; tunnels lead to valves SX, PN", "Valve KJ has flow rate=0; tunnels lead to valves QW, ZU", "Valve VC has flow rate=16; tunnels lead to valves UQ, HN", "Valve SO has flow rate=0; tunnels lead to valves NW, PW", "Valve NW has flow rate=3; tunnels lead to valves TY, WI, ED, SO, WU", "Valve SZ has flow rate=0; tunnels lead to valves YQ, FF", "Valve KU has flow rate=0; tunnels lead to valves WI, MH", "Valve QL has flow rate=9; tunnels lead to valves KQ, DW, DX", "Valve JF has flow rate=0; tunnels lead to valves NK, NT", "Valve KD has flow rate=0; tunnels lead to valves JK, NQ", "Valve ED has flow rate=0; tunnels lead to valves NW, MO", "Valve SX has flow rate=21; tunnels lead to valves JK, MJ, OA, UW", "Valve GD has flow rate=0; tunnels lead to valves ZT, NT", "Valve ZU has flow rate=19; tunnels lead to valves KJ, JB, DN, IE", "Valve HN has flow rate=0; tunnels lead to valves QW, VC", "Valve DN has flow rate=0; tunnels lead to valves UX, ZU", "Valve TZ has flow rate=17; tunnel leads to valve KQ", "Valve RY has flow rate=0; tunnels lead to valves EU, UL", "Valve MH has flow rate=15; tunnels lead to valves KU, JB, VS, NK, GA", "Valve FF has flow rate=12; tunnels lead to valves UL, SZ, OA, VI, BA", "Valve NK has flow rate=0; tunnels lead to valves MH, JF", "Valve HR has flow rate=0; tunnels lead to valves AA, SA", "Valve PG has flow rate=0; tunnels lead to valves KF, TY", "Valve PN has flow rate=0; tunnels lead to valves XY, MJ", "Valve UX has flow rate=0; tunnels lead to valves DN, NT", "Valve WZ has flow rate=0; tunnels lead to valves NQ, XY", "Valve DG has flow rate=0; tunnels lead to valves SL, XY", "Valve XM has flow rate=0; tunnels lead to valves AA, GA", "Valve UL has flow rate=0; tunnels lead to valves FF, RY", "Valve AA has flow rate=0; tunnels lead to valves PW, ZT, XM, SK, HR", "Valve GA has flow rate=0; tunnels lead to valves MH, XM", "Valve PW has flow rate=0; tunnels lead to valves SO, AA", "Valve NQ has flow rate=25; tunnels lead to valves YQ, WZ, KD", "Valve SA has flow rate=0; tunnels lead to valves HR, QM", "Valve QW has flow rate=23; tunnels lead to valves KJ, HN, VS", "Valve SK has flow rate=0; tunnels lead to valves IK, AA", "Valve YQ has flow rate=0; tunnels lead to valves SZ, NQ", "Valve ZT has flow rate=0; tunnels lead to valves GD, AA", "Valve QM has flow rate=8; tunnels lead to valves SL, SA, EO, DW, MO", "Valve NT has flow rate=13; tunnels lead to valves WU, UX, RZ, JF, GD", "Valve JK has flow rate=0; tunnels lead to valves SX, KD", "Valve SL has flow rate=0; tunnels lead to valves DG, QM", "Valve WI has flow rate=0; tunnels lead to valves KU, NW", "Valve EO has flow rate=0; tunnels lead to valves QM, YB", "Valve DW has flow rate=0; tunnels lead to valves QM, QL", "Valve DX has flow rate=0; tunnels lead to valves EU, QL", "Valve RZ has flow rate=0; tunnels lead to valves NT, KF", "Valve TY has flow rate=0; tunnels lead to valves NW, PG", "Valve ZZ has flow rate=0; tunnels lead to valves XY, NC"];

const RADIUS = 20;

class Node {
  constructor(valve, x, y) {
    this.valve = valve;
    this.x = x;
    this.y = y;
    this.isMoving = false;
  }

  render() {
    if (this.isMoving) {
      fill(150, 255, 150);
    } else {
      fill(255);
    }
    ellipse(this.x, this.y, RADIUS * 2, RADIUS * 2);
    fill(50, 50, 200);
    textSize(RADIUS * 0.8);
    text(this.valve.id, this.x, this.y - RADIUS / 3);
    textSize(RADIUS / 2);
    text("(" + this.valve.flowRate + ")", this.x, this.y + RADIUS / 3);
  }

  update() {
    if (this.isMoving) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }
}

class Edge {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  render() {
    stroke(255);
    strokeWeight(5);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    noStroke();
  }
}

let valves = [];
let valvesMap = {};

rows.forEach((r) => {
  let flowRate = parseInt(r.match(/([\d]+)/g)[0]);
  let valveIds = r.match(/([A-Z][A-Z])/g);
  let connectedValves = valveIds.slice(1);
  let valve = {
    id: valveIds[0],
    flowRate: flowRate,
    connectedTo: connectedValves,
    valves: [],
    open: false,
  };
  valves.push(valve);
  valvesMap[valve.id] = valve;
});

valves.forEach((v) => {
  v.connectedTo.forEach((id) => {
    v.valves.push(valvesMap[id]);
  });
});

console.log(valves);
//valvesMap["JJ"].open = true;

const TOTAL_MINUTES = 30;
let totalLava = 0;

for (let i = 0; i < TOTAL_MINUTES; i++) {
  console.log("Minute, lava", i, totalLava);
  valves.forEach((v) => {
    if (v.open && v.flowRate > 0) {
      totalLava += v.flowRate;
    }
  });
}

console.log("Total lava: ", totalLava);

const nodes = [];
let movingNode = null;
const edges = [];
const edgesMap = {};

const existEdge = (v1, v2) => {
  if (edgesMap[v1 + "_" + v2] === true) return true;
  if (edgesMap[v2 + "_" + v1] === true) return true;
  return false;
};

function setup() {
  ellipseMode(CENTER);
  createCanvas(1000, 900);
  background(0);
  textSize(20);
  textAlign(CENTER, CENTER);

  // Setup nodes from valves
  valves.forEach((v, i) => {
    let n = new Node(v, width / 2, height / 2);
    v.node = n; // Back reference, used for rendering
    nodes.push(n);
  });

  // Setup edges from nodes
  nodes.forEach((n) => {
    for (let i = 0; i < n.valve.valves.length; i++) {
      let cv = n.valve.valves[i];
      if (!existEdge(n.valve.id, cv.id)) {
        edgesMap[n.valve.id + "_" + cv.id] = true;
        edges.push(new Edge(n, cv.node));
      }
    }
  });
}

const findMovingNode = () => {
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];

    if (dist(n.x, n.y, mouseX, mouseY) < RADIUS) {
      return n;
    }
  }
  return null;
};

function draw() {
  background(25);
  edges.forEach((e) => {
    e.render();
  });
  nodes.forEach((n) => {
    if (mouseIsPressed) {
      if (!movingNode) {
        movingNode = findMovingNode();
      }
      if (movingNode !== null) {
        movingNode.isMoving = true;
      }
    } else if (movingNode !== null) {
      movingNode.isMoving = false;
      movingNode = null;
    }

    n.update();
    n.render();
  });
}
