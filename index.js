const fs = require('fs');
const fetch = require('node-fetch');
const geoip = require('geoip-lite');
const convertTime = require('unix-time');
const { lookup } = require('dns');

(async function () {
  let records;
  fs.truncateSync('./asset_stats1.csv');
  // starts CSV file with column headings.
  fs.createWriteStream('./asset_stats1.csv', { flags: 'a' }).write(
    `assetID, assetFileID, timestamp, countrycode, ip` + '\n'
  );

  const getSolrData = async (startNum, rowIncrease) => {
    try {
      let data = await fetch(
        `http://localhost:1234/solr/statistics/select?q=*%3A*&start=${startNum}&fq=type%3A0&fq=isBot%3Afalse7&rows=${rowIncrease}&wt=json&indent=true`

        // http://localhost:1234/solr/statistics/select?q=*%3A*&fq=type%3A0&fq=isBot%3Afalse&wt=json&indent=true

        // http://localhost:1234/solr/statistics/select?q=*%3A*&fq=isBot%3Afalse&fq=type%3A0&fq=statistics_type%3Aview&wt=json&indent=true
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
  const loopStart = 1250000;
  for (let i = loopStart; i < loopStart + 250000; i += rowIncrease) {
    let startNum = i;

    const { records, startingRecord, totalRecords } = await getSolrData(
      startNum,
      rowIncrease
    );

    //console.log(records, startingRecord, totalRecords);

    records.forEach(async (record, index) => {
      try {
        if (record.ip == '10.236.41.1') {
          record.countryCode = 'US';
          return record;
        }
        const ip = record.ip;
        const recordGeo = geoip.lookup(ip);
        record.countryCode = await recordGeo.country;
        return record;
      } catch (error) {
        console.error('ERROR ----- ', error);
      }
      // }
    });

    await records.forEach(record => {
      const convertedTime = convertTime(record.time);
      record.convertedTime = convertedTime;
      return record;
    });

    await records.forEach(record => {
      fs.createWriteStream('./asset_stats1.csv', { flags: 'a' }).write(
        record.uid +
          ', PDF-1, ' +
          record.convertedTime +
          ', ' +
          record.countryCode +
          ', ' +
          record.ip +
          ' \n'
      );
    });
    console.log('records with countryCode ----', records);
    console.log('totalRecods -----------  ', totalRecords);
  }
})();
