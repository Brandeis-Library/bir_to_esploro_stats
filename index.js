const fs = require('fs');
const fetch = require('node-fetch');
const geoip = require('geoip-lite');
const convertTime = require('unix-time');
const { lookup } = require('dns');

// brings in IPs object for matching 'bad' IPs to their county
const { IPs } = require('./problemIPs.js');
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
        `http://localhost:1234/solr/statistics/select?q=*%3A*&start=${startNum}&fq=type%3A0&fq=isBot%3Afalse7&fq=bundleName%3AORIGINAL&rows=${rowIncrease}&fq=owningComm%3A81+%7C%7C+owningComm%3A101&fq=!owningColl%3A101&wt=json&indent=true`
      );

      //http://localhost:1234/solr/statistics/select?q=*%3A*&fq=isBot%3Afalse&fq=type%3A0&fq=bundleName%3AORIGINAL&fq=owningComm%3A81+%7C%7C+owningComm%3A101&fq=!owningColl%3A101&wt=json&indent=true

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

  const rowIncrease = 10;
  const loopStart = 155000;
  for (let i = loopStart; i < loopStart + 10; i += rowIncrease) {
    let startNum = i;

    const { records, startingRecord, totalRecords } = await getSolrData(
      startNum,
      rowIncrease
    );

    //console.log(records, startingRecord, totalRecords);

    await records.forEach(async (record, index) => {
      try {
        // if (!record.countryCode) {
        //   record.countryCode = await IPs[record.ip];
        //   return record;
        // }
        const ip = record.ip;
        const recordGeo = await geoip.lookup(ip);
        console.log('recordGeo ++++ ', recordGeo);
        const cc = await recordGeo.country;
        console.log('cc ========= ', cc);
        if (cc === '') {
          //record.countryCode = '--------';
          // Run await IPs here?
          console.log(
            'record.ip  -----  ',
            record.ip,
            '  type  ',
            typeof record.ip
          );
          let recordIp = record.ip;
          console.log('recordIp  ', recordIp);
          recordIp = recordIp.trim();
          console.log('recordIp  ', recordIp);
          record.countryCode = IPs[record.ip];

          return record;
        } else {
          record.countryCode = cc;
          return record;
        }
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
      let recordIP = record.ip.trim();
      fs.createWriteStream('./asset_stats1.csv', { flags: 'a' }).write(
        record.uid +
          ', PDF-1, ' +
          record.convertedTime +
          ', ' +
          record.countryCode +
          ',' +
          record.ip +
          '\n'
      );
    });

    console.log('records with countryCode ----', records);
    console.log('totalRecods -----------  ', totalRecords);
  }
})();
