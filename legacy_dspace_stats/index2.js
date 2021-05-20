const fs = require('fs');
const path = require('path');

(async function () {
  try {
    const { dataObjs } = require('./saved.js');

    console.log(dataObjs);
  } catch (error) {
    console.error(error);
  }
})();
