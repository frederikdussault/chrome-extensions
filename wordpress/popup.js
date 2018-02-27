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
  var app = {
    name: "wordpress-information-extension"
  }

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

    console.log(app.name);

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

document.addEventListener('DOMContentLoaded', () => {
  // get body classes
  var body = document.getElementsByTagName('body')[0];
  var listInfoBtn = document.getElementsById('listInfoBtn');
  var container = document.getElementsById('container');
  
  
  listInfoBtn.addEventListener('click', () => {


    // FIXME: continue here

    // h1 
    var newh1 = document.createElement("h1"); 
    newh1.appendChild( 
      document.createTextNode("Information")
    );
    container.appendChild( newh1 );

    // list them
    for ( cls of body.className.split(' ') ) {
      console.log(cls);

      // display Wordpress edit url
      logWPEditLink ( cls, "page-id-" );
      logWPEditLink ( cls, "postid-" );

      function logWPEditLink ( classNameString, beginsWithString ) {
        if ( classNameString.includes( beginsWithString ) ) {
          showLink( findId ( classNameString, beginsWithString ) );
        }
      };

      function findId ( string, matchString ) {
        let pos = matchString.length - string.length
        return string.slice( pos );
      };
      
      function showLink ( pageId ) {
        console.log( "  Page edit url: ");
        console.log( "  " + "https://www.texture.ca/wp-admin/post.php?post=" + pageId + "&action=edit" );            
      };
    }
  });

});
