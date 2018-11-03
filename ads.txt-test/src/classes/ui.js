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

  init: function (currentVersion, options) {
    this.rowsSelector = options.rowSelector;

    this.nVersiontext   = document.querySelector(options.versiontextSelector);
    this.nTestbtn       = document.querySelector(options.testbtnSelector);
    this.nShowErrorsbtn = document.querySelector(options.showErrorsbtnSelector);
    this.nShowGoodbtn   = document.querySelector(options.showErrorsbtnSelector);
    this.nShowAllbtn    = document.querySelector(options.showAllbtnSelector);
    this.ntestresults   = document.querySelector(options.testresultsSelector);  // TODO 
    this.nStatustext    = document.querySelector(options.statustextSelector);   // TODO 

    this.nVersiontext.value = currentVersion;

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

  cbAddUiElement: function (name, redirectedTo, data) {
    let newRow = document.createElement("tr"),
      status = (data.includes('ERROR:')) ? 'error' : '',
      version = this.nVersiontext.value,  // TODO REVISE: make sure this.points to ui
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
    this.ntestresults.appendChild(newRow);  // TODO REVISE: ntestresults is global
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