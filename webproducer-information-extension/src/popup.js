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

  /**
   * @description format a code as js litteral notation: `${name}: ${code.toString()}`
   * @param {string} name function name
   * @param {string} code function code
   * @returns {string} formated code
   */
  function formatCode ( name, code, sep = ',\n\n' ) {
    return `${name}: ${code.toString()}${sep}`
  }
  
  
  /**
   * @description build html select field options based on tasks object
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
  

  let tasks = [
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
        
            // list them
            for ( let cls of el.className.split(' ') ) {
            // display Wordpress edit url
            logWPEditLink ( cls, "page-id-" );
            logWPEditLink ( cls, "postid-" );      
            }
        },
    }
  ]; // end tasks

  let dropdown = document.getElementById('dropdown');
  tasks.forEach( ({name, label, code}) => { 
    appendToDropdown ( dropdown, name, label );
  });

  let scriptString = '';
  tasks.forEach( ({name, label, code}) => { 
    scriptString += formatCode ( name, code );
  });

  const script = 
  `/* RDM Worpress Information object */

  function logWPEditLink ( classNameString, beginsWithString ) {
    if ( classNameString.includes( beginsWithString ) ) {
      showLink( findId ( classNameString, beginsWithString ) );
    }
  }

  function findId ( string, matchString ) {
    let pos = matchString.length - string.length;
    return string.slice( pos );
  }
  
  function showLink ( pageId ) {
    console.log( "RDM - Page edit url: ");
    console.log( "  " + window.location.origin + "/wp-admin/post.php?post=" + pageId + "&action=edit" );
  }

  let rdm = (function() {

    let domain = window.location.origin;

    return {
      ${scriptString}
    }; // end return
  })();   
  `;

  getCurrentTabUrl( (tab) => {  // this closure is the callback
  
    dropdown.addEventListener('change', function() {

      chrome.tabs.executeScript({ // this execute selected code on tab
        code: `{  
          ${script}
  
          rdm.${ this.value }();
        }`
      });
  

    }); // end addEventListener('change')

    /* NOTE The following block of code does not work. It does not have any collection with previous .executeScript calls
    let script = 'var hello = function() { alert("Hello World!!"); } ';
    chrome.tabs.executeScript({ // this execute some code on tab
      code: `{ 
        console.trace('RDM WpInfo ext: trace - chrome.tabs.executeScript 2'); 
        let sElement = document.createElement('script');
        sElement.setAttribute('id', 'WpInfoExt');
        sElement.innerHTML = '${script}';
        document.querySelector('head').appendChild(sElement);
      }`
    });

    chrome.tabs.executeScript({ // this execute some code on tab
      code: `{ 
        console.trace('RDM WpInfo ext: trace - chrome.tabs.executeScript 3 - calling an injected function'); 
        window.hello();

      }`
    });
    */
    
  }); // end callback
}); // end addEventListener
