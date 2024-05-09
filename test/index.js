const path = require('path');
const { fileURLToPath } = require('url');
const { image } = require('../dist');
const sharp = require('sharp');

const test = image(sharp(path.resolve(__dirname, 'test.png')))

console.log(test)
