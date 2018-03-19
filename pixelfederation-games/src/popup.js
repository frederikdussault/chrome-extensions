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
  

  let data = [
    {
      'name': 'seaport',
      'label': 'Seaport',
      'code': function() {
        // Seaport.js
        let h = 900; // height

        let rightCol = document.querySelector('#rightCol');
        if (rightCol) rightCol.remove();

        let elems = document.querySelectorAll('#header, #footer');
        if (elems) {
          for ( let elem of elems ) {
                elem.style.display = 'none';
          }
        }

        let game_frame = document.querySelector('iframe.game-iframe').contentDocument;
        if (game_frame) {
          game_frame.body.style.height = (h+10)+'px';

          let game = game_frame.querySelector('#Game');
          if (game) {
            game.style.height = h+'px';
          }

          let frame_sections = game_frame.querySelectorAll('.header, .player_bar, .top_menu, .flash_update, .bottom_links');
          if (frame_sections) {
            for ( let elem of frame_sections ) {
              elem.style.display = 'none';
            }
          }
        }
      }
    },
    {
      'name': 'trainstation',
      'label': 'TrainStation',
      'code': function() {
        // trainsStation.js
        document.querySelector('#fb-root  div').remove();
      },
    },
  ]; // end data
  let dropdown = document.getElementById('dropdown');

  let scriptString = '';
  data.forEach( ({name, label, code}) => { 
    // build dropdown
    appendToDropdown ( dropdown, name, label );

    // build script
    scriptString += formatCode ( name, code );
  });
  const script = 
  `/* Screen Stretcher for Pixel Federation Games extension */

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
          console.trace('RDM WpInfo ext: trace - chrome.tabs.executeScript - calling an injected function');
  
          debugger;

          //inject jquery
          if ( typeof(jQuery) !== 'function' ) {
            let elScript = document.createElement('script'); 
            elScript.type = 'text/javascript';
            elScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js';
            document.querySelector('body').appendChild(elScript);
          }
        
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
