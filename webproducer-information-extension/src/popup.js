// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
  
  getCurrentTabUrl( (tab) => {  // this closure is the callback
  
    // get stored values
    let prefixClassInput = document.getElementById('wpclass');
    let wpPrefixClass = chrome.storage.sync.get(['wpPrefixClass'], function(result) {
        console.log('Value currently is ' + result.wpPrefixClass);
    });
    if (wpPrefixClass) 
        prefixClassInput.value = wpPrefixClass;

    // populate the wpclass input field
    let wpclass = document.getElementById('wpclass');

    // populate the task dropdown
    let dropdown = document.getElementById('dropdown');
    buildDropdown(dropdown);
    dropdown.addEventListener('change', function() {

      chrome.tabs.executeScript({ // this execute selected code on tab
        code: `{ 
          ${buildScript()}
  
          rdm.${ this.value }();
        }`
      });

    }); // end addEventListener('change')    

  }); // end callback
}); // end addEventListener


/**
 * @description data used to pop-up drop-down items and associated command to execute
 */
const data = [
  {
      'name': 'list',
      'label': 'All the options',
      'code': function() {
          this.listHtmlClass();
          this.listBodyClass();
          this.listMetas();
          this.listEditUrl();			
      }
  },
  {
      'name': 'listBodyClass',
      'label': 'List classes applied on BODY tag',
      'code': function() {
          let el = document.getElementsByTagName('body')[0];
          let values = el.className.split(' ');
          let valuesJoined = values.join(''); 

          console.log( 'RDM - List of classes on body tag' );
          if ( valuesJoined ) {
              console.table( values );
          } else {
              console.log( '    No classes found' );
          }
      }
  },
  {
      'name': 'listHtmlClass',
      'label': 'List classes applied on HTML tag',
      'code': function() {
          let el = document.getElementsByTagName('html')[0];
          let values = el.className.split(' ');
          let valuesJoined = values.join(''); 
  
          console.log( 'RDM - List of classes on html tag' );
          if ( valuesJoined ) {
          console.table( values );
          } else {
          console.log( '    No classes found' );
          }
      },
  },
  {
      'name': 'listMetas',
      'label': 'List the meta information',
      'code': function() {
          let elems = document.getElementsByTagName('meta'); 
  
          console.log( 'RDM - List of  metas' );
          if ( elems && elems.length > 0 ) {
          console.table( 
              elems, 
              ["name", "property", "http-equiv", "content", "container" ] 
          );
          } else {
          console.log( '    No meta found' );
          }
      },
  },
  {
      'name': 'listEditUrl',
      'label': 'Show Wordpress edit page url',
      'code': function() {
          let el = document.getElementsByTagName('body')[0];
          let elClasses = el.className.split(' ').filter(item => item !== "");
          let found = false;
          let wpClasses = [ "page-id-", "postid-" ];
      
          console.log( "RDM - Wordpress edit page url: ");
          if ( elClasses.length > 0 ) {
            // list them
            for ( let cls of elClasses ) {
              // display Wordpress edit url
              found += logWPEditLink ( cls, wpClasses );
            }
          }
          
          if ( !found ) {
            console.log( '    No Wordpress classes found' );
          }
      },
  }
]; // end data

/**
 * Gets the saved wpclass prefix list.
 *
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedWpclass(inputfield, callback) {
    // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
    // for chrome.runtime.lastError to ensure correctness even when the API call
    // fails.
    chrome.storage.sync.get(['classPrefixes'], (result) => {
      callback(inputfield, chrome.runtime.lastError ? null : result.classPrefixes);
    });
}
/**
 * Update wpclass field value.
 *
 * @param {string} classList comma separated class prefixes 
 */
function initializeWpclassInputField(inputfield, classList) {
    //FIXME: Add code
}

/**
 * @description Build pop-up dropdown
 */
function buildDropdown (dropdown) {

  /**
   * @description build html select field options based on data object
   * @param {string} elementID
   * @param {string} value
   * @param {string} label
   */
  function appendToDropdown ( elemID, value, label ) {
    // create an option: <option value="${value}">${label}</option>
    // add option to elemID
    let optionEl = document.createElement('option');
        optionEl.setAttribute('value', value);
        optionEl.innerHTML = label;
    elemID.appendChild(optionEl);
  }
    
  data.forEach( ({name, label, code}) => { 
      appendToDropdown ( dropdown, name, label );
  });
} // end buildDropdown

/**
 * @description Build script to inject
 * @returns {string} function code to execute
 */
function buildScript () {

  /**
   * @description 
   * @param {string} name function name
   * @param {string} code function code
   * @returns {string} formated code
   */
  function formatCode ( name, code, sep = ',\n\n' ) {
    /* format a code as
      `${name}: ${code.toString()}`
    */
    return `${name}: ${code.toString()}${sep}`
  }

  let scriptString = '';

  // build script
  data.forEach( ({name, label, code}) => { 
      scriptString += formatCode ( name, code );
  });

  return `/* RDM Worpress Information object */

  function logWPEditLink ( classNameString, beginsWithStrings ) {
      let arrBeginsWith = [];
      
      if ( !classNameString || !beginsWithStrings ) return false;

      if ( Array.isArray(beginsWithStrings) ) {
      arrBeginsWith = beginsWithStrings;
      } else if ( typeof(beginsWithStrings) === 'string' ) {
      arrBeginsWith[0] = beginsWithStrings;
      } else 
      return false;

      for (const strBegin of arrBeginsWith) {
      if ( classNameString.includes( strBegin ) ) {
          let idString = findId ( classNameString, strBegin );

          console.log( "  " + window.location.origin + "/wp-admin/post.php?post=" + idString + "&action=edit" );
          return true;
      }        
      }

      return false;
  }

  function findId ( string, matchString ) {
      let pos = matchString.length - string.length;
      return string.slice( pos );
  }

  let rdm = (function() {
      let domain = window.location.origin;

      return {
      ${scriptString}
      }; // end return
  })();   
  `;
} // end buildScript
