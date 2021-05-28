const fs = require('fs');

(async function () {
  try {
    const { statsObjs } = require('./processedObjs.js');
    const { defaultStatsObjs } = require('./defaultDataObjects.js');

    const year_month = '_2012_04';

    fs.truncateSync('./individualStats.csv');

    console.log(defaultStatsObjs);

    await fs
      .createWriteStream('./individualStats.csv', {
        flags: 'a',
      })
      .write(`blurb`);
  } catch (error) {
    console.error(error);
  }
})();
