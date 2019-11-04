"use strict";
console.time("load modules");
const v8 = require("v8");
const kdt = require("kdt");
const csv = require("csv");
const fs = require("fs");
const coords = [];
console.timeEnd("load modules");

const distance = function(a, b) {
  return Math.pow(a.lat - b.lat, 2) + Math.pow(a.long - b.long, 2);
};

const parser = csv.parse();

parser.on("data", function(datum) {
  coords.push({
    lat: Number.parseFloat(datum[0]),
    long: Number.parseFloat(datum[1]),
    name: datum[2],
    ad1: datum[3],
    ad2: datum[4],
    cc: datum[5]
  });
});

parser.on("end", function() {
  console.timeEnd("load cities.csv");

  console.time("create kdtree");
  const tree = kdt.createKdTree(coords, distance, ["lat", "long"]);
  console.timeEnd("create kdtree");

  for (let i = 0; i < 5; i++) {
    console.time("search tree");
    const nearest = tree.nearest({ lat: 44.9483 + i, long: -93.34801 + i }, 1);
    console.timeEnd("search tree");
    console.log(nearest.reverse());
  }

  const stats = v8.getHeapStatistics();
  Object.keys(stats).forEach(function(key) {
    console.log(key + " " + Math.trunc(stats[key] / 1024 / 1024) + "mb");
  });
});

console.time("load cities.csv");
fs.createReadStream("./cities.csv").pipe(parser);
