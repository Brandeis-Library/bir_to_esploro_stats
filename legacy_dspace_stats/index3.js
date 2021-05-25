const fs = require('fs');

(async function () {
  try {
    const { statsObjs } = require('./processedObjs.js');
    const { handles } = require('./handleList.js');

    const year_month = '_2012_04';

    fs.truncateSync('./individualStats.csv');
    //console.log(statsObjs);
    let num = 0;
    // for (handle in statsObjs) {
    //   console.log(
    //     num,
    //     ' handle: ',
    //     statsObjs[handle].handle,
    //     'count: ',
    //     statsObjs[handle].count
    //   );
    //   num++;
    // }

    // Use forEach?

    console.log('statsObj Testing  ', statsObjs['/10192/24386_2012_04']);

    const statsPromises = handles.map(async handle => {
      const objIdent = `'/${handle}${year_month}'`;
      console.log('objIdent', objIdent);
      let indObj = await statsObjs[objIdent];
      //console.log(' indObj ', indObj, ' objIdent ', objIdent);
      let count = 0;
      if (indObj !== undefined) {
        indObj.count = count;
      } else {
        count = indObj.count;
      }

      return handle + ',' + count + '/n';
    });

    const statsResolvedPromise = await Promise.all(statsPromises);
    console.log(statsResolvedPromise);
    fs.createWriteStream('./individualStats.csv', {
      flags: 'a',
    }).write(`${statsResolvedPromise}`);
  } catch (error) {
    console.error(error);
  }
})();
