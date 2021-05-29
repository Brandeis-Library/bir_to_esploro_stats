const fs = require('fs');

(async function () {
  try {
    const { statsObjs } = require('./processedObjs.js');
    const { defaultStatsObjs } = require('./defaultDataObjects.js');

    const year_month = '_2012_04';

    fs.truncateSync('./individualStats.csv');

    //console.log(defaultStatsObjs);

    for (const name in defaultStatsObjs) {
      //console.log(`${name}: ${JSON.stringify(defaultStatsObjs[name])}`);
      const searchTerm = name + year_month;
      const defaultObj = defaultStatsObjs[name];
      //console.log('searchTerm...', searchTerm);
      const resultObj = await statsObjs[searchTerm];
      console.log('resultObj.................................', resultObj);
      if (resultObj) {
        defaultObj.count = resultObj.count;
      }
      fs.createWriteStream('./individualStats.csv', {
        flags: 'a',
      }).write(`${defaultObj.handle}, ${defaultObj.count} \n`);
    }
    // console.log(statsObjs['/10192/24237_2012_04']);
    // fs.createWriteStream('./individualStats.csv', {
    //   flags: 'a',
    // }).write(`---------------------------------------------------`);
  } catch (error) {
    console.error(error);
  }
})();
