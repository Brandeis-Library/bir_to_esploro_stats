// convert http://bir.brandeis.edu/handle/10192/3044
// to      oai:bir.brandeis.edu:10192/3044

// Going to use the Digital Commons import usage data by origination system id.
// One column of the org system id. other columns for views/month

// is oai the asset originating system id in Esploro?

// grab table with <th> Number of views text
// in each tr
//    td-0 grab text of td
//    td-1 grab text of views/downloads
// convert url from td-0 to Esploro friendly format

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

//cheerio.load(fs.readFileSync('path/to/file.html'));
const filePath = path.join(__dirname, './reports/report-2012-04.html');
fs.readFile(filePath, 'utf8', function (err, data) {
  if (err) throw err;

  var $ = cheerio.load(data);
  console.log($.html('#grab'));
});
