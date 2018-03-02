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

  console.trace('RDM WpInfo ext: trace - getCurrentTabUrl');

  let queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    console.trace('RDM WpInfo ext: trace - chrome.tabs.query');

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

  console.trace('RDM WpInfo ext: trace - addEventListener DOMContentLoaded');

  getCurrentTabUrl( (tab) => {  // this closure is the callback
  
    console.trace('RDM WpInfo ext: trace - within the callback');
    console.log( 'table: ' );
    console.table( tab );
    console.log( 'url: ' + tab.url );

    chrome.tabs.executeScript({ // this execute some code on tab
      code: `{ 
        console.trace('RDM WpInfo ext: trace - chrome.tabs.executeScript 1');
      }`
    });

    /* NOTE: The following block of code does not work. It does not have any collection with previous .executeScript calls
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
    
    // The following does work
    chrome.tabs.executeScript({ // this execute some code on tab
      code: `{ 
        console.trace('RDM WpInfo ext: trace - chrome.tabs.executeScript 3 - calling an injected function');

        var hello = function() { alert("Hello World!!"); }; 
        hello(); 
  
      }`
    });


  }); // end callback
}); // end addEventListener
