const path = require('path');
const { image } = require('../dist/index.node');
const sharp = require('sharp');

const test = image(sharp(path.resolve(__dirname, 'test.png')))

console.log(test)

console.log(test.toJimp())

console.log(test.toMirada())

console.log(test.toSharp())
