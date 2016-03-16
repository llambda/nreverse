'use strict';
const kdt = require('kdt')
const csv = require('csv')
const fs = require('fs')
const parser = csv.parse()
let coords = []

parser.on('data', function (datum) {
  coords.push({
    lat: parseFloat(datum[0]),
    long: parseFloat(datum[1]),
    name: datum[2],
    ad1: datum[3],
    ad2: datum[4],
    cc: datum[5],
  })
})

const distance = function(a, b){
  return Math.pow(a.lat - b.lat, 2) +  Math.pow(a.long - b.long, 2);
}

parser.on('end', function () {
  const tree = kdt.createKdTree(coords, distance, ['lat', 'long'])
  const nearest = tree.nearest({ lat: 44.9483, long: -93.34801 }, 1);
  console.log(nearest.reverse());
})

fs.createReadStream('./cities.csv')
.pipe(parser)
