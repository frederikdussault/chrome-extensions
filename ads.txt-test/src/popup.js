// This extension inject a script in the current tab. Script from which we will fetch information from the DOM.
// The user can select from the testrules which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  /* Popup action functions */

  const currentVersion = 'v4.5',
    nTestbtn = document.querySelector('#btnGoTest'),
    nShowErrorsbtn = document.querySelector('#btnShowErrors'),
    nShowGoodbtn = document.querySelector('#btnShowGood'),
    nShowAllbtn = document.querySelector('#btnShowAll'),
    ntestresults = document.querySelector('#testresults'),
    nStatustext = document.querySelector('#statustext'),
    nVersiontext = document.querySelector('#versiontext'),
    protocol = 'http://',
    altProtocol = 'https://';

  nVersiontext.value = currentVersion;
  nTestbtn.addEventListener('click', () => validate());
  nShowErrorsbtn.addEventListener('click', () => hideRows('good'));
  nShowGoodbtn.addEventListener('click', () => hideRows('error'));
  nShowAllbtn.addEventListener('click', () => showAll());

  const buster = '?' + Date.now();

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

  function resetResultTable() {
    while (ntestresults.firstChild) ntestresults.removeChild(ntestresults.firstChild);
  }


  // Validates test rules - must be well formated json
  function validate() {
    //debugger;
    console.log("Starting site watch");

    resetResultTable();

    let fetchWorker = new Worker("fetchworker.js");
    fetchWorker.postMessage(sites);
    fetchWorker.onmessage = function (e) {

      // TODO when worker done
      let results = e.data; // TODO verify what is the name of the data

      // sort data
      results.sort(sortOnSite);

      // loop addElement on returned data
      // TODO add code
    }
  }

  function sortOnSite(dictA, dictB) {
    if (dictA.site > dictB.site) return 1;
    if (dictA.site < dictB.site) return -1;
    return 0;
  }

  /**
   * 
   * @param {*} name 
   * @param {*} data 
   */
  function addElement(name, data) {
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
    <td class="status icon ${ status}">${label}</td>
    <td class="site"><a href="${ protocol + name + buster}">${protocol + name}</a><br><a href="${altProtocol + name + buster}"><i>${altProtocol + name}</i></a></td>
    <td class="result ${ status}">${data}</td>
  `;

    newRow.setAttribute('class', (status === 'good') ? 'good' : 'error');

    // add the newly created element and its content into the DOM 
    ntestresults.appendChild(newRow);
  }

  // eslint-disable-next-line no-unused-vars
  function message(text, opts) {
    const defaultOpts = {
      class: 'msg',
      delay: 1000
    };

    opts = { ...defaultOpts, ...opts };

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
