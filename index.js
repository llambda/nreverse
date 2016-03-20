'use strict';
const kdt = require('kdt');
const csv = require('csv');
const fs = require('fs');
const coords = [];

const distance = function (a, b) {
  return Math.pow(a.lat - b.lat, 2) +  Math.pow(a.long - b.long, 2);
}

const parser = csv.parse();

parser.on('data', function (datum) {
  coords.push({
    lat: Number.parseFloat(datum[0]),
    long: Number.parseFloat(datum[1]),
    name: datum[2],
    ad1: datum[3],
    ad2: datum[4],
    cc: datum[5],
  })
})

parser.on('end', function () {
  const tree = kdt.createKdTree(coords, distance, ['lat', 'long']);
  const nearest = tree.nearest({ lat: 44.9483, long: -93.34801 }, 1);
  console.log(nearest.reverse());
})

fs.createReadStream('./cities.csv')
.pipe(parser);
