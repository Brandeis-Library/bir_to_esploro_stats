const fs = require('fs');

(async function () {
  try {
    const { handles } = require('./handleList.js');

    fs.truncateSync('./defaultDataObjects.js');

    console.log('handles', handles);

    await fs
      .createWriteStream('./defaultDataObjects.js', {
        flags: 'a',
      })
      .write(`${handles}`);
  } catch (error) {
    console.error(error);
  }
})();
