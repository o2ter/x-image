const path = require('path');
const { image } = require('../dist/index.node');
const sharp = require('sharp');

(async () => {

  const test = image(sharp(path.resolve(__dirname, 'test.png')))

  console.log(test)

  console.log(await test.raw())

})();
