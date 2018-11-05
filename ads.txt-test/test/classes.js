/*! ads.txt-watch-tool - v1.0.2 - 2018-11-05 */

/* ====================================
 * Source: src/data/sites.js
 * ==================================== */

var sites = [
    'zzz.notgood.zzz', 
    'www.educatall.com', 
    'www.1019rock.ca', 
    'www.1053rock.ca', 
    'www.1061chez.ca', 
    'www.1067rock.ca', 
    'www.1310news.com', 
    'www.570news.com', 
    'www.660news.com', 
    'www.680news.com', 
    'www.921citi.ca', 
    'www.921rock.ca', 
    'www.927rock.ca', 
    'www.959chfm.com', 
    'www.977rock.ca', 
    'www.979rock.ca', 
    'www.btcalgary.ca', 
    'www.btmontreal.ca', 
    'www.bttoronto.ca', 
    'www.btvancouver.ca', 
    'www.chatelaine.com', 
    'www.chfi.com', 
    'www.chymfm.com', 
    'www.cityline.tv', 
    'www.citynews.ca', 
    'www.citytv.com', 
    'www.country1011.com', 
    'www.country1043.com', 
    'www.country1067.com', 
    'www.country1071.com', 
    'www.country600.com', 
    'www.country933.com', 
    'www.country935.ca', 
    'dinnertelevision.ca', 
    'edmonton.citynews.ca', 
    'www.educatout.com', 
    'www.flare.com', 
    'fr.chatelaine.com', 
    'www.fxnowcanada.ca', 
    'www.halifaxtoday.ca', 
    'www.jack1023.com', 
    'www.jack923.com', 
    'www.jack929.com', 
    'www.jack969.ca', 
    'www.jack969.com', 
    'www.kiss1023.ca', 
    'www.kiss1027.fm',
    'www.kiss1031.ca', 
    'www.kiss1077.ca', 
    'www.kiss917.com', 
    'www.kiss925.com', 
    'www.kiss959.com', 
    'www.kissnorthbay.com', 
    'www.kissottawa.com', 
    'www.kissradio.ca', 
    'www.kisssoo.com', 
    'www.kisssudbury.com', 
    'www.kisstimmins.com', 
    'www.kitchenertoday.com', 
    'www.krock1057.ca', 
    'www.macleans.ca', 
    'www.moneysense.ca', 
    'montreal.citynews.ca', 
    'www.mountainfm.ca', 
    'www.mountainfm.com', 
    'www.mymcmurray.com', 
    'www.news957.com', 
    'www.ocean985.com', 
    'www.oln.ca', 
    'www.omnitv.ca', 
    'www.ottawamatters.com', 
    'www.parfaitemamancinglante.com', 
    'www.sonic1029.com', 
    'www.sportsnet.ca',
    'www.starfm.com', 
    'www.todaysparent.com', 
    'toronto.citynews.ca', 
    'www.tsisports.ca', 
    'veroniquecloutier.com', 
    'www.weather.com', 
    'winnipeg.citynews.ca', 
    'www.worldfm.ca'
    ];
    


/* ====================================
 * Source: src/classes/sitemetas.js
 * ==================================== */

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
    });
  },

  /**
   * Fetch a single sites -- from 1.2.4
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
          callback('', `ERROR: File ${file} - Response code: ${response.status}`);
          throw new Error('Something went wrong on api server!');
        }
      })
      .then(responseText => {
        callback(file, responseText.split('\n')[0]);
      })
      .catch( (error) => {
        console.error(error);
        callback(file, `Message: Is it a valid URL?<br>ERROR: ${error.name}: <b>${error.message}</b>;<br>Response code: <b>${res.status}</b>`);
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

      fetch(file, {
          mode: "no-cors",
          cache: "no-cache",
          redirect: "follow",
          //referrer: "no-referrer"
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


    }); // forEach

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


/* ====================================
 * Source: src/classes/ui.js
 * ==================================== */

/*eslint no-unused-vars: 0*/
/*global sites siteMetas ui*/

