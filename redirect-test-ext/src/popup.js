// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/* https://www.texture.ca/wp-admin/tools.php?page=redirection.php */

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {

  let queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {

    let tab = tabs[0];
    let url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(tab); // callback will use tab information such as url for storage
  });
}



// This extension inject a script in the current tab. Script from which we will fetch information from the DOM.
// The user can select from the dropdown which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  /**
   * @description build html select field options based on data object
   * @param {HTMLElement} elementID
   * @param {string} name
   * @param {Array} arr
   */
  function appendRadioButtons ( container, index, name) {
    // create an option: <option value="${value}">${label}</option>
    // add option to container

    //debugger;

    let elId = container.id;
    let radioId = elId + '_' + index;

    let div = document.createElement('div');

    let radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', elId);
        radio.setAttribute('id', radioId);
        radio.setAttribute('class', 'radio');
        radio.setAttribute('value', index);
    div.appendChild(radio);

    let label = document.createElement('label');
        label.setAttribute('for', radioId);
        label.innerHTML = name;
    div.appendChild(label);

    container.appendChild(div);
  }


  /**
   * @description build the task dropbox
   * @param {HTMLElement} dropdown
   */
  const buildDropdown = (dropdown, taskArray) => {
    /**
     * @description build html select field options based on data object
     * @param {string} elementID
     * @param {string} value
     * @param {string} label
     */
    function appendToDropdown ( elemID, label, value ) {
      // create an option: <option value="${value}">${label}</option>
      // add option to elemID
      let option = document.createElement('option');
          option.setAttribute('value', value);
          option.innerHTML = label;
      elemID.appendChild(option);
    }

    taskArray.forEach( ({name, label, code}, index) => appendToDropdown ( dropdown, label, index ) );
  };


  /**
   * @description build the radio selectors
   * @param {HTMLElement} testselector
   * @param {Collection of test blocks}
   * @returns {NodeList} radio selectors
   */
  const buildRadioSelector = (testselector, testblocks) => {
    //debugger;

    for ([name, value] of Object.entries(testblocks) ) {
      console.log( name, value  );

      appendRadioButtons (
        testselector,
        name, // eg 'DNR' or 'taxtest'  usefull to access the data
        value.label )
    }

    return testselector.querySelectorAll('.radio');
  };

  /**
   * @description create an array of selected testblocks
   * @param {HTMLElements} inputSelectors
   * @param {Collection of test blocks} testblocks
   * @returns Array of selected testblocks keys
   */
  const getSelectedRadio = (inputSelectors) => {

    //debugger;

    let selectedRadio = [];

    inputSelectors.forEach( (input) => {
      if ( input.checked  ) {
        selectedRadio.push( input.value );
      }
    });

    return selectedRadio;
  };

  /* --------------------------------------------------------------------- */

  getCurrentTabUrl( (tab) => {  // this closure is the callback

    let dropdown = document.getElementById('dropdown');
    let testselector = document.getElementById('testselector');

    // inject tasks functions
    chrome.tabs.executeScript(null,
      {file:"tasks/alltasks.js"});
    chrome.tabs.executeScript(null,
      {file:"tasks/redirectiontasks.js"});
    chrome.tabs.executeScript(null,
      {file:"tasks/test-series.js"});

    let tasks = [
      {
        'name': 'expandRedirectRules',
        'label': 'Expand all rules',
        'code': function() {
          chrome.tabs.executeScript(null, {code:"expandRedirectRules()"});
        }
      },
      {
        'name': 'displayRedirectionRulesNames',
        'label': 'Get and list redirection rules names',
        'code': function() {
          chrome.tabs.executeScript(null, {code:"displayRedirectionRulesNames()"});
        }
      },
      {
        'name': 'displayRedirectionRulesAsTabulatedCSV',
        'label': 'Get and list redirection rules as csv',
        'code': function() {
          chrome.tabs.executeScript({
            code: "displayRedirectionRulesAsTabulatedCSV();"
          });
        }
      },
      {
        'name': 'displayRedirectionRulesAsJson',
        'label': 'Get redirection rules as json',
        'code': function() {
          chrome.tabs.executeScript({
            code: "displayRedirectionRulesAsJson();"
          });
        }
      },
      {
        'name': 'execRedirectionTest',
        'label': 'Test the redirections',
        'code': function() {
          chrome.tabs.executeScript(null,
            {code:"execRedirectionTest( ['DNR'] );"}
          );

        } // end code

      },
    ]; // end tasks

    buildDropdown(dropdown, tasks);
    dropdown.addEventListener('change', function() {

      //debugger;

      tasks[ this.value ].code(); // this execute selected code on tab

    });

    let radioSelectors = buildRadioSelector(testselector, testblocks);
    testselector.addEventListener('change', function() {
      chrome.tabs.executeScript(null,
        {code:"execRedirectionTest(" + JSON.stringify( getSelectedRadio(radioSelectors) ) + ");"}
      );
    });

  }); // end getCurrentTabUrl callback
}); // end document.addEventListener
