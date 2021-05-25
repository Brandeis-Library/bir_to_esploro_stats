(async function () {
  try {
    const { statsObjs } = require('./processedObjs.js');
    const { handles } = require('./handleList.js');

    fs.truncateSync('./individualStats.csv');
    //console.log(statsObjs);
    let num = 0;
    for (handle in statsObjs) {
      console.log(
        num,
        ' handle: ',
        statsObjs[handle].handle,
        'count: ',
        statsObjs[handle].count
      );
      num++;
    }
  } catch (error) {
    console.error(error);
  }
})();
