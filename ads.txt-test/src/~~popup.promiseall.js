// This extension inject a script in the current tab. Script from which we will fetch information from the DOM.
// The user can select from the testrules which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  /* Popup action functions */

  const nTestbtn = document.querySelector('#btnGoTest'),
    nShowErrorsbtn = document.querySelector('#btnShowErrors'),
    nShowGoodbtn = document.querySelector('#btnShowGood'),
    nShowAllbtn = document.querySelector('#btnShowAll'),
    ntestresults = document.querySelector('#testresults'),
    nStatustext = document.querySelector('#statustext'),
    nVersiontext = document.querySelector('#versiontext'),
    protocol = 'https://',
    altProtocol = 'http://',
    currentVersion = 'v3.8';

  var siteMetas = []; // keep stats of all sites

  nVersiontext.value = currentVersion;

  nTestbtn.addEventListener('click', () => test());
  nShowErrorsbtn.addEventListener('click', () => hideRows('good'));
  nShowGoodbtn.addEventListener('click', () => hideRows('error'));
  nShowAllbtn.addEventListener('click', () => showAll());


  function hideRows(type) {
    let rows = document.querySelectorAll('#testresults tr');

    for (const row of rows) {

      if (row.classList.contains(type)) {
        row.classList.add('hidden');
      } else if (row.classList.contains('hidden')) {
        row.classList.remove('hidden');
      }
    }
  }

  function showAll() {
    let rows = document.querySelectorAll('tr.hidden');

    for (const row of rows) {
      row.classList.remove('hidden');
    }
  }

  // Validates test rules - must be well formated json
  function test() {

    //debugger;
    console.log("Starting site watch");

    reset();

    // sites defined in data/site.js
    sites.forEach((site) => {
      fetchFiles(site, cbAddUiElement);
    });
  }

  function reset() {
    while (ntestresults.firstChild) ntestresults.removeChild(ntestresults.firstChild);
  }


  // Original version
  function fetchSite(site, callback) {
    const file = site + '/ads.txt',
      requestUrl = protocol + file,
      myRequest = new Request(requestUrl);
    var res = {};

    // keep stats of all sites
    siteMetas[file] = {
      pass: false
    };

    /**
     cases
     200: content is received
       * response.ok == true
       * redirected == false: final URL == requested URL
       * redirected == true: final URL != requested URL
         + should display original and final URL (if different)
     404: not found
       * no data received; response.ok == false
       - could it be found if we try with http:// ?
     

     */

    function getMetas(response, file) {
      console.log(file);
      console.table(response);

      res = {
        headers: response.headers,
        ok: response.ok,
        redirected: response.redirected,
        status: response.status,
        statusText: response.statusText,
        type: response.type,
        url: response.url,
        file: file,
        content: ''
      };

      // keep stats of all sites
      siteMetas[file].meta = res;

      return response;
    }

    function handleStatus(fileContent, res) {
      console.log(file);
      console.table(res);

      let destinationUrl = '',
        responseText = '';

      if (res.redirected) destinationUrl = res.url;

      // TODO revise the logic to capture non 200

      if (res.ok) {
        res.content = fileContent;
        responseText = fileContent.split('\n')[0];
      } else {
        responseText = 'ERROR: ' + res.status + ' ' + res.statusText;
      }

      callback(requestUrl, destinationUrl, responseText);

      // keep stats of all sites
      res.pass = true;
    }

    // get file content and add results to result table
    fetch(myRequest)
      .then(response => getMetas(response, file))
      .then(response => response.text())
      .then(fileContent => handleStatus(fileContent, siteMetas[file].meta))
      .catch((error) => {
        // console.table(response);  // response not defined in catch
        console.table(error);
        console.error(error);
        callback(file, '', `Message: Is it a valid URL?<br>ERROR: ${error.name}: <b>${error.message}</b>;<br>Response code: <b>${res.status}</b>`);
      });
  }

  //TODO revise to use promiseAll - return array of promises
  function fetchFiles(site, callback) {
    // site will be received as http://www.domainname.com and https://www.domainname.com on a subsequent call 

    const filepath = site + '/ads.txt';
    var res = {};

    // keep stats of all sites
    siteMetas[filepath] = {
      pass: false
    };

    /**
     cases
     200: content is received
       * response.ok == true
       * redirected == false: final URL == requested URL
       * redirected == true: final URL != requested URL
         + should display original and final URL (if different)
     404: not found
       * no data received; response.ok == false
       - could it be found if we try with http:// ?
     */

    function getMetas(response, file) {
      console.log(file);
      console.table(response);

      res = {
        headers: response.headers,
        ok: response.ok,
        redirected: response.redirected,
        status: response.status,
        statusText: response.statusText,
        type: response.type,
        url: response.url,
        file: file,
        content: ''
      };

      // keep stats of all sites
      siteMetas[file].meta = res;

      return response;
    }

    function handleStatus(fileContent, res) {
      console.log(filepath);
      console.table(res);

      let destinationUrl = '',
        responseText = '';

      if (res.redirected) destinationUrl = res.url;

      // TODO revise the logic to capture non 200

      if (res.ok) {
        res.content = fileContent;
        responseText = fileContent.split('\n')[0];
      } else {
        responseText = 'ERROR: ' + res.status + ' ' + res.statusText;
      }

      callback(requestUrl, destinationUrl, responseText);

      // keep stats of all sites
      res.pass = true;
    }

    function fetchAll(urls) {
      return Promise.all(
        urls.map(url => fetch(url)
          .then(r => r.json())
          .then(data => ({
            data,
            url
          }))
          .catch(error => ({
            error,
            url
          }))
        )
      );
    }

    // TODO: update to use promiseAll - will return an array of promises
    new Promise.all([fetch('https://' + site), fetch('http://' + site)]) // return an Array of promise reponses
      .then(
        response => getMetas(response, filepath)
      ) // store Metas in sites array; pass the Array of promises reponses
      .then(response => {
        // map response array and get an array of texts
        // TODO refactor to use array.forEach loop to return an array of results texts
        response.text();
      })
      .then(
        // handle files' network status; add statuses to ui result table  
        // TODO refactor to process the results array
        fileContent => handleStatus(fileContent, siteMetas[filepath].meta)
      )
      .catch((error) => {
        // console.table(response);  // response not defined in catch
        console.table(error);
        console.error(error);
        callback(filepath, '', `Message: Is it a valid URL?<br>ERROR: ${error.name}: <b>${error.message}</b>;<br>Response code: <b>${res.status}</b>`);
      });
  }

  function cbAddUiElement(name, redirectedTo, data) {
    let newRow = document.createElement("tr"),
      status = (data.includes('ERROR:')) ? 'error' : '',
      version = nVersiontext.value,
      label = '';


    /* validation */

    if (data.includes('ERROR:')) {
      status = 'error';
      label = 'ERROR';
    } else if (data.includes('WARNING:')) {
      status = 'warning';
      label = 'WARNING';
    } else if (data.toLowerCase().includes(version.toLowerCase())) {
      status = 'good';
      label = 'OK';
    } else {
      status = 'warning';
      label = 'WARNING';
    }

    /* insertion in DOM */

    newRow.innerHTML = `    
    <td class="status icon ${ status }">${ label }</td>
    <td class="site"><a href="${ protocol + name }">${ protocol + name }</a><br><a href="${ altProtocol + name }"><i>${ altProtocol + name }</i></a></td>
    <td class="result ${ status }">${ data }</td>
  `;

    newRow.setAttribute('class', (status === 'good') ? 'good' : 'error');

    // add the newly created element and its content into the DOM 
    ntestresults.appendChild(newRow);
  }

  function message(text, opts) {
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
      nStatustext.textContent = text;
      nStatustext.className = opts.class;
    }, opts.delay);
  }

  JSON.isValid = (jsonObj) => {
    debugger;
    try {
      JSON.parse(jsonObj);

      console.log("jsonObj parsed correctly");
      return true;
    } catch (error) {
      console.log("jsonObj not parsed correctly - not a valid JSON format");
      return false;
    }
  }

  JSON.isValidStringified = (jsonObj) => {
    try {
      let stringified = JSON.stringify(jsonObj);

      JSON.parse(stringified);

      console.log("stringified parsed correctly");
      return true;
    } catch (error) {
      console.log("stringified not parsed correctly - not a valid JSON format");

      console.log("Sorry, can't process")
      return false;
    }
  }


}); // end document.addEventListener