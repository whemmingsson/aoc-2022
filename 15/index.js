const rows = require("../util/loader.js").getStrings("data");
const sensors = [];
const beaconMap = {};
const sensorMap = {};

const dist = (p1, p2) => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
const keyOf = (p) => p.x + "_" + p.y;
const isBeaconAt = (p) => beaconMap[keyOf(p)] === true;
const isSensorAt = (p) => sensorMap[keyOf(p)] === true;

let minX = Number.MAX_SAFE_INTEGER;
let maxX = -Number.MAX_SAFE_INTEGER;

let minY = Number.MAX_SAFE_INTEGER;
let maxY = -Number.MAX_SAFE_INTEGER;

rows.forEach((r) => {
  const result = r.match(/[\d-]+/g).map((c) => parseInt(c));

  let beacon = { x: result[2], y: result[3] };
  let sensor = { x: result[0], y: result[1] };

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
  if (sensor.y - sensor.radius < minY) {
    minY = sensor.y - sensor.radius;
  }
  if (sensor.y + sensor.radius > maxY) {
    maxY = sensor.y + sensor.radius;
  }
});

console.log("Min:", minX, minY);
console.log("Max:", maxX, maxY);
const matrixSize = (maxX - minX) * (maxY - minY);
console.log("Size:", matrixSize);

const targetRow = 10; // target y

/*
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
*/

const minValid = 0;
const maxValid = 20;
const isWithinValidSpace = (p) => p.x >= minValid && p.y >= minValid && p.x <= maxValid && p.y <= maxValid;

// Part 2
const findShortestSkipLength = (coveringSensors, p) => {
  let shortest = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < coveringSensors.length; i++) {
    let sensorDiameter = coveringSensors[i].radius * 2;
    let distY = Math.abs(coveringSensors[i].y - p.y);
    let skipXDist = sensorDiameter - distY * 2;
    if (skipXDist < shortest) {
      shortest = skipXDist;
    }
  }
  return shortest;
};

const findClosestSensor = (p) => {
  let minDist = Number.MAX_SAFE_INTEGER;
  let closest = null;
  sensors.forEach((s) => {
    let d = dist(s, p);
    if (d <= minDist && d <= s.radius) {
      closest = s;
      minDist = d;
    }
  });

  return closest;
};

const findBeacon = () => {
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      const p = { x: x, y: y };
      if (isBeaconAt(p) || isSensorAt(p)) {
        continue;
      }
      let foundDistressBeacon = true;
      let sensor = null;
      let coveringSensors = [];
      for (let i = 0; i < sensors.length; i++) {
        sensor = sensors[i];
        if (dist(sensor, p) <= sensor.radius) {
          foundDistressBeacon = false;
          coveringSensors.push(sensors[i]);
          break;
        }
      }
      if (!foundDistressBeacon) {
        let closest = findClosestSensor(p);
        //console.log("failed to find beacon at:", p, "covered by sensor:", closest);
        // Optimizing algorithm
        let sensorDiameter = closest.radius * 2;
        //console.log("Diam:", sensorDiameter);
        let distY = Math.abs(closest.y - p.y);
        // console.log("DistY", distY);
        let skipXDist = sensorDiameter - distY * 2;
        //console.log("Skip X dist:", skipXDist);
        let distToEdge = closest.radius - dist(closest, p);
        //console.log("distToEdget:", distToEdge);
        x += skipXDist - distToEdge;
      }
      if (foundDistressBeacon && isWithinValidSpace(p)) {
        console.log("Part 2, Found it at:", p);
        return;
      }
    }
  }
};

const timerStart = performance.now();
findBeacon();
const timerEnd = performance.now();
console.log("Elapsed time:", timerEnd - timerStart);
