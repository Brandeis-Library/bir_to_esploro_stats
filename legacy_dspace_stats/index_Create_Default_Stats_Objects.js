const fs = require('fs');

(async function () {
  try {
    const { handles } = require('./handleList.js');

    fs.truncateSync('./defaultDataObjects.js');

    await fs
      .createWriteStream('./defaultDataObjects.js', {
        flags: 'a',
      })
      .write('module.exports = { defaultStatsObjs: {');

    for (let i = 0; i < handles.length; i++) {
      const obj = {};
      const hand = handles[i];
      obj.count = 0;
      obj.handle = 'https://hdl.handle.net/' + hand;
      obj.name = '/' + hand;
      //console.log('default obj', obj);
      fs.createWriteStream('./defaultDataObjects.js', {
        flags: 'a',
      }).write(`'/${hand}': ${JSON.stringify(obj)},`);
    }

    setTimeout(function () {
      fs.createWriteStream('./defaultDataObjects.js', {
        flags: 'a',
      }).write(`}}\n`);
    }, 1000);
  } catch (error) {
    console.error(error);
  }
})();
