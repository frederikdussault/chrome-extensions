/*eslint no-unused-vars: 0*/
/*global sites siteMetas ui*/
/**
 * UI.js
 */
var ui = {
  rowsSelector: '',
  init: function (options) {
    this.rowsSelector = options.rowsSelector;
  },

  hideRows: function (type) {
    let rows = document.querySelectorAll(this.rowsSelector);

    for (const row of rows) {

      if (row.classList.contains(type)) {
        row.classList.add('hidden');
      } else if (row.classList.contains('hidden')) {
        row.classList.remove('hidden');
      }
    }
  },

  showAll: function () {
    let rows = document.querySelectorAll('tr.hidden');

    for (const row of rows) {
      row.classList.remove('hidden');
    }
  },

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
  },

  reset: function () {
    while (ntestresults.firstChild) ntestresults.removeChild(ntestresults.firstChild); // TODO REVISE: ntestresults is global
  },

  cbAddUiElement: function (name, redirectedTo, data) {
    let newRow = document.createElement("tr"),
      status = (data.includes('ERROR:')) ? 'error' : '',
      version = nVersiontext.value,  // TODO REVISE: nVersiontext is global
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
    ntestresults.appendChild(newRow);  // TODO REVISE: ntestresults is global
  },

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
      nStatustext.textContent = text;  // TODO REVISE: nStatustext is global
      nStatustext.className = opts.class;
    }, opts.delay);
  },




};