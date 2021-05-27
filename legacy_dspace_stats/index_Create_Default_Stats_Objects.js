const fs = require('fs');

(async function () {
  try {
    const { handles } = require('./handleList.js');
  } catch (error) {
    console.error(error);
  }
})();
