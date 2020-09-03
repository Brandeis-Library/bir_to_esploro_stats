const fetch = require('node-fetch');
const geoip = require('geoip-lite');
const convertTime = require('unix-time');

(async function () {
  const getSolrData = async () => {
    try {
      let data = await fetch(
        `http://localhost:1234/solr/statistics/select?q=*%3A*&start=0&fq=isBot%3Afalse&rows=10&wt=json&indent=true`
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

  const { records, startingRecord, totalRecords } = await getSolrData();

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

  console.log('records with countryCode ----', records);
})();
