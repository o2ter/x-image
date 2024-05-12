const path = require('path');
const { image } = require('../dist/index.node');
const sharp = require('sharp');

(async () => {

  const test = image(sharp(path.resolve(__dirname, 'test.png')))

  console.log(test)

  console.log(await test.raw())

  const test2 = image(sharp(path.resolve(__dirname, 'test2.png')))

  console.log(test2)

  console.log(await test2.raw())

})();
