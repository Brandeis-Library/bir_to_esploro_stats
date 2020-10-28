const fs = require('fs');
const fetch = require('node-fetch');
const geoip = require('geoip-lite');
const { lookup } = require('dns'); // part of geoip
const convertTime = require('unix-time');

// brings in IPs object for matching 'bad' IPs to their county
const { IPs } = require('./problemIPs.js');

// brings in handles to convert UID via matching on owning item
const { handles } = require('./uidConvertToHandles.js');
(async function () {
  //let records;
  fs.truncateSync('./assets_final_with_handles_unix_time/asset_stats5.csv');
  // starts CSV file with column headings.
  fs.createWriteStream(
    './assets_final_with_handles_unix_time/asset_stats5.csv',
    {
      flags: 'a',
    }
  ).write(`assetID,assetFileID,timestamp,countrycode` + '\n');

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
  const loopStart = 1000000;
  //const loopStart = 0;
  for (let i = loopStart; i < loopStart + 250000; i += rowIncrease) {
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
          ip.startsWith('45.151.172.') ||
          ip.startsWith('195.135.13') ||
          ip.startsWith('91.198.230.') ||
          ip.startsWith('91.199.3.') ||
          ip.startsWith('193.109.221.') ||
          ip.startsWith('91.240.71.') ||
          ip.startsWith('91.231.143.') ||
          ip.startsWith('91.229.105.') ||
          ip.startsWith('91.231.142.') ||
          ip.startsWith('193.37.133') ||
          ip.startsWith('194.105.158.') ||
          ip.startsWith('194.105.159.') ||
          ip.startsWith('194.107.125.') ||
          ip.startsWith('193.135.13') ||
          ip.startsWith('91.229.104.')
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
            recordIp.startsWith('64.233.173.') ||
            recordIp.startsWith('45.151.172.') ||
            recordIp.startsWith('195.135.13') ||
            recordIp.startsWith('91.198.230.') ||
            recordIp.startsWith('91.199.3.') ||
            recordIp.startsWith('91.229.104.') ||
            recordIp.startsWith('193.109.221.') ||
            recordIp.startsWith('91.229.105.') ||
            recordIp.startsWith('91.231.142.') ||
            recordIp.startsWith('91.231.143.') ||
            recordIp.startsWith('91.240.71.') ||
            recordIp.startsWith('193.37.133') ||
            recordIp.startsWith('194.105.158.') ||
            recordIp.startsWith('194.105.159.') ||
            recordIp.startsWith('194.107.125.')
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

    await records.forEach(async record => {
      const owningItem = record.owningItem;
      const hand = await handles[owningItem];
      record.handle = hand;
      return record;
    });

    await records.forEach(record => {
      const convertedTime = convertTime(record.time);
      record.convertedTime = convertedTime;
      //record.convertedTime = record.time;
      return record;
    });

    await records.forEach(record => {
      fs.createWriteStream(
        './assets_final_with_handles_unix_time/asset_stats5.csv',
        {
          flags: 'a',
        }
      ).write(
        record.handle +
          ',' +
          'PDF-1' +
          ',' +
          record.convertedTime +
          ',' +
          record.countryCode +
          '\n'
      );
    });

    console.log('records with countryCode ----', records);
    console.log('totalRecods -----------  ', totalRecords);
  }
})();