var ui = {
  rowsSelector: '',
  ntestresults: '',
  nTestbtn: '',
  nShowErrorsbtn: '',
  nShowGoodbtn: '',
  nShowAllbtn: '',
  ntestresults: '',
  nStatustext: '',
  nVersiontext: '',
  currentVersion: '',

  init: function (currentVersion, options) {
    this.rowsSelector = options.rowSelector;

    this.nVersiontext   = document.querySelector(options.versiontextSelector);
    this.nTestbtn       = document.querySelector(options.testbtnSelector);
    this.nShowErrorsbtn = document.querySelector(options.showErrorsbtnSelector);
    this.nShowGoodbtn   = document.querySelector(options.showErrorsbtnSelector);
    this.nShowAllbtn    = document.querySelector(options.showAllbtnSelector);
    this.ntestresults   = document.querySelector(options.testresultsSelector);  // TODO 
    this.nStatustext    = document.querySelector(options.statustextSelector);   // TODO 

    this.nVersiontext.value = this.currentVersion = currentVersion;

    // TODO see if this points to ui, if not use self
    this.nTestbtn.addEventListener('click', () => this.test(siteMetas.processAll));
    this.nShowErrorsbtn.addEventListener('click', () => this.hideRows('good'));
    this.nShowGoodbtn.addEventListener('click',   () => this.hideRows('error'));
    this.nShowAllbtn.addEventListener('click',    () => this.showAll());
  }, /// init

  hideRows: function (type) {
    let rows = document.querySelectorAll(this.rowsSelector);

    for (const row of rows) {

      if (row.classList.contains(type)) {
        row.classList.add('hidden');
      } else if (row.classList.contains('hidden')) {
        row.classList.remove('hidden');
      }
    }
  }, /// hideRows

  showAll: function () {
    let rows = document.querySelectorAll('tr.hidden');

    for (const row of rows) {
      row.classList.remove('hidden');
    }
  }, /// showAll

  // Validates test rules - must be well formated json
  test: function (cbProcess) {

    //debugger;
    console.log("AdTechWatch: Starting site watch");

    this.reset();

    // will fire processDone event
    cbProcess();

    /* 
        // sites defined in data/site.js
        sites.forEach((site) => {
          fetchSite(site, cbAddUiElement);
        });
     */
  }, /// test

  reset: function () {
    while (this.ntestresults.firstChild) 
      this.ntestresults.removeChild(this.ntestresults.firstChild); // TODO REVISE: make sure this.points to ui
  }, /// reset

  getValidationLabels: function (data) {
    let status;

    if (data.includes('ERROR:')) {
      status = 'error';
    } else if (data.toLowerCase().includes(this.currentVersion.toLowerCase())) {
      status = 'good';
    } else {
      status = 'warning';
    }

    return status;
  },

  statusLabel: function (status) {
    let label;

    switch (status) {
      case 'error':
        label = 'ERROR';
        break;
      case 'warning':
        label = 'WARNING';
        break;
      case 'good':
        label = 'OK';
        break;
      default:
        label = 'WARNING';
    }

    return label;
  },

  createNewRow: function (status, label, name, data) {
    let newRow = document.createElement("tr");

    newRow.innerHTML = `    
        <td class="status icon ${ status }">${ label }</td>
        <td class="site"><a href="${ name }">${ name }</a></td>
        <td class="result ${ status }">${ data }</td>
      `;
    newRow.setAttribute('class', (status === 'good') ? 'good' : 'error');

    return newRow;
  },

  cbAddUiElement: function (name, redirectedTo, data) {
    let version = this.nVersiontext.value,  // TODO REVISE: make sure this.points to ui
      label = this.getValidationLabels(data),
      status = this.statusLabel(label),
      newRow = this.createNewRow(status, label, name, data);

    /* insertion in DOM */
    // add the newly created element and its content into the DOM 
    this.ntestresults.appendChild(newRow);
  }, /// cbAddUiElement

  message: function (text, opts) {
    const defaultOpts = {
      class: 'msg',
      delay: 1000
    };

    opts = {
      ...defaultOpts,
      ...opts
    };

    console.log(text);
    setTimeout(function () {
      this.nStatustext.textContent = text;  // TODO REVISE: make sure this points to ui
      this.nStatustext.className = opts.class;
    }, opts.delay);
  }, /// message

}; /// ui.js


/* ====================================
 * Source: src/classes/utils.js
 * ==================================== */

JSON.isValid = (jsonObj) => {
    try {
        JSON.parse( jsonObj );
        
        console.log( "jsonObj parsed correctly" );
        return true;
    } catch (error) {
        console.log( "jsonObj not parsed correctly - not a valid JSON format" );
        return false;
    }
};

JSON.isValidStringified = (jsonObj) => {
    try {
        let stringified = JSON.stringify( jsonObj );

        JSON.parse( stringified );
        
        console.log( "stringified parsed correctly" );
        return true;
    } catch (error) {
        console.log( "stringified not parsed correctly - not a valid JSON format" );

        console.log("Sorry, can't process");
        return false;
    }
};
