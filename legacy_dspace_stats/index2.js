const fs = require('fs');
const path = require('path');

(async function () {
  try {
    const { dataObjs } = require('./saved.js');

    fs.truncateSync('./processedObjs.js');

    fs.createWriteStream('./processedObjs.js', {
      flags: 'a',
    }).write('module.exports = { statsObjs: {');

    console.log(dataObjs);

    for (let i = 0; i < dataObjs.length; i++) {
      const newObj = {};
      const oldObj = dataObjs[i];
      let objName = oldObj.name;
      newObj.handle = oldObj.handle;
      newObj.count = oldObj.count.length;
      const objText = `"${objName}": ${JSON.stringify(newObj)}`;

      // write each stats object
      fs.createWriteStream('./processedObjs.js', {
        flags: 'a',
      }).write(`${objText},`);
    }

    // write each stats object
    // fs.createWriteStream('./processedObjs.js', {
    //   flags: 'a',
    // }).write(`\n`);

    fs.createWriteStream('./processedObjs.js', {
      flags: 'a',
    }).write(`}}\n`);
  } catch (error) {
    console.error(error);
  }
})();
