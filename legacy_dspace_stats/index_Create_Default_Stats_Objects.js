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

    console.log('handles', handles);

    setTimeout(function () {
      fs.createWriteStream('./defaultDataObjects.js', {
        flags: 'a',
      }).write(`}}\n`);
    }, 1000);
  } catch (error) {
    console.error(error);
  }
})();
