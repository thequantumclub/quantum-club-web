const { Jimp } = require('jimp');

async function checkBg() {
  const image = await Jimp.read('public/logo2.jpeg');
  console.log("Top-Left:", image.bitmap.data[0], image.bitmap.data[1], image.bitmap.data[2]);
  console.log("Top-Right:", image.bitmap.data[(image.bitmap.width - 1) * 4 + 0], image.bitmap.data[(image.bitmap.width - 1) * 4 + 1], image.bitmap.data[(image.bitmap.width - 1) * 4 + 2]);
}
checkBg();
