/*eslint no-unused-vars: 0*/
/*global sites siteMetas ui*/


/* 
siteMetas element structure
[domain][protocol] : {
  url: "http://www.toto.com/ads.txt",
  results: {
    headers: response.headers,
    ok: response.ok,
    redirected: response.redirected,
    status: response.status,
    statusText: response.statusText,
    type: response.type,
    url: response.url,
    file: file,
    content: ''
  }
}

Example:
{
  "mme": { 
    "http://": { url: "", res: {...}}, 
    "https://": { url: "", res: {...}}, 
  },
  "flr": { 
    "http://": { url: "", res: {...}}, 
    "https://": { url: "", res: {...}}, 
  },
}

*/
var siteMetas = {
  sites: [],
  deft: {
    headers: "",
    ok: false,
    redirected: false,
    status: false,
    statusText: false,
    type: "",
    url: "",
    filepath: "",
    content: "",
    pass: false,
    error: {}
  },
  protocols: ["http://", "https://"],

  /*
  @param domain string
  @param protocol string
  @param result object
  @returns none
  */
  init: function (sites) {
    console.log("AdTechWatch siteMetas: running");

    this.sites = sites;
  },

  /**
   * Fetch information of all sites
   */
  processAll: function () {
    console.log(`AdTechWatch siteMetas processAll:`);

    // sites defined in data/site.js

    //TODO convert to promiseAll and trigger processFinished event
    this.sites.forEach((domain) => {
      this.process(domain);
    }, this);
  },

  /**
   * Fetch a single sites -- from 1.2.4
   * Works
   * TODO try to integrate in process()
   */
  fetchSite: function (site, callback) {
    let file = site + '/ads.txt',
        res = {};  // gather information in case it errors out - for catch.
    console.log(file);

    const myRequest = new Request(file, {"cache":"no-cache", "redirect":"follow"});

    // get file content and add results to result table
    fetch(myRequest)
      .then(response => {
        console.table(response);

        res = response;
        const responseText = response.text();

        if (response.status === 200) {
          return responseText;
        } else if ( 
            (response.status >= 100 && response.status < 200) || 
            response.status > 200
          ) {
            return (responseText) ? responseText : 'ERROR: no data returned';
        } else {
          callback('', `ERROR: Nothing returned! - File ${file} - Response code: ${response.status}`);
          throw new Error('Nothing returned!');
        }
      })
      .then(responseText => {
        callback(file, responseText.split('\n')[0]);
      })
      .catch( (error) => {
        //console.table(error);
        callback(file, `Message: Is ${file} a valid URL?<br>ERROR: ${error.name}: <b>${error.message}</b>;<br>Response code: <b>${res.status}</b>`);
      });
  },

  // callback getMeta
  getMeta: function (response, domain, protocol) {
    // forEach loop context variables: file, domain, protocol

    debugger;

    const file = protocol + domain + '/ads.txt';

    console.log(`AdTechWatch siteMetas process fetch getMeta: `);
    console.log(file);
    console.table(response);

    // keep stats of all sites
    siteMetas.add(domain, protocol, {
      headers: response.headers,
      ok: response.ok,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url,
      filepath: file,
    });

    return response;
  }, //callback getMeta

  // callback handleStatus
  handleStatus: function (fileContent, res) {
    console.log(`AdTechWatch siteMetas process fetch handleStatus: `, fileContent);
    console.table(res);

    debugger;

    if (res.ok) { // [200 .. 299]
      res.content = fileContent.split('\n')[0];
      res.pass = true;
    } else if (res.redirected) {
      //TODO see if filecontent is passed when redirected
      let content = (fileContent) ? fileContent.split('\n')[0] : '';
      res.content = `REDIRECTED to ${res.url}${(content) ? '\n' : ''}${content}`;
    } else {
      res.content = `ERROR: ${res.status} ${res.statusText}`;
    }
  }, //callback handleStatus

  
  /**
   * Fetch information of a site - all protocols
  @param site object
   */
  process: function (domain) {
    console.log(`AdTechWatch siteMetas process: ${domain} `);

    this.protocols.forEach((protocol) => {

      let file = protocol + domain + '/ads.txt';
      var res = this.deft; // assign default values
      console.log(`AdTechWatch siteMetas process: ${file} `);

      //TODO see ads.txt-test\ext-packages\1.2.4\popup.js::fetchSite()  That works.

      fetch(file, {
          // mode: "no-cors", // mode in extension is cors
          cache: "no-cache",
          redirect: "follow"
        })
        .then(response => this.getMeta(response, domain, protocol))
        .then(response => response.text())
        .then(fileContent => this.handleStatus(fileContent, this.sites[domain][protocol].results))
        .catch((error) => {

          debugger;

          //TODO what happen if not ok?  Does it fall here?
          //TODO does reject fall here? 

          console.log("AdTechWatch fetchsite: error caught")
          console.table(error);

          res.error = error;
          res.filepath = file;

          //TODO verify if .update works in that case.  otherwise, use .add
          this.update(domain, protocol, res);
        });


    }, this); // forEach

  }, // process()

  /*
  @param domain string
  @param protocol string
  @param result object
  @returns none
  */
  add: function (domain, protocol, results = this.deft) {
    if (!this.sites[domain]) {
      this.sites[domain] = [];
    };
    if (!this.sites[domain][protocol]) {
      this.sites[domain][protocol] = {};
    }
    let domprot = this.sites[domain][protocol];

    // take default and update with results passed
    domprot.results = { 
      ...this.deft,
      ...results
    };

    console.log(`AdTechWatch siteMetas: ${protocol}${domain} `, domprot);

  },

  /*
  @param domain string
  @param protocol string
  @param result object
  @returns none
  */
  update: function (domain, protocol, results) {
    if (!this.sites[domain]) {
      this.sites[domain] = [];
    };
    if (!this.sites[domain][protocol]) {
      this.sites[domain][protocol] = {};
    }
    let domprot = this.sites[domain][protocol];

    // take current values and update with results passed
    domprot.results = { 
      ...domprot.results,
      ...results
    };

    console.log(`AdTechWatch siteMetas: ${protocol}${domain} `, domprot);

  },

  /*
    @param domain string
    @param protocol string
    @returns result object
    */
  get: function (domain, protocol) {
    return this.sites[domain][protocol].results;
  },

  /*
  @param callback function
  @returns none
  */
  listall: function (callback) {
    console.log("AdTechWatch siteMetas: listall");

    for (let value in this.sites) {
      callback(this.sites[value]);
      //console.log( siteMetas.sites[value] );
    }
  },

  /*
  @param callback function
  @returns none
  */
  logdom: function (domain) {
    console.table(this.sites[domain]);
  },
  logall: function () {
    console.table(this.sites);
  },
};

// siteMetas.init(sites); //from data/sites.js
// siteMetas.listall(console.log);
// siteMetas.processAll();