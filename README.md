# _{BIR_TO_ESPLORO_STATS}_

#### _{Application to grab the asset view/download stats from the Brandeis Instittutional Repository and convert them to for uploading to BIR's replacement, Ex Libris Esploro.}, {9/11/2020}_

#### By _**{Chris Underwood, Library Application Developer, Brandeis University Library}**_

## Description

\_{ The goal of the application is to retreive the usage statistics from the current Brandeis Institutional Repository (DSpace) and it's Solr datastore.

The application iterates a specified number of times, grabbing a set (ex 1000) of records from the datastore using a REST API and then processes them to fit the Fedora format in the Ex Libris Esploro documentation. The application creates the country code from the IP address, the Unix time stamp from the ISO 8601 time stamp, and the fills in a default asset File ID. In the future a conversion for the UID from Solr to an ID understandable by Esploro.
}\_

## Setup/Installation Requirements

- _Make sure you have Node.js on your computer_
- _Clone the repo into a folder of your choice_
- _CD into that directory_
- _Open the file in your text editor of choice to make edits._
- _Update the Solr URL index.js getSolrData & another necessary fields_
- _run node index.js in the command line_

// Sample Solr query URL
https://localhost:1234/solr/statistics/select?q=_%3A_&fq=isBot%3Afalse&rows=10&wt=json&indent=true

// Sample Solr search home page URL
http://localhost:1234/solr/#/statistics/query

\_{
To access the Solr REST API at our institution we need to be logged into the server so that may be another prcoess.

Look at the known bugs section for a tip on how to increase your document search size.
}\_

## Known Bugs

\_{
The number of stats records in BIR is approaching 1.5 million which is well beyond what MacOS X has as the default. I used the command below to temporarily (reverts on a reboot) up the limits. I can do 250k, and it might be able to do more.

sudo launchctl limit maxfiles 1048576 350000

Note that since this uses sudo, you will be required to put in your system password.

If you want to make this permanent, you can try putting the command in ~/.bash*profile. I have not done this so I cannot speak to it's effectiveness. Consider it a starting point.
}*

## Support and contact details

_{libsys-group {@} brandeis {dot} edu}_

## Technologies Used

_{ vanilla-js, Node.js, NPM packages (geoip-lite, node-fetch, unix-time)}_

### License

\*{Copyright (c) <2020> <Brandeis University Library>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.}\*

Copyright (c) 2020 **_{Chris Underwood, Library Application Developer}_**

66.249.81 = NL
64.233.173 = US

141.0.9 = JO
66.249.82 = US

66.249.93 = US
64.233.173 = AU

141.0.8 = JO
