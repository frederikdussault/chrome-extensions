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
    file: "",
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
    });
  },

  /**
   * Fetch information of a site - all protocols
  @param site object
   */
  process: function (domain) {
    console.log(`AdTechWatch siteMetas process: ${domain} `);

    this.protocols.forEach((protocol) => {
      let file = protocol+domain+'/ads.txt';
      var res = this.deft; // assign default values
      var myRequest = new Request(file);
      console.log(`AdTechWatch siteMetas process: ${file} `);

      fetch(myRequest)
      .then(response => { //see getMeta
        //add metas to site results
        console.log(`AdTechWatch siteMetas process fetch response: `, response);

        console.log("AdTechWatch getMeta:")
        console.log(file);
        console.table(response);


        //TODO: Continue here.  need to catch non-200 so we know what happen with these files
        res = {
          headers: response.headers,
          ok: response.ok,
          redirected: response.redirected,
          status: response.status,
          statusText: response.statusText,
          type: response.type,
          url: response.url,
          filepath: file,
        };

        // process response status
        //TODO: revise the condition - need to catch all response if there is one
        if (response.status >= 200 && response.status < 300) {
          this.add(domain, protocol, res);

          return Promise.resolve(response)
        } else {

          //TODO: Do not throw an error, just reject
          var error = new Error(response.statusText || response.status)
          error.response = response

          //Add error to res
          res.error = error;

          this.add(domain, protocol, res);

          return Promise.reject(error)
        }
      })
      .then(response => response.text()) // get file content
      .then(fileContent => { //see handleStatus
        console.log(`AdTechWatch siteMetas process fetch content: `, fileContent);
        //TODO add content to sites[domain][protocol].results.content
      })
      .catch( (error) => {

        //TODO what happen is not ok?  Does it fall here?
        //TODO does reject fall here? 

        console.log("AdTechWatch fetchsite: error caught")
        console.table(error);
        console.error(error);
      });


    }); // forEach
    
  }, // process()

  /*
  @param domain string
  @param protocol string
  @param result object
  @returns none
  */
  add:  function (domain, protocol, results = this.deft) {
    if ( !this.sites[domain] ) { this.sites[domain] = [] };
    if ( !this.sites[domain][protocol] ) { this.sites[domain][protocol] = {}; }

    this.sites[domain][protocol].results = {...this.deft, ...results}; 

    console.log(`AdTechWatch siteMetas: ${protocol}${domain} `, this.sites[domain][protocol]);

  },

  /*
  @param domain string
  @param protocol string
  @returns result object
  */
  get:  function (domain, protocol) { return this.sites[domain][protocol].results },

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
  logdom:  function (domain) { console.table( this.sites[domain] ); },
  logall:  function () { console.table( this.sites ); },
};

siteMetas.init(sites); //from data/sites.js
siteMetas.listall(console.log);

siteMetas.processAll();