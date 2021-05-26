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

    const statsPromises = await handles.map(async handle => {
      const objIdent = `${handle}${year_month}`;
      console.log('objIdent', objIdent);
      let indObj = await statsObjs['/10192/24237_2012_04'];

      if (!objIdent) {
        return ` ${handle}, 0`;
      }
      return ` ${indObj}`;
    });

    const statsResolvedPromise = await Promise.all(statsPromises);
    console.log('statsResolvedPromise', statsResolvedPromise);
    await fs
      .createWriteStream('./individualStats.csv', {
        flags: 'a',
      })
      .write(`${statsResolvedPromise}`);
  } catch (error) {
    console.error(error);
  }
})();
