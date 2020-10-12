const fs = require('fs');
const fetch = require('node-fetch');
const geoip = require('geoip-lite');
const convertTime = require('unix-time');
const { lookup } = require('dns');

// brings in IPs object for matching 'bad' IPs to their county
const { IPs } = require('./problemIPs.js');

// brings in handles to convert UID via matching on owning item
const { handles } = require('./uidConvertToHandles.js');
(async function () {
  let records;
  fs.truncateSync('./asset_stats_org_date/asset_stats6.csv');
  // starts CSV file with column headings.
  fs.createWriteStream('./asset_stats_org_date/asset_stats6.csv', {
    flags: 'a',
  }).write(`assetID, assetFileID, timestamp, countrycode, ip` + '\n');

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

  const rowIncrease = 1000;
  //const loopStart = 1250000;
  const loopStart = 1250000;
  for (let i = loopStart; i < loopStart + 450000; i += rowIncrease) {
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
        if (
          ip == '10.236.41.1' ||
          ip.startsWith('172.19.') ||
          ip.startsWith('172.20.') ||
          ip.startsWith('172.21.') ||
          ip.startsWith('172.22.') ||
          ip.startsWith('45.151.172.')
        ) {
          record.countryCode = 'US';

          return record;
        } else if (ip == '185.80.203.179' || ip == '185.222.216.192') {
          record.countryCode = 'GB';

          return record;
        } else if (
          ip == '103.229.233.145' ||
          ip == '103.54.168.17' ||
          ip == '160.20.5.56'
        ) {
          record.countryCode = 'IN';

          return record;
        } else if (ip == '154.71.70.183') {
          record.countryCode = 'CI';

          return record;
        } else if (ip == '185.25.95.132') {
          record.countryCode = 'CZ';

          return record;
        } else {
          record.countryCode = IPs[ip];
        }

        const recordGeo = await geoip.lookup(ip);
        console.log('recordGeo ++++ ', recordGeo);
        const cc = await recordGeo.country;
        console.log('cc ========= ', cc);

        if (cc === '') {
          //record.countryCode = '--------';
          // Run await IPs here?
          let recordIp = record.ip;
          //console.log('recordIp  ', recordIp);
          recordIp = recordIp.trim();
          //console.log('recordIp  ', recordIp);

          if (
            recordIp.startsWith('66.249.93.') ||
            recordIp.startsWith('66.249.81.') ||
            recordIp.startsWith('66.249.82') ||
            recordIp.startsWith('64.233.173.')
          ) {
            record.countryCode = 'US';

            return record;
          } else if (
            recordIp.startsWith('82.145.208.') ||
            recordIp.startsWith('82.145.209.') ||
            recordIp.startsWith('82.145.210.') ||
            recordIp.startsWith('82.145.211.')
          ) {
            record.countryCode = 'NO';

            return record;
          } else if (recordIp.startsWith('77.111.247.')) {
            record.countryCode = 'NL';

            return record;
          } else if (
            recordIp.startsWith('141.0.8.') ||
            recordIp.startsWith('141.0.9.') ||
            recordIp.startsWith('141.0.10.') ||
            recordIp.startsWith('141.0.11.')
          ) {
            record.countryCode = 'SG';

            return record;
          } else if (
            recordIp.startsWith('165.225.72.' || recordIp == '185.196.29.189')
          ) {
            record.countryCode = 'DE';

            return record;
          } else if (recordIp.startsWith('196.3.50.')) {
            record.countryCode = 'CH';

            return record;
          } else if (
            recordIp === '185.80.203.179' ||
            recordIp === '185.222.216.192'
          ) {
            record.countryCode = 'GB';

            return record;
          } else if (recordIp.startsWith('77.111.245.')) {
            record.countryCode = 'SE';

            return record;
          } else if (
            recordIp.startsWith('102.13.96.') ||
            recordIp.startsWith('102.23.96.')
          ) {
            record.countryCode = 'NG';

            return record;
          } else {
            record.countryCode = IPs[record.ip];

            return record;
          }
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
      //const convertedTime = convertTime(record.time);
      //record.convertedTime = convertedTime;
      record.convertedTime = record.time;
      return record;
    });

    await records.forEach(record => {
      let recordIP = record.ip.trim();
      fs.createWriteStream('./asset_stats_org_date/asset_stats6.csv', {
        flags: 'a',
      }).write(
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
