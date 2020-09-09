const fs = require('fs');
const fetch = require('node-fetch');
const geoip = require('geoip-lite');
const convertTime = require('unix-time');

(async function () {
  let records;
  fs.truncateSync('./asset_stats1.csv');
  // starts CSV file with column headings.
  fs.createWriteStream('./asset_stats1.csv', { flags: 'a' }).write(
    `assetID, assetFileID, timestamp, countrycode` + '\n'
  );

  const getSolrData = async (startNum, rowIncrease) => {
    try {
      let data = await fetch(
        `http://localhost:1234/solr/statistics/select?q=*%3A*&start=${startNum}&fq=isBot%3Afalse&rows=${rowIncrease}&wt=json&indent=true`
      );
      let dataJson = await data.json();
      const records = dataJson.response.docs;
      const startingRecord = dataJson.response.start;
      const totalRecords = dataJson.response.numFound;
      //console.log('solrResults records -------', records);
      //console.log('solrResults record # start  -------', startingRecord);
      //console.log('solrResults # totalRecords -------', totalRecords);
      return { records, startingRecord, totalRecords };
    } catch (error) {
      console.error('ERROR------', error);
    }
  };

  const rowIncrease = 1000;
  for (let i = 0; i <= 100000; i += rowIncrease) {
    let startNum = i;

    const { records, startingRecord, totalRecords } = await getSolrData(
      startNum,
      rowIncrease
    );

    //console.log(records, startingRecord, totalRecords);

    records.forEach(record => {
      if (record.hasOwnProperty('countryCode')) {
        console.log('Has country code.  ', index);
        return record;
      } else {
        const ip = record.ip;
        const recordGeo = geoip.lookup(ip);
        record.countryCode = recordGeo.country;
        return record;
      }
    });

    records.forEach(record => {
      const convertedTime = convertTime(record.time);
      record.convertedTime = convertedTime;
      return record;
    });

    records.forEach(record => {
      fs.createWriteStream('./asset_stats1.csv', { flags: 'a' }).write(
        record.uid +
          ', PDF-1, ' +
          record.convertedTime +
          ', ' +
          record.countryCode +
          ', \n'
      );
    });
    console.log('records with countryCode ----', records);
  }
})();
