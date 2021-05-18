// convert http://bir.brandeis.edu/handle/10192/3044
// to      oai:bir.brandeis.edu:10192/3044

// Going to use the Digital Commons import usage data by origination system id.
// One column of the org system id. other columns for views/month

// is oai the asset originating system id in Esploro?

// grab table with a manually inserted id="grab" in the table for  Number of views text
//   Still unsure how to grab all of the reports in one batch.
//    Perhaps we can put the paths in an array and loop over them
//    Use the text of the path in filePath and to get the dates for the object name (see below)
//    The truncation needs to be moved up so that we only truncate once at the beginning of the file. The rest of the data will just be appended.
// Do one for loop for each  tr in each tableonly since we know how many rows are in table.
// in each tr
//    td-0 grab text of td
//    td-1 grab text of views/downloads
// conside making the output as objects to optimize finding each record.
//    Perhaps the title of each obj can be some combination of handle and month
//    Then if a matching object is not found, then we can just put in a 0 in the spreadsheet
//    Perhaps we do 2 loops with a master list of handles and then a second loop for month/year.
// convert url from td-0 to Esploro friendly format
// A second index.js file/program with build the csv file needed for the load.

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

(function () {
  //cheerio.load(fs.readFileSync('path/to/file.html'));
  const filePath = path.join(__dirname, './reports/report-2012-04.html');
  //let records;
  fs.truncateSync('./saved.csv');
  fs.readFile(filePath, 'utf8', async function (err, data) {
    if (err) throw err;

    var $ = cheerio.load(data);
    let table = $.html('#grab tr');
    //console.log('table.rows ------', table.rows);
    let strippedString = table.replace(/<(td[^>]+)>/gm, ' | ');
    strippedString = strippedString.replace(/<\/td>/gm, ' | ');
    strippedString = strippedString.replace(/(<([^>]+)>)/gm, '');
    strippedString = strippedString.replace(/Item\/Handle/g, '');
    strippedString = strippedString.replace(/Number\sof\sviews/, '');
    strippedString = strippedString.replace(/\s+/g, ' ').trim();
    const strippedArray = strippedString.split('|');
    const arrayFiltered = strippedArray.filter(entry => entry !== ' ');

    const arrayIntoObjects = [];

    for (i = 0; i < arrayFiltered.length; i += 2) {
      const obj = {};
      obj.handle = arrayFiltered[i];
      obj.count = arrayFiltered[i + 1];
      arrayIntoObjects.push(obj);
    }

    fs.createWriteStream('./saved.csv', {
      flags: 'a',
    }).write(`${JSON.stringify(arrayIntoObjects)}`);
  });
})();
