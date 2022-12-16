const rows = require("../util/loader.js").getStrings("example");

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
valvesMap["JJ"].open = true;

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
