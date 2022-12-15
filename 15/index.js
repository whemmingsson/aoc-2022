const rows = require("../util/loader.js").getStrings("data");
const sensors = [];
const beaconMap = {};
const sensorMap = {};

const dist = (p1, p2) => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

const keyOf = (p) => p.x + "_" + p.y;
const isBeaconAt = (p) => beaconMap[keyOf(p)] === true;
const isSensorAt = (p) => sensorMap[keyOf(p)] === true;

let minX = Number.MAX_SAFE_INTEGER;
let maxX = -Number.MAX_SAFE_INTEGER;

rows.forEach((r) => {
  const result = r.match(/[\d-]+/g).map((c) => parseInt(c));

  let beacon = { x: result[2], y: result[3] };
  let sensor = { x: result[0], y: result[1], beacon: beacon };

  sensor.radius = dist(sensor, beacon);

  sensors.push(sensor);
  beaconMap[keyOf(beacon)] = true;
  sensorMap[keyOf(sensor)] = true;

  if (sensor.x - sensor.radius < minX) {
    minX = sensor.x - sensor.radius;
  }
  if (sensor.x + sensor.radius > maxX) {
    maxX = sensor.x + sensor.radius;
  }
});

const targetRow = 2000000; // target y

let noBeaconsCount = 0;
for (let x = minX; x < maxX; x++) {
  const p = { y: targetRow, x: x };
  if (isBeaconAt(p) || isSensorAt(p)) {
    continue;
  }
  for (let i = 0; i < sensors.length; i++) {
    const s = sensors[i];
    if (dist(s, p) <= s.radius) {
      noBeaconsCount++;
      break; // Don't count this more than once
    }
  }
}

console.log("Part 1: ", noBeaconsCount);
