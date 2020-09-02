const fetch = require('node-fetch');

const getSolrData = async () => {
  try {
    let data = await fetch(
      'http://localhost:1234/solr/statistics/select?q=*%3A*&fq=isBot%3Afalse&rows=10&wt=json&indent=true'
    );
    let dataJson = await data.json();
    console.log('solrResults docs -------', dataJson.response.docs);
    console.log('solrResults record start # -------', dataJson.response.start);
    console.log(
      'solrResults # num records found-------',
      dataJson.response.numFound
    );
  } catch (error) {
    console.error('ERROR------', error);
  }
};

getSolrData();
