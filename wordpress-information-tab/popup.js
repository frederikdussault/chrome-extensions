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
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Inject a script in the current page, script we use to fetch information from the DOM.
 *
 * @param {string} script The script to inject.
 */
function insertCode(script) {
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.

// FIXME: revise to not execute the script BUT insert it.  ref chrome-dev-tools-skeleton/devtools.js
// NOTE: also ref https://stackoverflow.com/questions/13166293/about-chrome-tabs-executescript-id-details-callback
// https://developer.mozilla.org/fr/Add-ons/WebExtensions/API/tabs/executeScript


  // FIXME: Then later in code execute code like this to call selected actions eg where script="rdm.listHtmlClass();"  
  chrome.tabs.executeScript({ // this execute some code
    code: script,
    runAt: "document_end"
  });
}

// This extension inject a script in the current tab. Script from which we will fetch information from the DOM. 
// The user can select from the dropdown which information he wants for the
// current.
document.addEventListener('DOMContentLoaded', () => {

  const script = `
  /*
    RDM Worpress Information Tool 
  */

  var rdm = (function() {

    var domain = window.location.origin;

      return {
          listBodyClass: function() {
        let el = document.getElementsByTagName('body')[0];
        let values = el.className.split(' ');
        let valuesJoined = values.join(''); 

        console.log( 'RDM - List of classes on body tag' );
        if ( valuesJoined ) {
          console.table( values );
        } else {
          console.log( '    No classes found' );
        }
      },
  
      listHtmlClass: function() {
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

      listMetas: function() {
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
      
      listEditUrl: function() {
        let el = document.getElementsByTagName('body')[0];
      
        // list them
        for ( cls of el.className.split(' ') ) {
          // display Wordpress edit url
          logWPEditLink ( cls, "page-id-" );
          logWPEditLink ( cls, "postid-" );
      
          function logWPEditLink ( classNameString, beginsWithString ) {
            if ( classNameString.includes( beginsWithString ) ) {
              showLink( findId ( classNameString, beginsWithString ) );
            }
          };
      
          function findId ( string, matchString ) {
            let pos = matchString.length - string.length;
            return string.slice( pos );
          };
          
          function showLink ( pageId ) {
            console.log( "RDM - Page edit url: ");
            console.log( "  " + window.location.origin + "/wp-admin/post.php?post=" + pageId + "&action=edit" );
          };
        }
      },

      list: function() {
        this.listHtmlClass();
        this.listBodyClass();
        this.listMetas();
        this.listEditUrl();			
      }
      
    };  
  })();   

  rdm.list();
  `;

  getCurrentTabUrl((url) => {
    insertCode(script);

    var dropdown = document.getElementById('dropdown');

    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    dropdown.addEventListener('change', () => {
      // FIXME: add code

      let callback = dropdown.value;
      chrome.tabs.executeScript({
        code: callback
      });
      // callback(); // dropdown.value is a callback function name

    });
  });
});
