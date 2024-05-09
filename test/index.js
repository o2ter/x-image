const path = require('path');
const { image } = require('../dist/index.node');
const sharp = require('sharp');

const test = image(sharp(path.resolve(__dirname, 'test.png')))

console.log(test)
